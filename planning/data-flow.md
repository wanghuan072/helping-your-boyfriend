# Flow 05 Data Flow

## Build-time content pipeline

```text
main-game.json ─┐
games.json ─────┼─> schema validation ─> publishability gates ─> typed loaders
guides.json ────┘                                      │
                                                       ├─> pages and cards
seo/tdk.js ────────────────────────────────────────────┼─> metadata and JSON-LD
navigation.ts ─────────────────────────────────────────┼─> Header/mobile/Footer
page-lastmod.json <─ visible-content fingerprint ──────┴─> sitemap.xml
```

The build reads local data only. Schema validation checks stable IDs, unique slugs, exact game identity, route ownership, required media, iframe policy, relation integrity, collection counts, SEO lengths, article character minimums, videos, dates, and spoiler fields. The publication gate is strict: a broken record stops production output rather than borrowing another record.

## Game route flow

1. `/` calls `getMainGame()` and renders the single configured main game.
2. `/games/[slug]` obtains its slug from awaited Next.js 16 route params, calls `getPublishedGameBySlug(slug)`, and returns `notFound()` if absent.
3. `generateStaticParams()` returns only published additional-game slugs and `dynamicParams = false` blocks unknown paths.
4. The same validated object feeds H1, cover, Player, article, screenshots, videos, TDK, canonical, JSON-LD, related cards, and sitemap data.
5. Collection helpers read flags and relation IDs; they exclude the current ID, keep groups unique, and fail when Featured/New/Recommended counts violate policy.

## Guide route flow

1. `/guides` reads the published Guide array.
2. `/guides/[slug]` and `generateMetadata()` resolve the same Guide by stable slug.
3. A Guide's JSON owns its card copy, exact cover, breadcrumb label, H1, intro, date fields, optional verified author, tags, article sections, FAQ, SEO, schema facts, related Guide IDs, and spoiler policy.
4. The article and page table of contents derive from the same section IDs. Unknown or unpublished slugs 404.

## Player state flow

```text
idle cover + Play Now
  ├─ unsafe/invalid current URL -> failed (no iframe) -> retry
  └─ accepted URL -> loading (one iframe + timeout)
                      ├─ load -> playing
                      └─ timeout/error -> failed -> retry
```

The first main-game value stays exactly `test.com`, is classified `provisional/not_embeddable`, and therefore follows the safe failure branch. Published additional games must use their own verified HTTPS wrapper. Browser fullscreen targets the active iframe container; Webpage Fullscreen expands the player within the document. Their SVG paths are visibly different. On navigation or unmount, the iframe node, timer, document fullscreen state, and error state are cleared.

## Navigation and page lifecycle

The shared navigation and all content-card destinations are ordinary canonical `<a href>` links. Each content-page transition makes a full document request, naturally destroying any prior player. E2E tests verify URL, history, current title/canonical, cover identity, fresh idle state, and the absence of the old iframe and timers.

## Media flow

Adopted media is copied only into the current project's `public/images` tree after evidence and rights review. Game and Guide JSON holds local paths, intrinsic dimensions, alt text, purpose, ratio treatment, and adoption status. Covers use `contain` where text or a key subject would be clipped; `cover` is allowed only after card-context visual checks. Three unique gameplay screenshots must support three different article tasks. Video data contains one to three verified IDs and version/task descriptions; the public component renders lazy `youtube-nocookie.com` iframes after the article without autoplay or a click-to-create layer.

## SEO and freshness flow

Static TDK comes from `seo/tdk.js`; its homepage export reads `main-game.json`. Game-detail and Guide-detail metadata comes only from the owning JSON. All pages use `https://test.com` canonicals and `/images/og-image.png` for Open Graph and Twitter.

For each canonical route, `fingerprints.ts` hashes visible fields and actual recommendation IDs. `seo/page-lastmod.json` stores the previous fingerprint and last-modified date. A build-time updater keeps the old date when the fingerprint is unchanged and writes the build date only for a new route or materially changed visible content. `app/sitemap.ts` consumes that registry. The homepage appears once at `/`; the main-game slug never creates a second route.

## Legal capability flow

`planning/site-capabilities.json` is the factual input for Legal copy. Current planned capabilities are game and YouTube iframes only. Legal text must not claim accounts, analytics, comments, ads, forms, payments, uploads, subscriptions, or first-party cookie/storage behavior that is not enabled. The contact address is plain text and derived from the configured domain.

## CSP flow

The build extracts unique, validated origins from published game iframe URLs and the YouTube privacy-enhanced embed origin. Production response headers permit only those frame origins and the site's own scripts/styles/images. Local development may receive an isolated framework-required policy, but production never gains `'unsafe-eval'`. CSP and runtime reports compare every actual frame URL and final origin against this generated allowlist.
