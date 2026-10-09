# Flow 09 SEO report

Date: 2026-10-08

## Publication set

The batch contains 19 canonical, indexable routes: the homepage, More Games, Guides, five Legal pages, nine additional game details, and two Guide details. The main game exists only at `/`; `/games/helping-your-boyfriend` returns 404.

The main game, nine additional games, and two Guides changed from draft to published together. Their first-publication and current-content dates are `2026-10-08`. This means they are present in the deployable artifact; it does not claim that `test.com` currently serves this build.

## TDK and data ownership

- All 19 production pages have one unique title of 40–60 characters and one description of 140–160 characters.
- Homepage SEO is stored in `main-game.json` and exposed through `seo/tdk.js`.
- Static collection and Legal SEO values exist only in `seo/tdk.js`.
- Additional game detail SEO exists only in its Game JSON record.
- Guide detail SEO exists only in its Guide JSON record.
- Root title templating was removed so production `<title>` values are not silently lengthened.
- Open Graph and Twitter metadata use the page TDK, canonical URL, and `/images/og-image.png` at 1200×630.

## Canonical, structure, and links

- Every route returns 200 in the local standalone production preview and has one H1 and one `<main>`.
- Canonical, `og:url`, JSON-LD URLs, internal paths, and sitemap paths match.
- Game pages use VideoGame and BreadcrumbList semantics; the homepage also exposes WebSite identity.
- Collection pages expose CollectionPage and ItemList data.
- Guide details expose Article and BreadcrumbList data, dates, and no invented author or publisher.
- Legal routes expose WebPage and BreadcrumbList data.
- No public `<a>` points to a third-party site. Footer Legal links all include the exact `noopener noreferrer nofollow` value. Game and YouTube frames remain the defined third-party-frame exceptions.

## Sitemap and robots

- `sitemap.xml` contains 19 unique canonical URLs and no duplicate homepage, draft, preview, `/legal/...`, or main-game detail route.
- Static last-modified values come from `seo/page-lastmod.json`; Game and Guide dates come from their JSON records.
- `scripts/sitemap-state.mjs` calculates content and local-media fingerprints, updates only changed records in explicit update mode, and makes production builds fail on stale state.
- Two consecutive validation runs produced the same date state.
- `robots.txt` allows public crawling and declares `https://test.com/sitemap.xml`; internal workflow directories are outside `public` and are not web routes.

## Runtime audit

`reports/seo-runtime-audit.json` records all 19 pages, TDK lengths, H1 count, canonical, Open Graph URL, JSON-LD types, public anchors, iframes, Legal rel values, sitemap membership, and the duplicate-main 404. Result: pass with zero failures.

## Main player boundary

The main player's configured value remains exactly `test.com`. It is provisional and is not claimed as a verified game. The current player safely refuses to create a dangerous iframe and presents a retryable unavailable state. All nine additional games retain their verified official itch wrappers.
