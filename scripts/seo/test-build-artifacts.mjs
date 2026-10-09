import assert from 'node:assert/strict';
import path from 'node:path';
import { artifactPath } from './build-artifacts.mjs';
const root = path.resolve('reports/runtime/artifact-fixture');
const routes = ['/', '/endings', '/characters', '/controls', '/privacy', '/terms', '/copyright', '/about', '/contact'];
const machine = ['/sitemap.xml', '/robots.txt', '/.well-known/seo-url-manifest.json'];
const owners = Object.fromEntries([...routes.map(route => [`${route === '/' ? '' : route}/page`,route]), ...machine.map(route => [`${route}/route`,route])]);
function fixture(adapter, missing = false) {
  const files = {
    'prerender-manifest.json': { routes: Object.fromEntries([...routes,...machine].map(route => [route,{compute:'static',response:'complete'}])) },
    'app-path-routes-manifest.json': owners,
    'required-server-files.json': {config:{output:'standalone',...(adapter ? {adapterPath:'test-adapter'} : {})}},
  };
  return { readFileSync(file) { const key=path.relative(root,file).replaceAll(path.sep,'/');if(!files[key]) throw Error('Unexpected file');return JSON.stringify(files[key]); }, existsSync:()=>!missing };
}
for(const route of routes) {
  assert.equal(artifactPath(route,'page',root,fixture(false)),path.join(root,'server/app',`${route==='/'?'index':route.slice(1)}.html`));
  const scoped=artifactPath(route,'page',root,fixture(true));
  assert.match(scoped.replaceAll(path.sep,'/'),/\/server\/route-cache\/APP_PAGE\/[a-f0-9]{64}\/\$/);
  assert.ok(scoped.endsWith(`${route==='/'?'index':route.slice(1)}.html`));
}
for(const route of machine) assert.match(artifactPath(route,'route',root,fixture(true)).replaceAll(path.sep,'/'),/\/APP_ROUTE\/[a-f0-9]{64}\/\$/);
assert.throws(()=>artifactPath('/','page',root,fixture(true,true)),/artifact missing/);
assert.throws(()=>artifactPath('/unregistered','page',root,fixture(true)),/prerender missing/);
assert.throws(()=>artifactPath('/../outside','page',root,fixture(true)),/Invalid/);
console.log('Next output resolution passed: nine pages + three machine routes, legacy and adapter layouts, missing/foreign route rejection.');
