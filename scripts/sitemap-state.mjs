import fs from 'node:fs';
import { publicFingerprints } from './page-fingerprints.mjs';
import { readTopicRoutes } from './read-guides.mjs';
import { revisionDate } from './revision-date.mjs';

// Legacy filename retained for local editorial month labels. This state is not
// used as the SEO baseline: app/sitemap.ts reads only seo/url-manifest.json.

const mode = process.argv[2] ?? 'validate';
if (!['validate', 'update'].includes(mode)) throw new Error(`Unknown mode: ${mode}`);
// One-time hash-algorithm migration; preserves genuine editorial dates.
const preserveDates = process.argv.includes('--preserve-dates');
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const read = file => fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const { content, pages } = publicFingerprints();
const pageState = read('seo/page-lastmod.json');
const contentState = read('seo/content-fingerprints.json');
const changedPages = Object.keys(pages).filter(route => pageState[route]?.fingerprint !== pages[route]);
const changedContent = Object.keys(content).filter(route => contentState[route]?.fingerprint !== content[route]);

if (mode === 'update') {
  write('seo/page-lastmod.json', Object.fromEntries(Object.entries(pages).map(([route, fingerprint]) => [route, {
    lastModified: revisionDate({ previousFingerprint: pageState[route]?.fingerprint, fingerprint, previousDate: pageState[route]?.lastModified, today, preserveDates }), fingerprint,
  }])));
  if (!preserveDates) for (const route of changedContent) {
    const file = route === '/' ? 'data/games/main-game.json' : `data/guides/${readTopicRoutes().find(topic => topic.path === route).id}.json`;
    // Mechanical date-only replacement preserves the author's JSON formatting.
    const text = fs.readFileSync(file, 'utf8');
    if (!/"updatedAt"\s*:\s*(?:"\d{4}-\d{2}-\d{2}"|null)/.test(text)) throw new Error(`Missing revision date field: ${file}`);
    const date = revisionDate({ previousFingerprint: contentState[route]?.fingerprint, fingerprint: content[route], previousDate: JSON.parse(text).updatedAt, today });
    fs.writeFileSync(file, text.replace(/("updatedAt"\s*:\s*)(?:"\d{4}-\d{2}-\d{2}"|null)/, `$1"${date}"`));
  }
  write('seo/content-fingerprints.json', Object.fromEntries(Object.entries(content).map(([route, fingerprint]) => [route, { fingerprint }])));
  console.log(`Updated fingerprints; ${changedPages.length} static and ${changedContent.length} content changes${preserveDates ? ' (migration: dates preserved)' : ''}.`);
} else if (changedPages.length || changedContent.length) {
  console.error(`Sitemap state is stale: ${[...changedPages, ...changedContent].join(', ')}`);
  process.exit(1);
} else console.log(`Sitemap state valid for ${Object.keys(pages).length + Object.keys(content).length} routes.`);
