import { assertManifest, assertManifestPair, assertCheckpointPair, eligibleEntries } from './manifest-contract.mjs';
import { partitionSitemap } from '../../seo/sitemap-policy.js';
const fingerprintVersion = 'semantic-html-v1';

export function validate(manifest, origin) {
  assertManifest(manifest);
  if (origin && manifest.siteUrl !== origin) throw new Error('Manifest origin differs from configured production origin');
  for (const entry of manifest.entries) {
    const url = new URL(entry.canonicalUrl);
    if (url.search || url.hash || url.href !== entry.canonicalUrl || (entry.path !== '/' && entry.path.endsWith('/'))) throw new Error(`Noncanonical path: ${entry.path}`);
    if (!/^sha256:[a-f0-9]{64}$/.test(entry.contentFingerprint)) throw new Error('Invalid SHA-256 fingerprint');
    if (!['always','hourly','daily','weekly','monthly','yearly','never'].includes(entry.changeFrequency) || !(entry.priority >= 0 && entry.priority <= 1)) throw new Error('Invalid sitemap policy');
  }
}

export function buildManifest(candidates, previous, now, { localDraft, migration = false } = {}) {
  if (previous) validate(previous);
  if (previous && now < previous.generatedAt) throw new Error('Build time predates production baseline');
  if (previous && previous.fingerprintVersion !== fingerprintVersion && !migration) throw new Error('Fingerprint version changed; explicit migration required');
  const old = new Map(previous?.entries.map(entry => [entry.canonicalUrl, entry]) ?? []);
  const drafts = new Map(localDraft?.fingerprintVersion === fingerprintVersion ? localDraft.entries.map(entry => [entry.canonicalUrl, entry]) : []);
  const entries = candidates.map(candidate => {
    const before = old.get(candidate.canonicalUrl);
    const draft = drafts.get(candidate.canonicalUrl);
    let lastModified;
    if (before && (before.contentFingerprint === candidate.contentFingerprint || (migration && previous.fingerprintVersion !== fingerprintVersion))) lastModified = before.lastModified;
    else if (draft && draft.contentFingerprint === candidate.contentFingerprint && (!before || draft.lastModified > before.lastModified)) lastModified = draft.lastModified;
    else if (candidate.contentTime && candidate.contentTime <= now && (!before || candidate.contentTime > before.lastModified)) lastModified = candidate.contentTime;
    else lastModified = now;
    const entry = { ...candidate }; delete entry.contentTime; delete entry.siteUrl;
    return { ...entry, lastModified };
  }).sort((a, b) => a.canonicalUrl < b.canonicalUrl ? -1 : a.canonicalUrl > b.canonicalUrl ? 1 : 0);
  const manifest = { schemaVersion: 1, fingerprintVersion, siteUrl: candidates[0]?.siteUrl ?? previous?.siteUrl, generatedAt: now, entries };
  validate(manifest);
  if (previous && !migration) assertManifestPair(manifest, previous);
  return manifest;
}

export function diff(previous, current, { bootstrap = false } = {}) {
  validate(current);
  if (previous) {
    validate(previous, current.siteUrl);
    if (current.generatedAt < previous.generatedAt) throw new Error('Stale deployment manifest');
    if (!bootstrap) assertCheckpointPair(current, previous);
    else for (const entry of current.entries) {
      const before = previous.entries.find(old => old.canonicalUrl === entry.canonicalUrl);
      if (before && entry.lastModified < before.lastModified) throw new Error('Bootstrap cannot reset historical dates');
    }
  } else if (!bootstrap) throw new Error('Missing checkpoint; explicit bootstrap required');
  const old = new Map(previous ? eligibleEntries(previous).map(entry => [entry.canonicalUrl, entry]) : []);
  const next = new Map(eligibleEntries(current).map(entry => [entry.canonicalUrl, entry]));
  const result = { added: [], updated: [], deleted: [], unchanged: [] };
  for (const [url, entry] of next) {
    const before = old.get(url);
    result[!before ? 'added' : bootstrap || before.contentFingerprint !== entry.contentFingerprint || before.lastModified !== entry.lastModified ? 'updated' : 'unchanged'].push(url);
  }
  for (const url of old.keys()) if (!next.has(url)) result.deleted.push(url);
  for (const values of Object.values(result)) values.sort();
  return result;
}

export function batches(values, limit = 10_000) {
  const result = [];
  for (let index = 0; index < values.length; index += limit) result.push(values.slice(index, index + limit));
  return result;
}

// Byte and count limits are both enforced. Current nine-page site uses one native sitemap.
export function sitemapChunks(entries) {
  return partitionSitemap(entries);
}
