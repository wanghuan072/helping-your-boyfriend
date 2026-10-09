import { validate } from './manifest.mjs';

const branch = 'indexnow-checkpoints';
const shaPattern = /^[a-f0-9]{40}$/;

function client(config, fetcher) {
  if (config.checkpointRepository !== 'wanghuan072/helping-your-boyfriend' || !config.githubToken || !/^prj_[a-zA-Z0-9]+$/.test(config.projectId ?? '')) throw new Error('GitHub checkpoint repository/token/project configuration missing or invalid');
  const filename = `${config.projectId}-production.json`;
  const api = async (suffix, method = 'GET', body) => {
    const response = await fetcher(`https://api.github.com/repos/${config.checkpointRepository}/git/${suffix}`, {
      method, redirect: 'manual', signal: AbortSignal.timeout(15_000),
      headers: { authorization: `Bearer ${config.githubToken}`, accept: 'application/vnd.github+json', 'x-github-api-version': '2026-03-10', ...(body ? { 'content-type': 'application/json' } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (response.status === 404 && method === 'GET' && suffix === `ref/heads/${branch}`) return null;
    if ([409, 422].includes(response.status)) throw new Error('Checkpoint CAS conflict or rejected Git operation: rerun to reload; existing record not overwritten');
    if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw new Error(`GitHub checkpoint request failed (${response.status})`);
    const text = await response.text();
    if (Buffer.byteLength(text) > 10 * 1024 * 1024) throw new Error('GitHub checkpoint response exceeds size limit');
    return JSON.parse(text);
  };
  return { api, filename };
}

function assertSha(value) {
  if (!shaPattern.test(value ?? '')) throw new Error('Invalid GitHub checkpoint object SHA');
  return value;
}

export async function loadGitHubCheckpoint(config, fetcher = fetch) {
  const { api, filename } = client(config, fetcher);
  const ref = await api(`ref/heads/${branch}`);
  if (!ref) return { checkpoint: null, checkpointEtag: null };
  if (ref.ref !== `refs/heads/${branch}` || ref.object?.type !== 'commit') throw new Error('Unexpected GitHub checkpoint branch');
  const head = assertSha(ref.object.sha);
  const commit = await api(`commits/${head}`);
  const tree = await api(`trees/${assertSha(commit.tree?.sha)}`);
  if (tree.truncated || !Array.isArray(tree.tree)) throw new Error('Incomplete GitHub checkpoint tree');
  const item = tree.tree.find(entry => entry.path === filename);
  if (!item) return { checkpoint: null, checkpointEtag: head };
  if (item.type !== 'blob' || item.mode !== '100644') throw new Error('Checkpoint must be an ordinary JSON file');
  const blob = await api(`blobs/${assertSha(item.sha)}`);
  if (blob.encoding !== 'base64' || typeof blob.content !== 'string' || blob.size > 5 * 1024 * 1024) throw new Error('Invalid GitHub checkpoint blob');
  const checkpoint = JSON.parse(Buffer.from(blob.content, 'base64').toString('utf8'));
  if (checkpoint.schemaVersion !== 1 || checkpoint.projectId !== config.projectId || checkpoint.environment !== 'production' || !/^dpl_[a-zA-Z0-9]+$/.test(checkpoint.deploymentId ?? '') || !Number.isFinite(Date.parse(checkpoint.confirmedAt))) throw new Error('Invalid GitHub checkpoint identity');
  validate(checkpoint.manifest, config.siteUrl);
  return { checkpoint, checkpointEtag: head };
}

export async function saveGitHubCheckpoint(next, expectedHead, config, fetcher = fetch) {
  const { api, filename } = client(config, fetcher);
  // Only public URL state is persisted, never environment variables or keys.
  if (next.schemaVersion !== 1 || next.projectId !== config.projectId || next.environment !== 'production' || !/^dpl_[a-zA-Z0-9]+$/.test(next.deploymentId ?? '') || !Number.isFinite(Date.parse(next.confirmedAt))) throw new Error('Invalid checkpoint write identity');
  validate(next.manifest, config.siteUrl);
  const record = { schemaVersion: 1, projectId: next.projectId, environment: 'production', deploymentId: next.deploymentId, confirmedAt: next.confirmedAt, manifest: next.manifest };
  const content = JSON.stringify(record, null, 2) + '\n';
  if (Buffer.byteLength(content) > 5 * 1024 * 1024) throw new Error('GitHub checkpoint exceeds supported size');
  let baseTree;
  if (expectedHead) baseTree = assertSha((await api(`commits/${assertSha(expectedHead)}`)).tree?.sha);
  const blob = await api('blobs', 'POST', { content, encoding: 'utf-8' });
  const tree = await api('trees', 'POST', { ...(baseTree ? { base_tree: baseTree } : {}), tree: [{ path: filename, mode: '100644', type: 'blob', sha: assertSha(blob.sha) }] });
  const commit = await api('commits', 'POST', { message: `Record accepted IndexNow production ${next.deploymentId}`, tree: assertSha(tree.sha), parents: expectedHead ? [expectedHead] : [] });
  const head = assertSha(commit.sha);
  // A sibling racing commit cannot fast-forward from expectedHead. Never force.
  const saved = expectedHead
    ? await api(`refs/heads/${branch}`, 'PATCH', { sha: head, force: false })
    : await api('refs', 'POST', { ref: `refs/heads/${branch}`, sha: head });
  if (saved.ref !== `refs/heads/${branch}` || saved.object?.sha !== head) throw new Error('GitHub checkpoint write not confirmed');
}
