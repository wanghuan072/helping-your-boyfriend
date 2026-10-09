import controls from "@/data/guides/helping-your-boyfriend-controls-minigames.json";
import endings from "@/data/guides/helping-your-boyfriend-endings-walkthrough.json";
import characters from "@/data/guides/helping-your-boyfriend-characters.json";
import type { Guide } from "./types";
import { getPageTdk } from "@/seo/tdk.js";
import { topicPath } from "./topic-routes";

const guides = [controls, characters, endings].map(guide => ({ ...guide, seo: getPageTdk(topicPath(guide.id)) })) as Guide[];

export function getAllGuides() { return guides; }
export function getAllPublishedGuides() { return guides.filter((guide) => guide.status === "published"); }
export function getGuideBySlug(slug: string, includeDraft = false) {
  return guides.find((guide) => guide.slug === slug && (includeDraft || guide.status === "published")) ?? null;
}
export function getGuideRouteParams() { return getAllPublishedGuides().map(({ slug }) => ({ slug })); }
