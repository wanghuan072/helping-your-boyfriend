import type { MetadataRoute } from "next";
import manifest from "@/seo/url-manifest.json";
import { partitionSitemap } from "@/seo/sitemap-policy.js";

const chunks = partitionSitemap(manifest.entries.filter(entry => entry.indexable));

export function generateSitemaps() {
  return chunks.length > 1 ? chunks.map((_, id) => ({ id })) : [];
}

export default async function sitemap({ id }: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const shard = chunks[Number(await id)] ?? [];
  return shard.map(entry => ({ url: entry.canonicalUrl, lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency as MetadataRoute.Sitemap[number]["changeFrequency"], priority: entry.priority }));
}
