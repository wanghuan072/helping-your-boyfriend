import manifest from "@/seo/url-manifest.json";
import { partitionSitemap, sitemapIndexXml } from "@/seo/sitemap-policy.js";

export const dynamic = "force-static";

export function GET() {
  if (partitionSitemap(manifest.entries.filter(entry => entry.indexable)).length <= 1) return new Response(null, { status: 404 });
  return new Response(sitemapIndexXml(manifest), { headers: { "Content-Type": "application/xml; charset=utf-8", "X-Robots-Tag": "noindex" } });
}
