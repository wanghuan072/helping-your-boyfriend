import { readGuides } from './read-guides.mjs';
import fs from "node:fs";
import path from "node:path";

import sharp from "sharp";

const main = JSON.parse(fs.readFileSync("data/games/main-game.json", "utf8"));
const games = [main, ...JSON.parse(fs.readFileSync("data/games/games.json", "utf8"))];
const guides = readGuides();
const publicFile = (src) => path.join("public", src.replace(/^\//, ""));
const escapeXml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;");

async function fitted(file, width, height, background = "#180e18") {
  return sharp(file).resize({ width, height, fit: "contain", background }).png().toBuffer();
}

async function gameSheet() {
  const width = 1400;
  const rowHeight = 235;
  const parts = [];
  const contexts = [
    ["Original", 230, 180],
    ["Featured / New", 165, 165],
    ["Recommended", 205, 154],
    ["More Games", 165, 124],
    ["Player cover", 360, 190],
  ];
  for (const [row, game] of games.entries()) {
    const top = row * rowHeight;
    parts.push({ input: Buffer.from(`<svg width="220" height="235"><rect width="220" height="235" fill="#2f1727"/><text x="16" y="38" font-family="Arial" font-size="17" font-weight="700" fill="#fff">${escapeXml(game.title).slice(0, 25)}</text><text x="16" y="64" font-family="Arial" font-size="11" fill="#f1aabe">${escapeXml(game.id).slice(0, 30)}</text></svg>`), left: 0, top });
    let left = 235;
    for (const [label, imageWidth, imageHeight] of contexts) {
      const labelSvg = Buffer.from(`<svg width="${imageWidth}" height="26"><text x="4" y="18" font-family="Arial" font-size="12" font-weight="700" fill="#5c3147">${label}</text></svg>`);
      parts.push({ input: labelSvg, left, top: top + 8 });
      parts.push({ input: await fitted(publicFile(game.image.src), imageWidth, imageHeight), left, top: top + 34 });
      left += imageWidth + 18;
    }
  }
  await sharp({ create: { width, height: games.length * rowHeight, channels: 3, background: "#f7eff2" } }).composite(parts).png().toFile("reports/cover-context-contact-sheet.png");
}

async function guideSheet() {
  const width = 1400;
  const rowHeight = 340;
  const parts = [];
  for (const [row, guide] of guides.entries()) {
    const top = row * rowHeight;
    parts.push({ input: Buffer.from(`<svg width="250" height="340"><rect width="250" height="340" fill="#2f1727"/><text x="16" y="38" font-family="Arial" font-size="17" font-weight="700" fill="#fff">${escapeXml(guide.title).slice(0, 25)}</text><text x="16" y="64" font-family="Arial" font-size="11" fill="#f1aabe">${escapeXml(guide.id).slice(0, 34)}</text><text x="16" y="94" font-family="Arial" font-size="11" fill="#fff">${escapeXml(guide.cover.alt).slice(0, 34)}</text></svg>`), left: 0, top });
    const contexts = [["Ledger original", 300, 190], ["/guides list card", 330, 193], ["Guide detail lead", 470, 264]];
    let left = 270;
    for (const [label, imageWidth, imageHeight] of contexts) {
      parts.push({ input: Buffer.from(`<svg width="${imageWidth}" height="28"><text x="4" y="19" font-family="Arial" font-size="12" font-weight="700" fill="#5c3147">${label}</text></svg>`), left, top: top + 8 });
      parts.push({ input: await fitted(publicFile(guide.cover.src), imageWidth, imageHeight, "#fff7fa"), left, top: top + 38 });
      left += imageWidth + 22;
    }
  }
  await sharp({ create: { width, height: guides.length * rowHeight, channels: 3, background: "#f7eff2" } }).composite(parts).png().toFile("reports/guide-cover-contact-sheet.png");
}

await gameSheet();
await guideSheet();
console.log("Built game and Guide cover context contact sheets.");
