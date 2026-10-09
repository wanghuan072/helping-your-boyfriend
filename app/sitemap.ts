import type { MetadataRoute } from "next";
import manifest from "@/seo/url-manifest.json";
import { partitionSitemap } from "@/seo/sitemap-policy.js";

export default function sitemap(): MetadataRoute.Sitemap {
  // Above the protocol limit, the framework rewrite serves the Sitemap Index;
  // its children are native Metadata Routes generated from these same partitions.
  return (partitionSitemap(manifest.entries.filter(entry => entry.indexable))[0] ?? []).map(entry => ({
    url: entry.canonicalUrl,
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: entry.priority,
  }));
}
