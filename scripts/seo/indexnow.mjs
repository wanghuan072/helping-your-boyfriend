import { diff, batches, validate } from './manifest.mjs';
import { loadGitHubCheckpoint, saveGitHubCheckpoint } from './github-checkpoint.mjs';

export function filterEvent(event, config, manual = false) {
  const p = manual ? { id: event.inputs?.deployment_id, project: { id: event.inputs?.project_id }, environment: 'production' } : event.client_payload;
  if (!p || p.project?.id !== config.projectId || p.environment !== 'production' || !/^dpl_[a-zA-Z0-9]+$/.test(p.id ?? '')) return null;
  if (!manual) {
    if (!['vercel.deployment.success','vercel.deployment.promoted'].includes(event.action) || !['success','promoted'].includes(p.state?.type) || !/^[a-f0-9]{40}$/i.test(p.git?.sha ?? '')) return null;
    try { const u = new URL(p.url); if (u.protocol !== 'https:' || !u.hostname.endsWith('.vercel.app') || u.port || u.username || u.password || u.pathname !== '/' || u.search || u.hash) return null; } catch { return null; }
  }
  return p;
}

async function json(response) {
  if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw new Error(`Expected successful JSON response (${response.status})`);
  const text = await response.text();
  if (Buffer.byteLength(text) > 10 * 1024 * 1024) throw new Error('JSON response exceeds limit');
  return JSON.parse(text);
}

export async function verifyDeployment(candidate, config, fetcher = fetch) {
  if (!/^prj_[a-zA-Z0-9]+$/.test(config.projectId ?? '') || !/^dpl_[a-zA-Z0-9]+$/.test(candidate.id ?? '')) throw new Error('Invalid project/deployment identity');
  if (!config.readToken) throw new Error('Read-only Vercel verification credential is missing');
  const origin = new URL(config.siteUrl);
  if (origin.protocol !== 'https:' || origin.origin !== config.siteUrl) throw new Error('SITE_URL must be a fixed HTTPS origin');
  const query = config.teamId ? `&teamId=${encodeURIComponent(config.teamId)}` : '';
  const control = async path => json(await fetcher(`https://api.vercel.com${path}${path.includes('?') ? query : query.replace('&','?')}`, {
    headers: { authorization: `Bearer ${config.readToken}` }, redirect: 'manual', signal: AbortSignal.timeout(15_000),
  }));
  const [deployment, project, domain] = await Promise.all([
    control(`/v13/deployments/${candidate.id}?withGitRepoInfo=true`),
    control(`/v9/projects/${config.projectId}`),
    control(`/v9/projects/${config.projectId}/domains/${origin.hostname}`),
  ]);
  const sha = deployment.gitSource?.sha ?? deployment.meta?.githubCommitSha;
  const projectId = deployment.projectId ?? deployment.project?.id;
  const url = new URL(`https://${deployment.url}`);
  if (deployment.id !== candidate.id || projectId !== config.projectId || project.id !== config.projectId || domain.projectId !== config.projectId || !domain.verified || domain.redirect || domain.gitBranch || domain.customEnvironmentId) throw new Error('Deployment or canonical domain does not belong to configured production project');
  if (deployment.readyState !== 'READY' || deployment.target !== 'production' || !/^[a-f0-9]{40}$/i.test(sha ?? '') || !url.hostname.endsWith('.vercel.app') || url.origin !== `https://${deployment.url}`) throw new Error('Deployment is not a verified successful production deployment');
  if ((candidate.url && new URL(candidate.url).origin !== url.origin) || (candidate.git?.sha && candidate.git.sha !== sha)) throw new Error('Dispatch URL/Git SHA disagree with Vercel control plane');
  if (project.targets?.production?.id !== deployment.id) return null; // superseded event
  if (!deployment.alias?.includes(origin.hostname)) throw new Error('Canonical domain not assigned to verified deployment');
  return { id: deployment.id, projectId, origin: url.origin, sha, environment: 'production' };
}

export async function submit({ current, checkpoint, checkpointEtag, bootstrapBaseline, verified, config, fetcher = fetch, reverify, bootstrap = false, sleep = ms => new Promise(resolve => setTimeout(resolve, ms)) }) {
  validate(current, config.siteUrl);
  if (checkpoint) {
    if (checkpoint.projectId !== verified.projectId || checkpoint.environment !== 'production' || !checkpointEtag || !/^dpl_[a-zA-Z0-9]+$/.test(checkpoint.deploymentId ?? '')) throw new Error('Invalid persistent checkpoint identity/version');
    if (checkpoint.deploymentId === verified.id) return { skipped: 'already accepted' };
  }
  if (!checkpoint && !bootstrap) throw new Error('Missing persistent checkpoint: explicitly authorize initial bootstrap');
  const changes = diff(checkpoint?.manifest ?? (bootstrap ? bootstrapBaseline : undefined), current, { bootstrap });
  const urls = [...new Set([...changes.added, ...changes.updated, ...changes.deleted])].sort();
  const key = config.key;
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(key ?? '')) throw new Error('Valid IndexNow key is missing');
  const keyUrl = new URL(`/${key}.txt`, config.siteUrl);
  const keyResponse = await fetcher(keyUrl, { redirect: 'manual', signal: AbortSignal.timeout(15_000) });
  if (!keyResponse.ok || (await keyResponse.text()) !== key) throw new Error('Canonical root key file is not publicly accessible or does not match');
  for (const url of changes.deleted) {
    const r = await fetcher(url, { redirect: 'manual', signal: AbortSignal.timeout(15_000) });
    if ([301,308].includes(r.status)) {
      const location = new URL(r.headers.get('location') ?? '', url);
      if (!current.entries.some(entry => entry.indexable && entry.canonicalUrl === location.href)) throw new Error('Deleted URL redirect does not point to a current canonical');
    } else if (![404,410].includes(r.status)) throw new Error('Deleted URL still accessible; refusing deletion notification');
  }
  if (!await reverify()) return { skipped: 'production changed before submission' };
  for (const batch of batches(urls)) {
    let accepted = false;
    for (let attempt = 0; attempt < 4; attempt++) {
      const response = await fetcher('https://api.indexnow.org/indexnow', {
        method: 'POST', headers: { 'content-type': 'application/json' }, redirect: 'manual', signal: AbortSignal.timeout(20_000),
        body: JSON.stringify({ host: new URL(config.siteUrl).host, key, keyLocation: keyUrl.href, urlList: batch }),
      });
      if ([200,202].includes(response.status)) { accepted = true; break; }
      if (response.status !== 429 || attempt === 3) throw new Error(`IndexNow rejected batch (${response.status}); checkpoint NOT advanced`);
      const retry = Number(response.headers.get('retry-after'));
      await sleep(Math.min(30_000, retry > 0 ? retry * 1000 : 1000 * 2 ** attempt));
    }
    if (!accepted) throw new Error('IndexNow retry exhausted');
  }
  if (!await reverify()) throw new Error('Production changed during submission; checkpoint NOT advanced');
  const next = { schemaVersion: 1, projectId: verified.projectId, environment: 'production', deploymentId: verified.id, confirmedAt: new Date().toISOString(), manifest: current };
  if (config.checkpointBackend === 'github') {
    await saveGitHubCheckpoint(next, checkpointEtag, config, fetcher);
    return { accepted: urls.length, changes, checkpoint: 'github', message: 'Protocol receipt only; not a crawling/indexing guarantee' };
  }
  const stored = await fetcher(config.checkpointUrl, {
    method: 'PUT', headers: { authorization: `Bearer ${config.storageToken}`, 'content-type': 'application/json', ...(checkpointEtag ? { 'if-match': checkpointEtag } : { 'if-none-match': '*' }) },
    redirect: 'manual', signal: AbortSignal.timeout(15_000), body: JSON.stringify(next),
  });
  if ([409,412].includes(stored.status)) throw new Error('Checkpoint CAS conflict: rerun to reload and recompute; old checkpoint not overwritten');
  if (!stored.ok || !stored.headers.get('etag') || stored.headers.get('etag').startsWith('W/')) throw new Error('Conditional checkpoint write not confirmed with strong ETag');
  return { accepted: urls.length, changes, message: 'Protocol receipt only; not a crawling/indexing guarantee' };
}

export async function loadCheckpoint(config, fetcher = fetch) {
  if (config.checkpointBackend === 'github') return loadGitHubCheckpoint(config, fetcher);
  const url = new URL(config.checkpointUrl);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || !url.pathname.endsWith(`/${config.projectId}/production.json`)) throw new Error('Checkpoint endpoint must be fixed HTTPS, project/environment scoped, and support conditional PUT');
  if (!config.storageToken) throw new Error('Persistent checkpoint credential missing');
  const response = await fetcher(url, { headers: { authorization: `Bearer ${config.storageToken}` }, redirect: 'manual', signal: AbortSignal.timeout(15_000) });
  if (response.status === 404) return { checkpoint: null, checkpointEtag: null };
  const checkpoint = await json(response);
  const checkpointEtag = response.headers.get('etag');
  if (!checkpointEtag || checkpointEtag.startsWith('W/')) throw new Error('Checkpoint storage must provide strong ETag compare-and-swap');
  validate(checkpoint.manifest, config.siteUrl);
  return { checkpoint, checkpointEtag };
}

export async function deploymentManifest(verified, config, fetcher = fetch) {
  // This credential is attached only AFTER independent control-plane verification.
  const response = await fetcher(`${verified.origin}/.well-known/seo-url-manifest.json`, {
    headers: config.bypass ? { 'x-vercel-protection-bypass': config.bypass } : {}, redirect: 'manual', signal: AbortSignal.timeout(15_000),
  });
  const current = await json(response);
  validate(current, config.siteUrl);
  return current;
}
