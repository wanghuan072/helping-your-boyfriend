import assert from 'node:assert/strict';
import fs from 'node:fs';
import { publicFingerprints } from './page-fingerprints.mjs';
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
