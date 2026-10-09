import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";
import { getPageTdk } from "@/seo/tdk.js";

export function pageMetadata(title: string, description: string, path: string, type: "website" | "article" = "website", keywords?: string[]): Metadata {
  const canonical = absoluteUrl(path);
  const image = { url: absoluteUrl(siteConfig.socialImage), width: 1200, height: 630, type: "image/png", alt: `${siteConfig.name} player guide` };
  return {
    // All URLs below are absolute. Preserve the root URL's slash instead of
    // letting metadataBase normalize it back to a bare origin.
    ...(path === "/" ? { metadataBase: null } : {}),
    title: { absolute: title },
    description,
    keywords: keywords ?? getPageTdk(path).keywords,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: siteConfig.name, type, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [absoluteUrl(siteConfig.socialImage)] },
  };
}
