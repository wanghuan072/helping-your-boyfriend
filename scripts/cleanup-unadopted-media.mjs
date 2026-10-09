import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const imageRoot = path.resolve("public/images");
const ledger = JSON.parse(fs.readFileSync("research/media-ledger.json", "utf8"));
const adopted = new Set(ledger.records.filter((record) => record.status === "adopted" && record.localPath).map((record) => path.resolve("public", record.localPath.replace(/^\//, ""))));
adopted.add(path.resolve("public/images/logo.png"));
adopted.add(path.resolve("public/images/og-image.png"));

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
}

const extras = walk(imageRoot).filter((file) => !adopted.has(path.resolve(file)));
for (const file of extras) {
  const resolved = path.resolve(file);
  if (!resolved.startsWith(`${imageRoot}${path.sep}`)) throw new Error(`Refusing to remove path outside public images: ${resolved}`);
  fs.unlinkSync(resolved);
}
for (const directory of fs.readdirSync(path.resolve("public/images/games"), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => path.resolve("public/images/games", entry.name))) {
  if (!directory.startsWith(`${path.resolve(projectRoot, "public/images/games")}${path.sep}`)) throw new Error(`Refusing to remove directory outside game images: ${directory}`);
  if (fs.readdirSync(directory).length === 0) fs.rmdirSync(directory);
}
console.log(`Removed ${extras.length} unadopted public media files.`);
