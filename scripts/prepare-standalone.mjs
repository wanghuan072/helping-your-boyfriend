import { cpSync, existsSync, mkdirSync, rmSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isWithinDirectory } from './path-policy.mjs';

const standalone = resolve(".next/standalone");
const config = JSON.parse(readFileSync('.next/required-server-files.json', 'utf8')).config;
if (config.adapterPath) {
  console.log('Deployment adapter owns output packaging; standalone asset copying is not required.');
  process.exit(0);
}
if (!existsSync(standalone)) throw new Error("Standalone output is missing. Run next build first.");
for (const [source, target] of [["public", ".next/standalone/public"], [".next/static", ".next/standalone/.next/static"]]) {
  if (!existsSync(source)) continue;
  const absoluteTarget = resolve(target);
  if (!isWithinDirectory(standalone, absoluteTarget)) throw new Error('Refusing cleanup outside standalone build output');
  rmSync(absoluteTarget, { recursive: true, force: true });
  mkdirSync(resolve(target, ".."), { recursive: true });
  cpSync(source, target, { recursive: true });
}
console.log("Prepared .next/standalone with public and static assets.");
