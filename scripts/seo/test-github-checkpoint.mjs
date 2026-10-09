import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadGitHubCheckpoint, saveGitHubCheckpoint } from './github-checkpoint.mjs';
import { loadCheckpoint, submit } from './indexnow.mjs';

const manifest = JSON.parse(fs.readFileSync('seo/url-manifest.json', 'utf8'));
const config = { checkpointBackend: 'github', checkpointRepository: 'wanghuan072/helping-your-boyfriend', githubToken: 'mock-job-token', projectId: 'prj_test', siteUrl: manifest.siteUrl, key: 'mock-key-123456' };
const record = id => ({ schemaVersion: 1, projectId: config.projectId, environment: 'production', deploymentId: id, confirmedAt: new Date().toISOString(), manifest });
const objects = new Map();
let serial = 0, head = null, writes = 0, rejected = false;
const store = object => { const sha = (++serial).toString(16).padStart(40, '0'); objects.set(sha, object); return sha; };
const reply = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
const fetcher = async (url, options = {}) => {
  const u = new URL(url);
  if (u.origin === config.siteUrl) return new Response(config.key);
  if (u.origin === 'https://api.indexnow.org') return new Response('', { status: rejected ? 500 : 202 });
  assert.equal(u.origin, 'https://api.github.com');
  assert.equal(options.headers.authorization, 'Bearer mock-job-token');
  assert.equal(options.redirect, 'manual');
  const suffix = u.pathname.split('/git/')[1], method = options.method ?? 'GET';
  const body = options.body && JSON.parse(options.body);
  if (method === 'GET') {
    if (suffix === 'ref/heads/indexnow-checkpoints') return head ? reply({ ref: 'refs/heads/indexnow-checkpoints', object: { type: 'commit', sha: head } }) : reply({}, 404);
    const object = objects.get(suffix.split('/')[1]);
    assert.ok(object, 'Reads must address immutable known objects');
    if (suffix.startsWith('blobs/')) return reply({ encoding: 'base64', content: Buffer.from(object.content).toString('base64'), size: Buffer.byteLength(object.content) });
    return reply(object);
  }
  writes++;
  if (suffix === 'blobs') return reply({ sha: store({ content: body.content }) }, 201);
  if (suffix === 'trees') {
    const prior = body.base_tree ? objects.get(body.base_tree).tree : [];
    const paths = new Set(body.tree.map(item => item.path));
    return reply({ sha: store({ tree: [...prior.filter(item => !paths.has(item.path)), ...body.tree] }) }, 201);
  }
  if (suffix === 'commits') return reply({ sha: store({ tree: { sha: body.tree }, parents: body.parents }) }, 201);
  if (suffix === 'refs') {
    assert.equal(body.ref, 'refs/heads/indexnow-checkpoints');
    if (head) return reply({}, 422);
  } else {
    assert.equal(suffix, 'refs/heads/indexnow-checkpoints');
    assert.equal(body.force, false, 'Force pushes are forbidden');
    if (objects.get(body.sha).parents[0] !== head) return reply({}, 422);
  }
  head = body.sha;
  return reply({ ref: 'refs/heads/indexnow-checkpoints', object: { sha: head } }, method === 'POST' ? 201 : 200);
};

assert.deepEqual(await loadCheckpoint(config, fetcher), { checkpoint: null, checkpointEtag: null });
await assert.rejects(() => loadGitHubCheckpoint({ ...config, checkpointRepository: 'other/repo' }, fetcher), /configuration/);
await assert.rejects(() => loadGitHubCheckpoint({ ...config, githubToken: '' }, fetcher), /configuration/);
await assert.rejects(() => loadGitHubCheckpoint(config, async () => reply({}, 403)), /403/);
await saveGitHubCheckpoint({ ...record('dpl_first'), key: 'never-persist-this' }, null, config, fetcher);
const first = await loadGitHubCheckpoint(config, fetcher);
assert.equal(first.checkpoint.deploymentId, 'dpl_first');
assert.ok(!JSON.stringify(first.checkpoint).includes('never-persist-this'));
await assert.rejects(() => saveGitHubCheckpoint(record('dpl_racing'), null, config, fetcher), /CAS conflict/);
await saveGitHubCheckpoint(record('dpl_second'), first.checkpointEtag, config, fetcher);
await assert.rejects(() => saveGitHubCheckpoint(record('dpl_stale'), first.checkpointEtag, config, fetcher), /CAS conflict/);
assert.equal((await loadGitHubCheckpoint(config, fetcher)).checkpoint.deploymentId, 'dpl_second');

// Updating one project preserves other project files on the same state branch.
const other = { ...config, projectId: 'prj_other' };
const empty = await loadGitHubCheckpoint(other, fetcher);
assert.equal(empty.checkpoint, null);
assert.equal(empty.checkpointEtag, head);
await saveGitHubCheckpoint({ ...record('dpl_other'), projectId: other.projectId }, head, other, fetcher);
assert.equal((await loadGitHubCheckpoint(config, fetcher)).checkpoint.deploymentId, 'dpl_second');

const state = await loadCheckpoint(config, fetcher);
const verified = { id: 'dpl_third', projectId: config.projectId };
const changed = { ...manifest, generatedAt: new Date(Date.now() + 1000).toISOString(), entries: manifest.entries.map((entry, index) => index ? entry : { ...entry, contentFingerprint: 'sha256:' + 'b'.repeat(64), lastModified: new Date().toISOString() }) };
rejected = true;
const writesBefore = writes;
await assert.rejects(() => submit({ current: changed, ...state, verified, config, fetcher, reverify: async () => true }), /NOT advanced/);
assert.equal(writes, writesBefore, 'Rejected notification performs no Git writes');
rejected = false;
const accepted = await submit({ current: changed, ...state, verified, config, fetcher, reverify: async () => true });
assert.equal(accepted.checkpoint, 'github');
assert.equal((await loadCheckpoint(config, fetcher)).checkpoint.deploymentId, verified.id);
assert.equal((await submit({ current: changed, ...(await loadCheckpoint(config, fetcher)), verified, config, fetcher, reverify: async () => true })).skipped, 'already accepted');
console.log('GitHub checkpoint tests passed: bootstrap, immutable reads, project isolation, rejected/accepted notifications, no secret persistence, no force, first-write and concurrent update conflicts. All network operations mocked.');
