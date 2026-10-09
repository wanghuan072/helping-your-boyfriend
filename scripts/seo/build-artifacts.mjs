import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { isWithinDirectory } from '../path-policy.mjs';

const require = createRequire(import.meta.url);
// Use the cache-owner algorithm of this project's pinned Next version, not a
// guessed digest/path. Adapter builds introduced owner-scoped route-cache output.
const { getRouteCacheKey } = require('next/dist/server/lib/route-cache-key.js');

export function artifactPath(route, type = 'page', distDir = '.next', io = fs) {
  if (!['page', 'route'].includes(type)) throw new Error('Unknown prerender artifact type');
  if (!route.startsWith('/') || route.includes('?') || route.includes('#') || route.includes('\\') || route.split('/').some(part => part === '.' || part === '..')) throw new Error('Invalid prerender route');
  const root = path.resolve(distDir);
  const read = file => JSON.parse(io.readFileSync(path.join(root, file), 'utf8'));
  const prerender = read('prerender-manifest.json').routes[route];
  if (!prerender || (prerender.compute && prerender.compute !== 'static') || (prerender.response && prerender.response !== 'complete')) throw new Error(`Complete static prerender missing for ${route}`);
  const owners = Object.entries(read('app-path-routes-manifest.json')).filter(([source, pathname]) => pathname === route && source.endsWith(`/${type}`));
  if (owners.length !== 1) throw new Error(`Ambiguous or missing App Router owner for ${route}`);
  const config = read('required-server-files.json').config;
  const suffix = type === 'page' ? '.html' : '.body';
  let relative;
  if (config.adapterPath && config.output !== 'export') {
    relative = `server${getRouteCacheKey(route, { kind: type === 'page' ? 'APP_PAGE' : 'APP_ROUTE', sourceRoute: owners[0][0] })}${suffix}`;
  } else relative = `server/app/${route === '/' ? 'index' : route.slice(1)}${suffix}`;
  const resolved = path.resolve(root, relative);
  if (!isWithinDirectory(root, resolved)) throw new Error('Prerender artifact escapes build directory');
  if (!io.existsSync(resolved)) throw new Error(`Next prerender artifact missing for ${route} (${config.adapterPath ? 'adapter route-cache' : 'standalone'} layout): ${relative}`);
  return resolved;
}

export function readArtifact(route, type = 'page', distDir = '.next') {
  return fs.readFileSync(artifactPath(route, type, distDir), 'utf8');
}
