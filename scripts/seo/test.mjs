import assert from 'node:assert/strict';
import { fingerprint, seoInputs } from './semantic-html.mjs';
import { buildManifest, diff, batches, sitemapChunks, validate } from './manifest.mjs';
import { filterEvent, verifyDeployment, deploymentManifest, loadCheckpoint, submit } from './indexnow.mjs';
import { sitemapRewrites, sitemapIndexXml } from '../../seo/sitemap-policy.js';

const origin = 'https://helpingyourboyfriend.org';
const t1 = '2026-10-08T00:00:00.000Z', t2 = '2026-10-09T01:00:00.000Z';
const html = (path, body = 'A useful player guide') => `<html lang="en"><head><title>Title ${path}</title><meta name="description" content="Game guide"><meta name="robots" content="index, follow"><link rel="canonical" href="${origin}${path}"></head><body><nav><a href="/endings">Endings</a></nav><main><h1>Helping Your Boyfriend</h1><p class="pink">${body}</p><img src="/images/a.png" alt="Adrian"></main><time datetime="2026-10-08">Updated 2026-10</time><footer>Copyright © 2026 Helping Your Boyfriend</footer><script>buildId="one"</script><script type="application/ld+json">{"@type":"WebPage","name":"Player guide","dateModified":"2026-10-08"}</script></body></html>`;
const entry = (path, content = html(path)) => ({ path, canonicalUrl: `${origin}${path}`, indexable: seoInputs(content).indexable, contentFingerprint: fingerprint(content), siteUrl: origin, contentTime: t1, priority: path === '/' ? 1 : .8, changeFrequency: 'monthly' });
const candidates = [entry('/'), entry('/characters'), entry('/controls'), entry('/endings')];
const first = buildManifest(candidates, null, t1);
const same = buildManifest(candidates, first, t2);
assert.deepEqual(same.entries, first.entries, 'Unchanged dates survive later build');
assert.equal(diff(first, same).unchanged.length, 4);
assert.equal(diff(first, same).updated.length, 0);
const independent = buildManifest(candidates.map(e => e.path === '/controls' ? entry('/controls', html('/controls', 'New controls help')) : e), first, t2);
assert.deepEqual(diff(first, independent).updated, [`${origin}/controls`]);
const shared = buildManifest(candidates.map(e => entry(e.path, html(e.path).replace('>Endings<','>All endings<'))), first, t2);
assert.equal(diff(first, shared).updated.length, 4);
const cosmetic = html('/').replace('class="pink"', 'class="new-layout" style="padding: 20px"').replace('buildId="one"', 'buildId="two"').replace('© 2026', '© 2027').replace('datetime="2026-10-08"','datetime="2026-10-09"').replace('dateModified":"2026-10-08"','dateModified":"2026-10-09"');
assert.equal(fingerprint(cosmetic), fingerprint(html('/')), 'Classes/styles/build IDs/decoration/dates ignored');
assert.equal(fingerprint(html('/').replace('<body>','<body>\n  ').replace('</main>', '\n</main>')), fingerprint(html('/')), 'HTML formatting ignored');
assert.equal(fingerprint(html('/').replace('/images/a.png','/images/a.png?dpl=dpl_abc')),fingerprint(html('/')),'Vercel deployment-affinity asset query ignored');
const contact = html('/contact','support@helpingyourboyfriend.org');
const encoded = Buffer.from('support@helpingyourboyfriend.org').map(byte => byte ^ 0x42).toString('hex');
assert.equal(fingerprint(contact.replace('support@helpingyourboyfriend.org',`<a href="/cdn-cgi/l/email-protection"><span data-cfemail="42${encoded}">[email protected]</span></a>`)),fingerprint(contact),'Cloudflare email protection ignored');
for (const [from, to] of [['Game guide','New description'], ['Title /','New title'], ['/images/a.png','/images/b.png'], ['alt="Adrian"','alt="Ian"'], ['Player guide','Structured game guide'], ['lang="en"','lang="fr"']]) assert.notEqual(fingerprint(html('/').replace(from,to)), fingerprint(html('/')), 'SEO-effective input tracked');
const eligibility = buildManifest([entry('/'), entry('/new'), entry('/controls', html('/controls').replace('index, follow','noindex'))], first, t2);
assert.deepEqual(diff(first, eligibility).added, [`${origin}/new`]);
assert.deepEqual(diff(first, eligibility).deleted, ['/characters','/controls','/endings'].map(p => `${origin}${p}`));
assert.throws(() => buildManifest(candidates, { ...first, generatedAt: t2 }, t1), /predates/);
assert.throws(() => diff(first, { ...same, fingerprintVersion: 'other' }), /migration/);
const migrated = buildManifest(candidates, { ...first, fingerprintVersion: 'legacy' }, t2, { migration: true });
assert.deepEqual(migrated.entries.map(e => e.lastModified), first.entries.map(e => e.lastModified));
const returned = { ...same, entries: same.entries.map(e => ({ ...e, lastModified: t2 })) };
assert.equal(diff(first, returned).updated.length, 4, 'Same fingerprint after content revert is still a notification');
assert.throws(() => validate({ ...first, entries: [{ ...first.entries[0], canonicalUrl: 'https://evil.example/' }] }, origin), /host|origin|path/);
assert.deepEqual(batches(Array.from({length:10001}, (_,i) => i)).map(v => v.length), [10000,1]);
assert.deepEqual(sitemapChunks(Array.from({length:50001}, (_,i) => ({ ...first.entries[0], path: `/page${i}`, canonicalUrl: `${origin}/page${i}` }))).map(v => v.length), [50000,1]);
const huge = {...first,entries:Array.from({length:50001},(_,i)=>({...first.entries[0],path:`/page${i}`,canonicalUrl:`${origin}/page${i}`}))};
assert.equal(sitemapRewrites(huge).beforeFiles[0].source,'/sitemap.xml');
assert.equal((sitemapIndexXml(huge).match(/<sitemap>/g)??[]).length,2);
assert.ok(!sitemapIndexXml(huge).includes('<priority>'),'Sitemap Index must not include URL-only fields');
assert.deepEqual(sitemapRewrites(first).beforeFiles,[],'Current small site has no rewrite');
assert.notEqual(fingerprint(html('/'),{'/images/a.png':'original'}),fingerprint(html('/'),{'/images/a.png':'replacement'}),'Core image content replacement tracked');

const projectId = 'prj_abc', id = 'dpl_abc', sha = 'a'.repeat(40), deploymentOrigin = 'https://project-abcd.vercel.app';
const payload = { id, project: { id: projectId }, environment: 'production', url: deploymentOrigin, git: { sha }, state: { type: 'success' } };
const config = { projectId, siteUrl: origin, readToken: 'read-only-test', key: 'test-key-123456', checkpointUrl: `https://storage.example/checkpoints/${projectId}/production.json`, storageToken: 'storage-test' };
assert.ok(filterEvent({action:'vercel.deployment.success',client_payload:payload},config));
for (const event of [
  {action:'vercel.deployment.error',client_payload:payload},
  {action:'vercel.deployment.success',client_payload:{...payload,environment:'preview'}},
  {action:'vercel.deployment.success',client_payload:{...payload,url:'https://evil.example'}},
  {action:'vercel.deployment.success',client_payload:{...payload,project:{id:'prj_other'}}},
]) assert.equal(filterEvent(event,config),null);
const response = (data, status=200, headers={}) => new Response(typeof data === 'string' ? data : JSON.stringify(data), {status,headers:{'content-type':'application/json',...headers}});
const controlFetch = async (url, opts) => {
  assert.equal(new URL(url).origin,'https://api.vercel.com');
  assert.equal(opts.redirect,'manual');
  assert.equal(opts.headers.authorization,'Bearer read-only-test');
  if(url.includes('/deployments/')) return response({id,projectId,url:'project-abcd.vercel.app',target:'production',readyState:'READY',meta:{githubCommitSha:sha},alias:[new URL(origin).hostname]});
  if(url.includes('/domains/')) return response({projectId,verified:true});
  return response({id:projectId,targets:{production:{id}}});
};
const verified = await verifyDeployment(payload, config, controlFetch);
assert.equal(verified.origin,deploymentOrigin);
await assert.rejects(() => verifyDeployment({...payload,git:{sha:'b'.repeat(40)}},config,controlFetch), /SHA/);
assert.equal(await verifyDeployment(payload,config,async (url,opts) => url.includes('/domains/') || url.includes('/deployments/') ? controlFetch(url,opts) : response({id:projectId,targets:{production:{id:'dpl_newer'}}})),null);
await assert.rejects(() => deploymentManifest(verified,{...config,bypass:'private-test'},async (url,opts)=> {
  assert.equal(new URL(url).origin,deploymentOrigin); assert.equal(opts.headers['x-vercel-protection-bypass'],'private-test'); assert.equal(opts.redirect,'manual'); return response('',302,{location:'https://evil.example'});
}), /JSON/);
await assert.rejects(() => loadCheckpoint(config,async()=>response({manifest:first})), /ETag/);
await assert.rejects(() => loadCheckpoint({...config,checkpointUrl:'https://storage.example/wrong.json'}), /scoped/);
const checkpoint = {schemaVersion:1,projectId,environment:'production',deploymentId:'dpl_old',confirmedAt:t1,manifest:first};
let puts=0, posts=0, attempts=0;
const current = { ...same, entries: Array.from({length:10001}, (_,i) => ({...same.entries[0],path:`/z${String(i).padStart(5,'0')}`,canonicalUrl:`${origin}/z${String(i).padStart(5,'0')}`,lastModified:t2})) };
const submitFetch = async (url,opts={}) => {
  if(String(url).endsWith('.txt')) return response(config.key);
  if(opts.method==='POST'){posts++;return response('',posts===2?500:200);}
  if(opts.method==='PUT'){puts++;return response('',200,{etag:'"new"'});}
  return response('',404);
};
await assert.rejects(() => submit({ current,checkpoint,checkpointEtag:'"old"',verified,config,fetcher:submitFetch,reverify:async()=>true }), /NOT advanced/);
assert.equal(puts,0,'Partial batch failure must not advance checkpoint');
posts=0;
const successFetch=async(url,opts={}) => { if(opts.method==='POST'){posts++;return response('',202);}return submitFetch(url,opts); };
await submit({current,checkpoint,checkpointEtag:'"old"',verified,config,fetcher:successFetch,reverify:async()=>true});
assert.equal(posts,2,'Retry sends both batches again');assert.equal(puts,1);
await assert.rejects(()=>submit({current,checkpoint:null,verified,config,fetcher:successFetch,reverify:async()=>true}),/bootstrap/);
assert.equal((await submit({current,checkpoint,checkpointEtag:'"old"',verified,config,fetcher:successFetch,reverify:async()=>false})).skipped,'production changed before submission');
await assert.rejects(()=>submit({current:same,checkpoint,checkpointEtag:'"old"',verified,config,reverify:async()=>true,fetcher:async(url,opts={})=>opts.method==='PUT'?response('',412):submitFetch(url,opts)}), /CAS conflict/);
await submit({current:independent,checkpoint,checkpointEtag:'"old"',verified,config,reverify:async()=>true,sleep:async()=>{},fetcher:async(url,opts={})=>opts.method==='POST'?response('',++attempts<3?429:202):submitFetch(url,opts)});
assert.equal(attempts,3,'429 retries are bounded and reusable');
await assert.rejects(()=>submit({current:same,checkpoint:{...checkpoint,manifest:{...first,generatedAt:'2026-10-10T00:00:00.000Z'}},checkpointEtag:'"old"',verified,config,reverify:async()=>true,fetcher:successFetch}),/Stale/);
console.log('SEO/IndexNow tests passed: semantic changes, noise, dates, migration, exclusions, deletion, 50,001 sitemap partition, 10,001 notification batch, event/control-plane security, protection redirects, partial failure, retries, stale events and CAS. All requests mocked; no external URLs submitted.');
