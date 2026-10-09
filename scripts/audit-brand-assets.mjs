import fs from "node:fs";
import assert from "node:assert/strict";
import sharp from "sharp";

const logo = await sharp("public/images/logo.png").metadata();
const og = await sharp("public/images/og-image.png").metadata();
assert.ok(logo.hasAlpha && logo.width === 128 && logo.height === 128);
assert.ok(og.width === 1200 && og.height === 630);
const ico = fs.readFileSync("app/favicon.ico");
assert.equal(ico.readUInt16LE(0), 0);
assert.equal(ico.readUInt16LE(2), 1);
assert.equal(ico.readUInt16LE(4), 5);
for (let i = 0; i < 5; i++) {
  const entry = 6 + i * 16;
  const size = ico[entry] || 256;
  const bytes = ico.readUInt32LE(entry + 8);
  const offset = ico.readUInt32LE(entry + 12);
  const metadata = await sharp(ico.subarray(offset, offset + bytes)).metadata();
  assert.equal(metadata.width, size);
  assert.equal(metadata.height, size);
  assert.ok(metadata.hasAlpha);
}
for (const page of ["index", "endings", "characters", "controls", "privacy", "terms", "copyright", "about", "contact"]) {
  const html = fs.readFileSync(`.next/server/app/${page}.html`, "utf8");
  assert.match(html, /rel="icon"[^>]*href="\/favicon\.ico\?/);
  assert.match(html, /rel="icon"[^>]*href="\/icon\.png\?/);
  assert.match(html, /property="og:image"[^>]*content="[^"]*\/images\/og-image\.png"/);
  assert.match(html, /name="twitter:image"[^>]*content="[^"]*\/images\/og-image\.png"/);
  assert.ok(html.includes('class="brand-wordmark"'));
}
console.log("Logo alpha, 1200×630 social card, five ICO entries, and favicon/social metadata on all nine public pages passed.");
