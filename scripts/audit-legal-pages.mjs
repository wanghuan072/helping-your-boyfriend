import fs from "node:fs";
import assert from "node:assert/strict";
import { staticTdk } from "../seo/tdk.js";

// Inspect build output without starting a server.
for (const key of ["privacy", "terms", "copyright", "about", "contact"]) {
  const html = fs.readFileSync(`.next/server/app/${key}.html`, "utf8");
  const main = html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? "";
  const body = main.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const dates = [...main.matchAll(/<time[^>]*dateTime="([^"]+)"[^>]*>([\s\S]*?)<\/time>/gi)];
  const tdk = staticTdk[key];
  assert.equal((main.match(/<h1[ >]/g) ?? []).length, 1, `${key}: one H1`);
  assert.ok(body.split(" ").length >= 500, `${key}: substantive copy`);
  assert.ok(main.includes("support@helpingyourboyfriend.org"), `${key}: support email`);
  assert.ok(!html.includes("mailto:") && !html.includes("<form"), `${key}: plain-text contact only`);
  assert.equal(dates.length, 1, `${key}: one update label`);
  assert.equal(dates[0][2].replace(/<[^>]+>/g, ""), "Updated 2026-10", `${key}: month-only label`);
  assert.match(dates[0][1], /^2026-10-\d{2}$/, `${key}: machine-readable date`);
  assert.ok(tdk.title.length >= 40 && tdk.title.length <= 60, `${key}: title length`);
  assert.ok(tdk.description.length >= 140 && tdk.description.length <= 160, `${key}: description length`);
  const footer = html.match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? "";
  const links = [...footer.matchAll(/<a[^>]+href="\/(privacy|terms|copyright|about|contact)"[^>]*>/g)];
  assert.equal(links.length, 5, `${key}: five footer legal links`);
  assert.ok(links.every(([tag]) => tag.includes('rel="noopener noreferrer nofollow"')), `${key}: footer rel`);
  console.log(`${key}: ${body.split(" ").length} words, ${(main.match(/<h2/g) ?? []).length} sections; email, dates, TDK and footer passed.`);
}
