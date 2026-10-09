import { readGuides, topicPath } from './read-guides.mjs';
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

import sharp from "sharp";
import { staticTdk } from "../seo/tdk.js";
import { validateRecord, visibleBodyCharacters } from './content-contract.mjs';
import { isWithinDirectory } from './path-policy.mjs';

const mode = process.argv[2] ?? "development";
if (!["development", "media", "publish"].includes(mode)) throw new Error(`Unknown validation mode: ${mode}`);
const read = (path) => JSON.parse(readFileSync(resolve(path), "utf8"));
const main = { ...read("data/games/main-game.json"), seo: staticTdk.home };
const games = read("data/games/games.json");
const guides = readGuides();
const mediaLedger = read("research/media-ledger.json");
const videoAnalysis = read("research/video-analysis.json");
const gameBriefs = read("research/game-content-briefs.json");
const guideBriefs = read("research/guide-content-briefs.json");
const routeRegistry = read("planning/route-registry.json");
const errors = [];
const requiredGameKeys = ["id","slug","title","shortDescription","status","publishedAt","updatedAt","tags","categories","spoilerPolicy","flags","image","player","seo","content","relatedGameIds"];
const requiredGuideKeys = ["id","slug","title","summary","status","publishedAt","updatedAt","authorId","tags","spoilerPolicy","cover","seo","sections","relatedGuideIds"];
const ids = new Set(); const slugs = new Set();
const ledgerById = new Map(mediaLedger.records.map((record) => [record.id, record]));
const analysisById = new Map(videoAnalysis.records.map((record) => [record.analysis_id, record]));
const coverHashes = new Map();
const publicRoot = resolve("public");

function resolvePublicImage(src, owner, requiredPrefix) {
  if (typeof src !== "string" || !src.startsWith(requiredPrefix)) {
    errors.push(`${owner}: image path must start with ${requiredPrefix}`);
    return null;
  }
  const file = resolve("public", src.replace(/^\//, ""));
  if (!isWithinDirectory(publicRoot, file)) {
    errors.push(`${owner}: image path escapes public directory`);
    return null;
  }
  if (!existsSync(file)) {
    errors.push(`${owner}: missing image file ${src}`);
    return null;
  }
  return file;
}

async function validateImage(image, owner, requiredPrefix, hashes = null) {
  if (!image?.src || !image?.alt || !Number.isInteger(image?.width) || !Number.isInteger(image?.height)) {
    errors.push(`${owner}: incomplete image data`);
    return;
  }
  const file = resolvePublicImage(image.src, owner, requiredPrefix);
  if (!file) return;
  const metadata = await sharp(file).metadata();
  if (metadata.width !== image.width || metadata.height !== image.height) {
    errors.push(`${owner}: declared ${image.width}x${image.height}, actual ${metadata.width}x${metadata.height}`);
  }
  if (hashes) {
    const hash = createHash("sha256").update(readFileSync(file)).digest("hex");
    const duplicate = hashes.get(hash);
    if (duplicate) errors.push(`${owner}: cover duplicates ${duplicate}`);
    else hashes.set(hash, owner);
  }
}

function validateAdoptedVideo(game, video) {
  if (!/^[A-Za-z0-9_-]{11}$/.test(video.videoId)) errors.push(`${game.id}: invalid YouTube ID ${video.videoId}`);
  const ledger = mediaLedger.records.find((record) => record.kind === "video-embed" && record.subjectGameId === game.id && record.videoId === video.videoId);
  if (!ledger || ledger.status !== "adopted" || ledger.embedStatus !== "verified" || ledger.ageRestrictionStatus !== "clear") {
    errors.push(`${game.id}: adopted video ${video.videoId} lacks a verified, clear media-ledger record`);
    return;
  }
  const analysis = analysisById.get(ledger.videoAnalysisId);
  if (!analysis || analysis.game_id !== game.id || analysis.video_id !== video.videoId) {
    errors.push(`${game.id}: adopted video ${video.videoId} does not match its video analysis`);
  } else {
    const ranges = new Set(analysis.reviewed_ranges.map((range) => range.range_id));
    if (!ledger.reviewedRangeIds.length || ledger.reviewedRangeIds.some((id) => !ranges.has(id))) errors.push(`${game.id}: adopted video has invalid reviewed ranges`);
  }
}

for (const game of (mode === "publish" ? [main] : [main, ...games])) {
  validateRecord(game, 'game', errors);
  for (const key of requiredGameKeys) if (!(key in game)) errors.push(`${game.id ?? "unknown"}: missing ${key}`);
  if (ids.has(game.id)) errors.push(`duplicate game id ${game.id}`); ids.add(game.id);
  if (slugs.has(game.slug)) errors.push(`duplicate game slug ${game.slug}`); slugs.add(game.slug);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(game.id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(game.slug)) errors.push(`${game.id}: invalid id or slug`);
  if (!game.player || typeof game.player.iframeSrc !== "string") errors.push(`${game.id}: missing iframeSrc`);
  if (game !== main && game.player?.iframeSrc) { try { const u = new URL(game.player.iframeSrc); if (u.protocol !== "https:") errors.push(`${game.id}: frame must use HTTPS`); } catch { errors.push(`${game.id}: invalid additional-game frame URL`); } }
  if (mode !== "development") {
    await validateImage(game.image, `${game.id} cover`, "/images/games/", coverHashes);
    const adoptedImages = game.content.flatMap((section) => section.blocks).filter((block) => block.type === "image" && true);
    if (adoptedImages.length < 3) errors.push(`${game.id}: requires at least three adopted article screenshots`);
    for (const [index, image] of adoptedImages.entries()) await validateImage(image, `${game.id} article image ${index + 1}`, "/images/games/");
    const videos = game.content.flatMap((section) => section.blocks).filter((block) => block.type === "video" && true);
    if (videos.length < 1 || videos.length > 3) errors.push(`${game.id}: requires 1-3 adopted videos`);
    for (const video of videos) validateAdoptedVideo(game, video);
    const brief = gameBriefs.records.find((record) => record.game_id === game.id);
    if (!brief || brief.screenshot_tasks.length < 3 || brief.screenshot_tasks.some((task) => !ledgerById.has(task.adopted_media_id))) errors.push(`${game.id}: screenshot tasks are not fully linked to the media ledger`);
    if (!brief || brief.youtube_research.decision !== "adopted" || brief.youtube_research.adopted_media_ids.length < 1) errors.push(`${game.id}: video research is not adopted`);
  }
  if (mode === "publish" && game.status === "published") {
    if (!game.publishedAt || !game.updatedAt) errors.push(`${game.id}: missing dates`);
    if (Array.from(game.seo?.title ?? "").length < 40 || Array.from(game.seo?.title ?? "").length > 60) errors.push(`${game.id}: SEO title length`);
    if (Array.from(game.seo?.description ?? "").length < 140 || Array.from(game.seo?.description ?? "").length > 160) errors.push(`${game.id}: SEO description length`);
    const visible = visibleBodyCharacters(game);
    if (visible < 4000) errors.push(`${game.id}: visible article has ${visible} non-whitespace characters`);
    const videos = game.content.flatMap((section) => section.blocks).filter((block) => block.type === "video" && true);
    if (videos.length < 1 || videos.length > 3) errors.push(`${game.id}: requires 1-3 adopted videos`);
  }
}
for (const guide of guides) {
  validateRecord(guide, 'guide', errors);
  for (const key of requiredGuideKeys) if (!(key in guide)) errors.push(`${guide.id ?? "unknown"}: missing ${key}`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(guide.id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(guide.slug)) errors.push(`${guide.id}: invalid id or slug`);
  if (mode !== "development") {
    await validateImage(guide.cover, `${guide.id} cover`, "/images/guides/", coverHashes);
    const adoptedImages = guide.sections.flatMap((section) => section.blocks).filter((block) => block.type === "image" && true);
    for (const [index, image] of adoptedImages.entries()) await validateImage(image, `${guide.id} task image ${index + 1}`, "/images/guides/");
    if (guide.routeMap) {
      for (const node of guide.routeMap.nodes) {
        const section = guide.sections.find(section=>section.id===node.sectionId);
        const image = section?.blocks.find(block=>block.type==='image');
        if (!mediaLedger.records.some(record=>record.status==='adopted'&&record.usedOn?.includes('/endings')&&record.localPath===image?.src)) errors.push(`${guide.id}: route image lacks matching provenance ${node.sectionId}`);
      }
      const characters = visibleBodyCharacters({content:guide.sections});
      if (characters<4000) errors.push(`${guide.id}: route tree body has only ${characters} non-whitespace characters`);
    }
    const brief = guideBriefs.records.find((record) => record.guide_id === guide.id);
    if (!brief || brief.screenshot_tasks.some((task) => !ledgerById.has(task.adopted_media_id))) errors.push(`${guide.id}: task images are not fully linked to the media ledger`);
  }
  if (mode === "publish" && guide.status === "published" && (!guide.summary || !guide.publishedAt || !guide.updatedAt || !guide.sections.length)) errors.push(`${guide.id}: incomplete published Guide`);
  if (mode === "publish" && guide.status === "published") {
    if (Array.from(guide.seo?.title ?? "").length < 40 || Array.from(guide.seo?.title ?? "").length > 60) errors.push(`${guide.id}: SEO title length`);
    if (Array.from(guide.seo?.description ?? "").length < 140 || Array.from(guide.seo?.description ?? "").length > 160) errors.push(`${guide.id}: SEO description length`);
  }
}
if (mode !== "development") {
  for (const record of mediaLedger.records.filter((item) => item.status === "adopted" && item.localPath && (mode !== "publish" || item.subjectGameId === main.id || item.kind === "site-design"))) {
    const file = resolvePublicImage(record.localPath, record.id, "/images/");
    if (!file) continue;
    const metadata = await sharp(file).metadata();
    if (metadata.width !== record.width || metadata.height !== record.height) errors.push(`${record.id}: ledger dimensions do not match the local file`);
    if (readFileSync(file).length !== record.fileBytes) errors.push(`${record.id}: ledger byte count does not match the local file`);
  }
}
if (mode !== "publish") for (const game of games) for (const id of game.relatedGameIds) if (!ids.has(id)) errors.push(`${game.id}: unknown related game ${id}`);
if (mode === "publish") {
  if (main.status !== "published") errors.push("main game is not published");
  if (guides.filter((guide) => guide.status === "published").length !== 3) errors.push("expected three published topic pages");
  for (const [key, value] of Object.entries(staticTdk)) {
    const titleLength = Array.from(value.title ?? "").length;
    const descriptionLength = Array.from(value.description ?? "").length;
    if (titleLength < 40 || titleLength > 60) errors.push(`static TDK ${key}: SEO title length`);
    if (descriptionLength < 140 || descriptionLength > 160) errors.push(`static TDK ${key}: SEO description length`);
  }
  const publishedPaths = [
    ...routeRegistry.staticRoutes.filter((route) => route.sitemap && route.kind !== "topic").map((route) => route.path),
    ...guides.filter((guide) => guide.status === "published").map((guide) => topicPath(guide.id)),
  ];
  if (publishedPaths.length !== routeRegistry.plannedPublicCanonicalCount) errors.push(`canonical registry produced ${publishedPaths.length} public routes, expected ${routeRegistry.plannedPublicCanonicalCount}`);
  if (new Set(publishedPaths).size !== publishedPaths.length) errors.push("canonical registry contains duplicate public paths");
  const seoTitles = Object.values(staticTdk).map((item) => item.title);
  if (new Set(seoTitles).size !== seoTitles.length) errors.push("published game or Guide SEO titles are not unique");
}
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(mode === 'publish' ? `Validated 1 public main game and ${guides.length} topic pages; archived games are not publication requirements.` : `Validated 1 main game, ${games.length} archived games, and ${guides.length} topics in ${mode} mode.`);
