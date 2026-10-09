import assert from 'node:assert/strict';
import fs from 'node:fs';
import { visibleBodyCharacters, validateRouteMap } from './content-contract.mjs';

const guide = JSON.parse(fs.readFileSync('data/guides/helping-your-boyfriend-endings-walkthrough.json','utf8'));
const html = fs.readFileSync('.next/server/app/endings.html','utf8');
const main = html.match(/<main[\s\S]*?<\/main>/)?.[0];
assert(main, 'Production document must contain server-rendered main content');
const errors = [];
validateRouteMap(guide, errors);
assert.deepEqual(errors, []);
assert.equal([...main.matchAll(/data-route-node=/g)].length, guide.routeMap.nodes.length);
assert(!/<details|<dialog/.test(main), 'Tree content must not depend on disclosure or modal UI');
for (const node of guide.routeMap.nodes) {
  assert(main.includes(`id="${node.sectionId}"`), `Missing server node ${node.sectionId}`);
  const section = guide.sections.find(section=>section.id===node.sectionId);
  assert(section.blocks.some(block=>block.type==='image'));
}
for (const edge of guide.routeMap.edges) assert(main.includes(`href="#${edge.to}"`), `Missing no-JavaScript destination ${edge.to}`);
const images = guide.routeMap.nodes.map(node=>guide.sections.find(section=>section.id===node.sectionId).blocks.find(block=>block.type==='image').src);
assert.equal(new Set(images).size, images.length, 'Each route node needs its own matching frame');
const characters = visibleBodyCharacters({content:guide.sections});
assert(characters>=4000);
console.log(JSON.stringify({serverRenderedNodes:guide.routeMap.nodes.length,readableRouteConnections:guide.routeMap.edges.length,uniqueGameplayImages:images.length,bodyNonWhitespaceCharacters:characters,endingAnchors:4,collapsibleUI:false},null,2));
