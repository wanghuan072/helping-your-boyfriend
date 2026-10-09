import type { MetadataRoute } from "next";
import pageState from "@/seo/page-lastmod.json";
import { absoluteUrl } from "@/config/site";
import { getMainGame } from "@/lib/content/load-games";
import { getAllPublishedGuides } from "@/lib/content/load-guides";
import { topicPath } from "@/lib/content/topic-routes";
import registry from "@/planning/route-registry.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const main = getMainGame();
  const entries = [
    ...(main ? [{ path: "/", date: main.updatedAt }] : []),
    ...Object.entries(pageState).map(([path, state]) => ({ path, date: state.lastModified })),
    ...getAllPublishedGuides().map((guide) => ({ path: topicPath(guide.id), date: guide.updatedAt })),
  ];
  const unique = new Map(entries.map((entry) => [entry.path, entry]));
  if (unique.size !== entries.length) throw new Error("Duplicate canonical path in sitemap input");
  return registry.staticRoutes.filter(route => route.sitemap).map(route => {
    const entry = unique.get(route.path);
    if (!entry?.date) throw new Error(`Missing page revision date for ${route.path}`);
    return {
      url: absoluteUrl(route.path),
      lastModified: entry.date,
      changeFrequency: route.changeFrequency as MetadataRoute.Sitemap[number]["changeFrequency"],
      priority: route.priority,
    };
  });
}
