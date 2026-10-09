import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const standalone = resolve(".next/standalone");
if (!existsSync(standalone)) throw new Error("Standalone output is missing. Run next build first.");
for (const [source, target] of [["public", ".next/standalone/public"], [".next/static", ".next/standalone/.next/static"]]) {
  if (!existsSync(source)) continue;
  const absoluteTarget = resolve(target);
  if (!absoluteTarget.startsWith(`${standalone}\\`)) throw new Error('Refusing cleanup outside standalone build output');
  rmSync(absoluteTarget, { recursive: true, force: true });
  mkdirSync(resolve(target, ".."), { recursive: true });
  cpSync(source, target, { recursive: true });
}
console.log("Prepared .next/standalone with public and static assets.");
