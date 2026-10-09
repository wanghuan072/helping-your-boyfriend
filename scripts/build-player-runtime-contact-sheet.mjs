import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const games = JSON.parse(fs.readFileSync("data/games/games.json", "utf8")).filter((item) => item.status === "published");
const width = 1440;
const height = 900;
const cells = [];
for (const [index, game] of games.entries()) {
  const screenshot = path.resolve(`reports/acceptance-evidence/player-${game.slug}.png`);
  const image = await sharp(screenshot).resize(460, 250, { fit: "cover", position: "top" }).png().toBuffer();
  const label = Buffer.from(`<svg width="460" height="36" xmlns="http://www.w3.org/2000/svg"><rect width="460" height="36" fill="#2c1828"/><text x="12" y="24" font-family="Arial" font-size="16" font-weight="700" fill="white">${game.title.replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</text></svg>`);
  const left = (index % 3) * 480 + 10;
  const top = Math.floor(index / 3) * 300 + 7;
  cells.push({ input: image, left, top }, { input: label, left, top: top + 250 });
}
await sharp({ create: { width, height, channels: 4, background: "#fff7fa" } }).composite(cells).png().toFile("reports/acceptance-evidence/player-runtime-contact-sheet.png");
console.log(`Built player runtime contact sheet for ${games.length} games.`);
