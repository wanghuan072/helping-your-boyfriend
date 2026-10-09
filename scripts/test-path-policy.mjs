import assert from 'node:assert/strict';
import { posix, win32 } from 'node:path';
import { isWithinDirectory } from './path-policy.mjs';

for (const [name, api, workspace] of [['Linux', posix, '/vercel/path0'], ['Windows', win32, 'D:\\project']]) {
  const publicRoot = api.join(workspace, 'public');
  assert.equal(isWithinDirectory(publicRoot, api.join(publicRoot, 'images', 'logo.png'), api), true, `${name}: public image`);
  assert.equal(isWithinDirectory(publicRoot, api.join(publicRoot, '..image.png'), api), true, `${name}: harmless filename`);
  assert.equal(isWithinDirectory(publicRoot, publicRoot, api), false, `${name}: root itself`);
  assert.equal(isWithinDirectory(publicRoot, api.join(publicRoot, '..', 'private.png'), api), false, `${name}: traversal`);
  assert.equal(isWithinDirectory(publicRoot, api.join(workspace, 'public-backup', 'logo.png'), api), false, `${name}: prefix collision`);
  const standalone = api.join(workspace, '.next', 'standalone');
  for (const target of ['public', '.next/static']) assert.equal(isWithinDirectory(standalone, api.resolve(standalone, target), api), true, `${name}: standalone ${target}`);
  assert.equal(isWithinDirectory(standalone, api.join(workspace, '.next', 'standalone-other', 'public'), api), false, `${name}: unsafe cleanup`);
  assert.equal(isWithinDirectory(standalone, api.resolve(standalone, '..'), api), false, `${name}: parent cleanup`);
}
assert.equal(isWithinDirectory('C:\\project\\public', 'D:\\project\\public\\logo.png', win32), false, 'Windows: another drive');
console.log('Windows and Linux path checks passed: valid media/build targets accepted; roots, traversal, prefix collisions and foreign drives rejected.');
