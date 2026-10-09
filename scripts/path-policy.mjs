import path from 'node:path';

// Require a strict descendant: a shared prefix alone does not establish containment.
// The optional path API lets tests exercise Windows and POSIX on either host.
export function isWithinDirectory(root, candidate, pathApi = path) {
  const relative = pathApi.relative(pathApi.resolve(root), pathApi.resolve(candidate));
  return relative !== '' && relative !== '..' &&
    !relative.startsWith(`..${pathApi.sep}`) && !pathApi.isAbsolute(relative);
}
