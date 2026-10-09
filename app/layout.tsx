import type { Metadata } from "next";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { siteConfig } from "@/config/site";
import { staticTdk } from "@/seo/tdk.js";
import "./globals.css";
import "./scrapbook.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.origin),
  title: staticTdk.home.title,
  description: staticTdk.home.description,
  openGraph: { type: "website", siteName: siteConfig.name, images: [siteConfig.socialImage] },
  twitter: { card: "summary_large_image", images: [siteConfig.socialImage] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang={siteConfig.language}><body><a className="skip-link" href="#main-content">Skip to main content</a><SiteHeader />{children}<SiteFooter /></body></html>;
}
