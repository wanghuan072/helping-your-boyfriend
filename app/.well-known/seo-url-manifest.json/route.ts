import manifest from "@/seo/url-manifest.json";

export const dynamic = "force-static";

export function GET() {
  return Response.json(manifest, {
    headers: { "Cache-Control": "public, max-age=0, must-revalidate", "X-Robots-Tag": "noindex" },
  });
}
