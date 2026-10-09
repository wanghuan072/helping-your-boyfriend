import assert from 'node:assert/strict';
import fs from 'node:fs';
import { staticTdk, pageTdk } from '../seo/tdk.js';
import { validateRecord, visibleBodyCharacters } from './content-contract.mjs';
import { selectGameCollections, selectHomepage } from '../lib/content/collections.mjs';
import { readGuides, readTopicRoutes, topicPath } from './read-guides.mjs';
const games=JSON.parse(fs.readFileSync('data/games/games.json'));
const main={...JSON.parse(fs.readFileSync('data/games/main-game.json')),seo:staticTdk.home};
for(const value of Object.values(pageTdk)){
  assert(Array.from(value.title).length>=40&&Array.from(value.title).length<=60);
  assert(Array.from(value.description).length>=140&&Array.from(value.description).length<=160);
}
assert(!('seo' in JSON.parse(fs.readFileSync('data/games/main-game.json'))));
for(const name of fs.readdirSync('data/guides'))if(name.endsWith('.json'))assert(!('seo' in JSON.parse(fs.readFileSync(`data/guides/${name}`))));
for(const game of [main,...games]){const errors=[];validateRecord(game,'game',errors);assert.deepEqual(errors,[]);assert(visibleBodyCharacters(game)>=4000);}
const guides=readGuides();
const topics=readTopicRoutes();
assert.deepEqual(topics.map(topic=>topic.path),['/endings','/characters','/controls']);
assert.equal(new Set(topics.map(topic=>topic.id)).size,3);
for(const topic of topics)assert.deepEqual(Object.keys(topic).sort(),['id','label','path']);
assert(!fs.readFileSync('config/navigation.ts','utf8').includes('More Games'));
assert(!fs.readFileSync('next.config.ts','utf8').includes('redirects'));
const mainPage=fs.readFileSync('components/game/MainGamePage.tsx','utf8');
assert(mainPage.indexOf('id="game-player"')<mainPage.indexOf('className="scrapbook-topic-links"'));
for(const id of ['cast-notes','controls-at-a-glance','before-another-run'])assert(main.content.some(section=>section.id===id));
assert(!mainPage.includes("<details"));
assert(!fs.readFileSync("components/game/ContentSection.tsx", "utf8").includes("<details"));
assert(!fs.readFileSync("components/game/ContentRenderer.tsx", "utf8").includes("<details"));
assert(!mainPage.includes('story-hero'));
for(const guide of guides)assert(!topicPath(guide.id).startsWith('/guides'));
assert.equal(guides.length,3);
const endings=guides.find(guide=>guide.id==='helping-your-boyfriend-endings-walkthrough');
const namedRoutes=endings.sections.filter(section=>/^ending-(one|two|three|four)$/.test(section.id));
assert.deepEqual(namedRoutes.map(section=>section.title),['Ending 1: My Boyfriend Is the Best','Ending 2: Nobody’s Home','Ending 3: The Empty Cage','Ending 4: Moving Forward']);
for(const section of namedRoutes){assert(section.summary.length>80);assert(section.blocks.some(block=>block.type==='steps'));assert(section.blocks.some(block=>block.type==='paragraph'));}
assert(endings.routeMap);
assert.equal(endings.routeMap.nodes.filter(node=>node.kind==='ending').length,4);
for(const node of endings.routeMap.nodes)assert(endings.sections.find(section=>section.id===node.sectionId).blocks.some(block=>block.type==='image'));
const sharedChain=['number-clue','package-address','adrian-medicine','ian-relationship','scalpel-choice','survive-confrontation','body-key','locked-room','phone-call','address-answer','rescue-outcome'];
for(let i=0;i<sharedChain.length-1;i++)assert(endings.routeMap.edges.some(edge=>edge.from===sharedChain[i]&&edge.to===sharedChain[i+1]));
for(const terminal of ['ending-three','ending-four'])assert(endings.routeMap.edges.some(edge=>edge.from==='rescue-outcome'&&edge.to===terminal));
for(const mutate of [g=>g.routeMap.edges.push({from:'missing',to:'ending-one',label:'bad'}),g=>g.routeMap.nodes[1].sectionId='missing',g=>g.routeMap.edges.push({from:'ending-one',to:'first-night-pill',label:'cycle'}),g=>g.routeMap.nodes[1].row=0,g=>g.routeMap.afterTree.push('first-night-pill')]){const guide=structuredClone(endings);mutate(guide);const errors=[];validateRecord(guide,'guide',errors);assert(errors.length>0);}
const topicArticle=fs.readFileSync('components/guide/GuideArticle.tsx','utf8');
assert(!topicArticle.includes('ContentSection'));
assert(!topicArticle.includes('<details'));
assert(topicArticle.includes('topic-spoiler-note'));
for(const guide of guides){
  const warnings=guide.sections.flatMap(section=>section.blocks).filter(block=>block.type==='callout'&&block.label==='Spoilers ahead');
  assert.equal(warnings.length,guide.id==='helping-your-boyfriend-controls-minigames'?0:1);
}
for(const guide of guides){const errors=[];validateRecord(guide,'guide',errors);assert.deepEqual(errors,[]);assert(guide.sections.length>=4);assert(!JSON.stringify(guide).includes('Helping Our Boyfriend'));}
for(const mutate of [g=>g.extra='unsupported',g=>g.player.secondSource='https://example.com',g=>g.updatedAt='2026-99-99',g=>g.content[0].blocks.push({type:'callout',tone:'spoiler',text:'obsolete'}),g=>g.content[0].blocks.push({type:'table',columns:['a','b'],rows:[['short']]}),g=>g.content.push(g.content[0])]){const game=structuredClone(games[0]);mutate(game);const errors=[];validateRecord(game,'game',errors);assert(errors.length>0);}
const home=selectHomepage(games);assert.equal(home.recommended.length,6);assert(home.featured.length>=6&&home.featured.length<=8);assert(home.newest.length>=6&&home.newest.length<=8);
for(const game of games)for(const list of Object.values(selectGameCollections(games,game))){assert.equal(list.length,6);assert.equal(new Set(list.map(g=>g.id)).size,6);assert(!list.some(g=>g.id===game.id));}
assert.deepEqual(selectHomepage([...games].reverse()),home);
console.log('Content contracts, negative fixtures, visible body counts and deterministic collections passed.');
