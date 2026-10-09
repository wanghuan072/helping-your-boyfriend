import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const registry = read('planning/route-registry.json');
const manifest = read('seo/url-manifest.json');
const expectedDates = new Map(manifest.entries.map(entry => [entry.path, entry.lastModified]));
const xml = fs.readFileSync('.next/server/app/sitemap.xml.body', 'utf8');
assert.match(xml, /<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/);
const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(match => match[1]);
const routes = registry.staticRoutes.filter(route => route.sitemap);
assert.equal(entries.length, routes.length);
const seen = new Set();
for (const entry of entries) {
  assert.match(entry, /<loc>[^<]+<\/loc>\s*<lastmod>[^<]+<\/lastmod>\s*<changefreq>[^<]+<\/changefreq>\s*<priority>[^<]+<\/priority>/);
  const value = tag => entry.match(new RegExp(`<${tag}>([^<]+)</${tag}>`))?.[1];
  const route = routes.find(route => route.canonical === value('loc'));
  assert.ok(route, `Unexpected URL: ${value('loc')}`);
  assert.ok(!seen.has(route.path), `Duplicate: ${route.path}`);
  seen.add(route.path);
  assert.equal(route.canonical, new URL(route.path, registry.origin).toString(), `${route.path}: consistent URL normalization`);
  const page = route.path === '/' ? 'index' : route.path.slice(1);
  const html = fs.readFileSync(`.next/server/app/${page}.html`, 'utf8');
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)?.[1];
  const ogUrl = html.match(/<meta[^>]+property="og:url"[^>]+content="([^"]+)"/)?.[1];
  assert.equal(canonical, route.canonical, `${route.path}: HTML canonical matches sitemap`);
  assert.equal(ogUrl, route.canonical, `${route.path}: social URL matches canonical`);
  assert.equal(value('lastmod'), expectedDates.get(route.path), `${route.path}: retain actual page date`);
  assert.equal(value('changefreq'), route.changeFrequency);
  assert.equal(Number(value('priority')), route.priority);
  assert.ok(['always','hourly','daily','weekly','monthly','yearly','never'].includes(route.changeFrequency));
  assert.ok(route.priority >= 0 && route.priority <= 1);
}
const published = read('.next/server/app/.well-known/seo-url-manifest.json.body');
assert.deepEqual(published, manifest);
const robots = fs.readFileSync('.next/server/app/robots.txt.body', 'utf8');
assert.ok(robots.includes(`Sitemap: ${registry.origin}/sitemap.xml`));
console.log(`Sitemap output passed: ${seen.size} canonical URLs match HTML and social metadata; namespace, page-specific dates, update frequencies and priorities verified.`);
