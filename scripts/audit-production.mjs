import { readGuides, readTopicRoutes, topicPath } from './read-guides.mjs';
import fs from "node:fs";

import { staticTdk } from "../seo/tdk.js";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:3139";
const origin = JSON.parse(fs.readFileSync("planning/route-registry.json", "utf8")).origin;
const main = { ...JSON.parse(fs.readFileSync("data/games/main-game.json", "utf8")), seo: staticTdk.home };
const guides = readGuides().filter((item) => item.status === "published");
const staticPages = [
  ["/privacy", staticTdk.privacy], ["/terms", staticTdk.terms],
  ["/copyright", staticTdk.copyright], ["/about", staticTdk.about], ["/contact", staticTdk.contact],
];
const pages = [
  ["/", main.seo, "game"],
  ...staticPages.map(([path, seo]) => [path, seo, "legal"]),
  ...guides.map((item) => [topicPath(item.id), item.seo, "guide"]),
];
const publicPaths = new Set(pages.map(([path]) => path));
const errors = [];
const decode = (value) => value
  .replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'")
  .replaceAll("&#39;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
const textOf = (match) => decode((match?.[1] ?? "").replace(/<[^>]+>/g, "").trim());
const attr = (html, tagPattern, name) => {
  const tag = html.match(tagPattern)?.[0] ?? "";
  return decode(tag.match(new RegExp(`${name}=["']([^"']*)["']`, "i"))?.[1] ?? "");
};

for (const [path, seo, kind] of pages) {
  const response = await fetch(`${baseUrl}${path}`);
  const html = await response.text();
  if (response.status !== 200) errors.push(`${path}: HTTP ${response.status}`);
  const title = textOf(html.match(/<title>([\s\S]*?)<\/title>/i));
  const description = attr(html, /<meta[^>]+name=["']description["'][^>]*>/i, "content");
  const canonical = attr(html, /<link[^>]+rel=["']canonical["'][^>]*>/i, "href");
  const ogImage = attr(html, /<meta[^>]+property=["']og:image["'][^>]*>/i, "content");
  const twitterCard = attr(html, /<meta[^>]+name=["']twitter:card["'][^>]*>/i, "content");
  if (title !== seo.title) errors.push(`${path}: title mismatch (${title})`);
  if (description !== seo.description) errors.push(`${path}: description mismatch`);
  const expectedCanonical = new URL(path, origin).toString();
  if (canonical !== expectedCanonical) errors.push(`${path}: canonical mismatch (${canonical})`);
  if (ogImage !== `${origin}/images/og-image.png`) errors.push(`${path}: incorrect OG image`);
  if (twitterCard !== "summary_large_image") errors.push(`${path}: missing Twitter card`);
  if ((html.match(/<h1[ >]/g) ?? []).length !== 1) errors.push(`${path}: expected one H1`);
  if ((html.match(/application\/ld\+json/g) ?? []).length < 1) errors.push(`${path}: missing JSON-LD`);
  if (path !== "/" && !html.includes('aria-label="Breadcrumb"')) errors.push(`${path}: missing visible breadcrumb`);
  const gameFrames = [...html.matchAll(/<iframe[^>]+src=["']([^"']+)["']/g)].map((match) => decode(match[1])).filter((src) => src.includes("itch.io"));
  if (gameFrames.length) errors.push(`${path}: game iframe exists before Play Now`);
  const videoFrames = [...html.matchAll(/<iframe[^>]+src=["']([^"']+)["']/g)].map((match) => decode(match[1])).filter((src) => src.includes("youtube-nocookie.com"));
  if (kind === "game" && videoFrames.length < 1) errors.push(`${path}: missing adopted video iframe`);
  if (kind !== "game" && videoFrames.length) errors.push(`${path}: unexpected video iframe`);
  const internalLinks = [...html.matchAll(/<a[^>]+href=["']([^"']+)["']/g)].map((match) => decode(match[1])).filter((href) => href.startsWith("/") && !href.startsWith("//"));
  for (const href of internalLinks) {
    const target = href.split("#")[0] || path;
    if (!publicPaths.has(target)) errors.push(`${path}: internal link targets non-public route ${href}`);
  }
  const remoteImages = [...html.matchAll(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/g)];
  if (remoteImages.length) errors.push(`${path}: contains remote image hotlink`);
  const footerHtml = html.match(/<footer[\s\S]*?<\/footer>/i)?.[0] ?? "";
  const legalLinks = [...footerHtml.matchAll(/<a[^>]+href=["']\/(privacy|terms|copyright|about|contact)["'][^>]*>/g)];
  if (legalLinks.length !== 5 || legalLinks.some((match) => !/rel=["'][^"']*noopener[^"']*noreferrer[^"']*nofollow[^"']*["']/.test(match[0]))) errors.push(`${path}: footer legal rel audit failed`);
}

const removedPaths = ["/games", "/games/going-live", "/games/helping-your-boyfriend", "/legal/privacy", "/__draft-preview/test", "/guides", ...guides.map(guide => `/guides/${guide.slug}`)];
for (const path of removedPaths) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  if (response.status !== 404) errors.push(`${path}: expected 404, received ${response.status}`);
}

const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
const sitemap = await sitemapResponse.text();
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const lastModified = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((match) => match[1]);
if (locations.length !== publicPaths.size || new Set(locations).size !== publicPaths.size) errors.push(`sitemap: expected ${publicPaths.size} unique URLs, received ${locations.length}/${new Set(locations).size}`);
if (locations.some((url) => !publicPaths.has(new URL(url).pathname))) errors.push("sitemap: contains a path outside the public registry");
if (lastModified.length !== publicPaths.size || lastModified.some((date) => !/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(date))) errors.push("sitemap: lastModified audit failed");
const robotsResponse = await fetch(`${baseUrl}/robots.txt`);
const robots = await robotsResponse.text();
if (!robots.includes("User-Agent: *") || !robots.includes("Allow: /") || !robots.includes(`${origin}/sitemap.xml`)) errors.push("robots.txt audit failed");
const homeResponse = await fetch(`${baseUrl}/`);
const homeHtml = await homeResponse.text();
if (/href=["']\/guides(?:\/|["'])/.test(homeHtml)) errors.push("Home links to the removed Guides hierarchy");
for (const topic of readTopicRoutes()) {
  const expected = `href="${topic.path}"`;
  if (!homeHtml.includes(expected)) errors.push(`Home missing primary topic ${topic.path}`);
}
if (/href=["']\/games(?:\/|["'])/.test(homeHtml)) errors.push("Home links to the removed More Games navigation");
for (const guide of guides) if (!homeHtml.includes(topicPath(guide.id))) errors.push(`Home missing Guide ${guide.id}`);
const csp = homeResponse.headers.get("content-security-policy") ?? "";
const mainFrameOrigin = new URL(main.player.iframeSrc).origin;
if (csp.includes("'unsafe-eval'")) errors.push("Production CSP permits development-only eval");
if (!csp.includes(mainFrameOrigin) || !csp.includes("https://www.youtube-nocookie.com")) errors.push("CSP frame-src is incomplete");
if (csp.includes("https://itch.io")) errors.push("CSP still allows additional-game frames");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Audited ${pages.length} public pages, ${locations.length} sitemap entries, ${removedPaths.length} expected 404s, robots.txt, and CSP.`);
