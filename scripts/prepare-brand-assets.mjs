import fs from "node:fs/promises";
import sharp from "sharp";

// Format and size conversion only; the artwork itself is created with imagegen.
const iconSource = "reports/branding/stitched-heart-source.png";
const cardSource = "reports/branding/social-card-source.png";
const icon = await sharp(iconSource).trim({ threshold: 10 }).png().toBuffer();
await sharp(icon).resize(128, 128, { fit: "contain", background: "#00000000" }).png({ compressionLevel: 9 }).toFile("public/images/logo.png");
await sharp(cardSource).resize(1200, 630, { fit: "contain", background: "#f4dce0" }).png().toFile("public/images/og-image.png");
await sharp(icon).resize(64, 64, { fit: "contain", background: "#00000000" }).png().toFile("app/icon.png");

// Standard ICO directory with PNG-encoded image entries, including a 256px entry.
const sizes = [16, 32, 48, 64, 256];
const frames = await Promise.all(sizes.map(size => sharp(icon).resize(size, size, { fit: "contain", background: "#00000000" }).png().toBuffer()));
const header = Buffer.alloc(6 + frames.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);
let offset = header.length;
for (let i = 0; i < frames.length; i++) {
  const start = 6 + i * 16;
  header[start] = sizes[i] === 256 ? 0 : sizes[i];
  header[start + 1] = header[start];
  header.writeUInt16LE(1, start + 4);
  header.writeUInt16LE(32, start + 6);
  header.writeUInt32LE(frames[i].length, start + 8);
  header.writeUInt32LE(offset, start + 12);
  offset += frames[i].length;
}
await fs.writeFile("app/favicon.ico", Buffer.concat([header, ...frames]));
console.log("Prepared transparent logo, 1200×630 social card, 64px PNG icon and five-size favicon.ico.");
