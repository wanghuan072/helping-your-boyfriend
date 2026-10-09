import assert from 'node:assert/strict';
import fs from 'node:fs';
import { readGuides, topicPath } from './read-guides.mjs';

const decode = text => text.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const results = [];
for (const guide of readGuides().filter(guide => /characters|controls/.test(guide.id))) {
  const route = topicPath(guide.id);
  const html = fs.readFileSync(`.next/server/app${route}.html`, 'utf8');
  const body = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert.ok(body, `${route}: server-rendered main`);
  assert.equal((body.match(/<h1\b/g) ?? []).length, 1, `${route}: single H1`);
  assert.ok(decode(body).includes(guide.title), `${route}: exact game heading`);
  assert.equal((body.match(/<details\b/g) ?? []).length, 0, `${route}: no hidden sections`);
  const ids = [...body.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, `${route}: unique anchors`);
  for (const section of guide.sections) {
    assert.ok(ids.includes(section.id), `${route}: retains ${section.id}`);
    for (const block of section.blocks) {
      const text = block.type === 'paragraph' ? block.text : block.type === 'callout' ? block.body : null;
      if (text) assert.ok(decode(body).includes(text), `${route}: text remains readable without JS`);
    }
  }
  for (const link of body.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(link[1]), `${route}: valid destination ${link[1]}`);
  const visible = decode(body.replace(/<[^>]+>/g, '')).replace(/\s/g, '').length;
  assert.ok(visible >= 4000, `${route}: rich visible copy (${visible})`);
  if (route === '/characters') assert.equal((body.match(/Spoilers ahead/g) ?? []).length, 1, 'one spoiler reminder');
  if (route === '/controls') assert.ok(!body.includes('controls-minigames-step-3'), 'no unrelated customisation screenshot');
  assert.ok(!/characters-ui-concept|controls-ui-concept|More Games|href="\/guides|href="\/games/.test(body), `${route}: no mockup media or old routes`);
  const title = decode(html.match(/<title>(.*?)<\/title>/)?.[1] ?? '');
  const description = decode(html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? '');
  assert.ok(title.length >= 40 && title.length <= 60, `${route}: title length`);
  assert.ok(description.length >= 140 && description.length <= 160, `${route}: description length`);
  results.push({ route, sections: guide.sections.length, visibleCharacters: visible, titleCharacters: title.length, descriptionCharacters: description.length });
}
console.log(JSON.stringify(results, null, 2));
