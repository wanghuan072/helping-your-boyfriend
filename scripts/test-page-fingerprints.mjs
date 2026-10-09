import assert from 'node:assert/strict';
import fs from 'node:fs';
import { publicFingerprints } from './page-fingerprints.mjs';
import { revisionDate } from './revision-date.mjs';
const baseline = publicFingerprints();
function changedBy(file, transform = text => `${text}\n// changed visible text`) {
  const result = publicFingerprints(path => path === file ? transform(fs.readFileSync(path, 'utf8')) : fs.readFileSync(path, 'utf8'));
  return Object.keys({ ...baseline.content, ...baseline.pages }).filter(route => (result.content[route] ?? result.pages[route]) !== (baseline.content[route] ?? baseline.pages[route]));
}
assert.deepEqual(changedBy('components/game/MainGamePage.tsx'), ['/']);
assert.deepEqual(changedBy('components/guide/NotebookTopic.tsx'), ['/characters', '/controls']);
assert.deepEqual(changedBy('components/guide/EndingsTree.tsx'), ['/endings']);
assert.deepEqual(changedBy('app/about/page.tsx'), ['/about']);
assert.deepEqual(changedBy('app/scrapbook.css'), []);
assert.deepEqual(changedBy('data/games/games.json'), []);
assert.deepEqual(changedBy('data/games/main-game.json', text => JSON.stringify({ ...JSON.parse(text), updatedAt: '2099-01-01' })), []);
assert.deepEqual(changedBy('data/games/main-game.json', text => JSON.stringify({ ...JSON.parse(text), credits: { creators: ['Updated creator'], officialUrl: 'https://example.org' } })), ['/about']);
assert.deepEqual(changedBy('config/site.ts', text => text.replace('support@helpingyourboyfriend.org', 'contact@example.org')), ['/privacy', '/terms', '/copyright', '/about', '/contact']);
console.log('Page-local fingerprint regression checks passed.');
const yesterday = '2026-10-08', today = '2026-10-09';
assert.equal(revisionDate({ previousFingerprint: 'same', fingerprint: 'same', previousDate: yesterday, today }), yesterday, 'Unchanged page keeps its original date');
assert.equal(revisionDate({ previousFingerprint: 'old', fingerprint: 'new', previousDate: yesterday, today }), today, 'Changed page receives the revision date');
assert.equal(revisionDate({ fingerprint: 'new-page', today }), today, 'New page receives its first date');
assert.equal(revisionDate({ previousFingerprint: 'new', fingerprint: 'new', previousDate: today, today: '2026-10-10' }), today, 'Rebuilding on another day does not refresh dates');
assert.equal(revisionDate({ previousFingerprint: 'old-algorithm', fingerprint: 'new-algorithm', previousDate: yesterday, today, preserveDates: true }), yesterday, 'Fingerprint migration preserves dates');
assert.deepEqual(changedBy('app/sitemap.ts'), [], 'Sitemap-only edits are not page-content revisions');
console.log('Revision dates passed: changed/new pages advance; unchanged pages and later rebuilds retain dates.');
