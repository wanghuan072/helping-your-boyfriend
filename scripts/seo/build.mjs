import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fingerprint, coreImages, seoInputs, fingerprintVersion } from './semantic-html.mjs';
import { buildManifest, validate } from './manifest.mjs';
import nextEnv from '@next/env';

// This prebuild script runs outside Next, so explicitly load its official env
// hierarchy. Platform environment variables retain precedence over local files.
nextEnv.loadEnvConfig(process.cwd(), false);

const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
const registry = read('planning/route-registry.json');
const origin = registry.origin;
const manifestFile = 'seo/url-manifest.json';
const baselineFile = 'seo/migration-baseline.json';
const production = process.env.VERCEL_ENV === 'production';
const mode = process.argv[2] ?? 'build';
if (!['build', 'migrate', 'validate'].includes(mode)) throw new Error('Unknown SEO build mode');
if (process.env.SITE_URL && process.env.SITE_URL !== origin) throw new Error('SITE_URL must equal the canonical registry origin');
const timeout = 15_000;
const imageCache = new Map();
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
function localFingerprint(html) {
  const digests = Object.fromEntries(coreImages(html, origin).map(image => {
    const target = path.resolve('public', `.${decodeURIComponent(image)}`);
    const relative = path.relative(path.resolve('public'), target);
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Core image escapes public directory');
    return [image, hash(fs.readFileSync(target))];
  }));
  return fingerprint(html, digests);
}
async function productionFingerprint(html) {
  const digests = {};
  for (const image of coreImages(html, origin)) {
    if (!imageCache.has(image)) {
      const response = await fetch(new URL(image, origin), { headers, redirect: 'manual', signal: AbortSignal.timeout(timeout) });
      if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error('Production core image unavailable; migration stopped');
      const bytes = await response.arrayBuffer();
      if (bytes.byteLength > 10 * 1024 * 1024) throw new Error('Production core image exceeds audit size limit');
      imageCache.set(image, hash(Buffer.from(bytes)));
    }
    digests[image] = imageCache.get(image);
  }
  return fingerprint(html, digests);
}
const headers = process.env.SEO_PRODUCTION_BYPASS_SECRET ? { 'x-vercel-protection-bypass': process.env.SEO_PRODUCTION_BYPASS_SECRET } : {};

async function resource(path, type) {
  const url = new URL(path, origin);
  if (url.origin !== origin || url.username || url.password) throw new Error('Baseline request must remain on configured canonical origin');
  let response;
  for (let attempt = 0; attempt < 3; attempt++) {
    try { response = await fetch(url, { headers, redirect: 'manual', signal: AbortSignal.timeout(timeout) }); break; }
    catch { if (attempt === 2) throw new Error('Production baseline connection failed after 3 attempts; migration stopped without changing dates'); }
  }
  if (response.status === 404) return null;
  if (!response.ok || !response.headers.get('content-type')?.includes(type)) throw new Error(`Production baseline unavailable (${response.status}); refusing silent rebaseline`);
  const body = await response.text();
  if (Buffer.byteLength(body) > 10 * 1024 * 1024) throw new Error('Production baseline response exceeds size limit');
  return body;
}

function discoverRoutes() {
  const routes = registry.staticRoutes.filter(route => {
    if (!route.sitemap) return false;
    if (route.kind !== 'legal' && read(route.source).status !== 'published') return false;
    if (route.canonical !== new URL(route.path, origin).href || route.path.includes('?')) throw new Error(`Invalid canonical registry entry: ${route.path}`);
    return true;
  });
  if (registry.dynamicRoutes.length) throw new Error('New dynamic routes require their existing data enumerator to be connected before publishing');
  const registered = new Set(registry.staticRoutes.map(route => route.path));
  function walk(directory) {
    for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = `${directory}/${item.name}`;
      if (item.isDirectory()) walk(file);
      else if (/^page\.(tsx|jsx|ts|js)$/.test(item.name)) {
        const path = `/${directory.slice(4)}`.replace(/\/$/, '') || '/';
        if (!registered.has(path)) throw new Error(`Unregistered business route: ${path}`);
      }
    }
  }
  walk('app');
  if (new Set(routes.map(route => route.canonical)).size !== routes.length) throw new Error('Duplicate canonical URL');
  return routes;
}

function contentTime(route) {
  const date = route.kind === 'legal' ? read('seo/page-lastmod.json')[route.path]?.lastModified : read(route.source).updatedAt;
  return /^\d{4}-\d{2}-\d{2}$/.test(date ?? '') ? new Date(`${date}T00:00:00.000Z`).toISOString() : undefined;
}

async function migrateProduction() {
  console.warn('Explicit migration: existing production XML + rendered HTML establish SEO fingerprints; historical dates retained.');
  const xml = await resource('/sitemap.xml', 'xml');
  if (!xml || !xml.includes('http://www.sitemaps.org/schemas/sitemap/0.9')) throw new Error('Migration requires a valid existing production sitemap');
  const records = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => ({
    url: block.match(/<loc>([^<]+)<\/loc>/)?.[1],
    date: block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
    changeFrequency: block.match(/<changefreq>([^<]+)<\/changefreq>/)?.[1],
    priority: Number(block.match(/<priority>([^<]+)<\/priority>/)?.[1]),
  }));
  if (!records.length) throw new Error('Cannot recover migration dates from empty sitemap');
  const entries = [];
  for (const record of records) {
    const url = new URL(record.url);
    if (url.origin !== origin || url.search || url.hash || url.username || url.password || url.href !== record.url) throw new Error('Migration sitemap contains a foreign or noncanonical URL');
    const html = await resource(url.pathname, 'text/html');
    if (!html) throw new Error(`Sitemap references missing production page: ${url.pathname}`);
    const semantic = seoInputs(html);
    if (semantic.canonical !== url.href || !semantic.indexable) throw new Error('Migration sitemap disagrees with production canonical or robots');
    const lastModified = /^\d{4}-\d{2}-\d{2}$/.test(record.date ?? '') ? `${record.date}T00:00:00.000Z` : new Date(record.date).toISOString();
    entries.push({ path: url.pathname, canonicalUrl: url.href, indexable: true, contentFingerprint: await productionFingerprint(html), lastModified, changeFrequency: record.changeFrequency, priority: record.priority });
  }
  const manifest = { schemaVersion: 1, fingerprintVersion, siteUrl: origin, generatedAt: new Date().toISOString(), entries: entries.sort((a, b) => a.canonicalUrl < b.canonicalUrl ? -1 : 1) };
  validate(manifest, origin);
  return manifest;
}

async function loadPreviousManifest() {
  if (!production && mode !== 'migrate') {
    if (!fs.existsSync(baselineFile)) throw new Error('Local migration snapshot missing: run npm run seo:migrate (read-only production audit)');
    const manifest = read(baselineFile).manifest;
    validate(manifest, origin);
    console.log('Local verification baseline: audited production migration snapshot; local builds never advance production or IndexNow state.');
    return manifest;
  }
  const body = await resource('/.well-known/seo-url-manifest.json', 'application/json');
  if (body) { const manifest = JSON.parse(body); validate(manifest, origin); return manifest; }
  // Only 404 enables the explicit existing-site migration. Network/schema failures stop.
  // After this endpoint is published, every production build inherits its live baseline.
  return migrateProduction();
}

const routes = discoverRoutes();
if (mode === 'validate') {
  const manifest = read(manifestFile);
  validate(manifest, origin);
  for (const route of routes) {
    const entry = manifest.entries.find(item => item.path === route.path);
    if (!entry) throw new Error(`Manifest omits ${route.path}`);
    const html = fs.readFileSync(`.next/server/app/${route.path === '/' ? 'index' : route.path.slice(1)}.html`, 'utf8');
    if (localFingerprint(html) !== entry.contentFingerprint) throw new Error(`Rendered page differs from manifest: ${route.path}`);
  }
  console.log(`Semantic manifest verified against ${routes.length} rendered pages.`);
} else {
  const previous = await loadPreviousManifest();
  if (mode === 'migrate') {
    write(baselineFile, { source: `${origin}/sitemap.xml + production HTML (read-only audit)`, observedAt: previous.generatedAt, purpose: 'Local migration recovery only; production builds always fetch the live successful production manifest.', manifest: previous });
    write(manifestFile, previous);
    console.log(`Recovered ${previous.entries.length} historical dates without resetting them.`);
  } else {
    const draft = !production && fs.existsSync(manifestFile) ? read(manifestFile) : undefined;
    if (draft) validate(draft, origin);
    // Two native prerenders: collect actual HTML semantics, then publish the correct
    // manifest/sitemap. No editing compiled Next artifacts and no server is started.
    write(manifestFile, previous);
    const key = process.env.INDEXNOW_KEY;
    if (key) {
      if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) throw new Error('INDEXNOW_KEY must contain 8–128 letters, digits or hyphens');
      fs.writeFileSync(`public/${key}.txt`, key, 'utf8');
    }
    function nextBuild() {
      const result = spawnSync(process.execPath, ['node_modules/next/dist/bin/next', 'build'], { stdio: 'inherit', env: process.env });
      if (result.status !== 0) throw new Error('Next production prerender failed; no production/checkpoint state advanced');
    }
    nextBuild();
    const candidates = routes.map(route => {
      const html = fs.readFileSync(`.next/server/app/${route.path === '/' ? 'index' : route.path.slice(1)}.html`, 'utf8');
      const semantic = seoInputs(html);
      if (semantic.canonical !== route.canonical) throw new Error(`Rendered canonical differs from registry: ${route.path}`);
      return { path: route.path, canonicalUrl: route.canonical, indexable: semantic.indexable, contentFingerprint: localFingerprint(html), contentTime: contentTime(route), siteUrl: origin, changeFrequency: route.changeFrequency, priority: route.priority };
    });
    const manifest = buildManifest(candidates, previous, new Date().toISOString(), { localDraft: draft });
    write(manifestFile, manifest);
    nextBuild();
    for (const entry of manifest.entries) {
      const html = fs.readFileSync(`.next/server/app/${entry.path === '/' ? 'index' : entry.path.slice(1)}.html`, 'utf8');
      if (localFingerprint(html) !== entry.contentFingerprint) throw new Error(`Non-deterministic rendered semantics: ${entry.path}`);
    }
    console.log(`SEO build verified: ${manifest.entries.length} pages; ${manifest.entries.filter(entry => previous.entries.find(old => old.canonicalUrl === entry.canonicalUrl)?.lastModified === entry.lastModified).length} historical dates retained. IndexNow key ${key ? 'injected (not logged)' : 'not configured; remote notifications remain pending'}.`);
  }
}
