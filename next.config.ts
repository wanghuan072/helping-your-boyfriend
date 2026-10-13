import type { NextConfig } from "next";

import mainGame from "./data/games/main-game.json";
import manifest from "./seo/url-manifest.json";
import { sitemapRewrites } from "./seo/sitemap-policy.js";

const publishedFrameOrigins = Array.from(
  new Set(
    [mainGame]
      .filter((game) => game.status === "published")
      .map((game) => {
        try {
          return new URL(game.player.iframeSrc).origin;
        } catch {
          return null;
        }
      })
      .filter((origin): origin is string => Boolean(origin)),
  ),
);

const frameSources = ["'self'", "https://www.youtube-nocookie.com", ...publishedFrameOrigins];
const developmentScriptSource = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  `frame-src ${frameSources.join(" ")}`,
  "img-src 'self' data: blob: https://*.google-analytics.com https://www.googletagmanager.com",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${developmentScriptSource}`,
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  output: "standalone",
  images: { unoptimized: true },
  async rewrites() { return sitemapRewrites(manifest); },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // 宽松资源策略只用于隔离的广告文档；主站 CSP 不扩大。
        source: "/ad-frame/:file",
        headers: [
          { key: "Content-Security-Policy", value: "default-src https:; script-src https: 'unsafe-inline'; style-src 'unsafe-inline'; img-src https: data:; frame-src https:; connect-src https:; base-uri 'none'; object-src 'none'; frame-ancestors 'self'" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
  experimental: {
    agentFeedback: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
