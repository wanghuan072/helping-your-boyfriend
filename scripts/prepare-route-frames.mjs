import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

// Crop only the visibly inspected video rectangle; preserve the creator's overlay and watermark.
const root = path.resolve('reports/redesign/route-frame-captures');
const results = [];
for (const filename of fs.readdirSync(root).filter(name => name.endsWith('.jpg'))) {
  const name = filename.slice(0, -4);
  const observation = JSON.parse(fs.readFileSync(path.join(root, `${name}.json`), 'utf8'));
  const rect = observation.rect;
  if (rect.x < 0 || rect.y < 56) throw new Error(`${name}: video was occluded; recapture`);
  const localPath = `/images/guides/route-${name}.webp`;
  const target = path.resolve(`public${localPath}`);
  await sharp(path.join(root, filename)).extract({ left: Math.round(rect.x), top: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) }).webp({ quality: 88 }).toFile(target);
  const metadata = await sharp(target).metadata();
  results.push({ name, time: observation.time, localPath, width: metadata.width, height: metadata.height, fileBytes: fs.statSync(target).size });
}
console.log(JSON.stringify(results, null, 2));
