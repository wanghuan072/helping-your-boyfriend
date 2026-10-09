# Flow 05 Code Structure

## Locked architecture

The project keeps its existing Next.js 16.4.0 App Router root and strict TypeScript setup. There is no `src/` migration and no Pages Router. Public pages are Server Components by default; the menu, player, fullscreen controls, sticky-sidebar boundary helper, and any disclosure widgets are the smallest possible Client Components.

Production uses `output: "standalone"`. This keeps framework features and response headers available while producing a portable `.next/standalone` runtime. Published detail routes are prerendered from validated JSON with `generateStaticParams`; `dynamicParams = false` makes unknown content slugs fail closed.

## Files to create or modify in flow 06

```text
app/
  layout.tsx                         shared document shell and site metadata
  page.tsx                           main game route only
  globals.css                        tokens and all 1400/1024/768 layout rules
  games/page.tsx                    published additional-game index
  games/[slug]/page.tsx             published additional-game detail route
  guides/page.tsx                   published Guide index
  guides/[slug]/page.tsx            published Guide detail route
  privacy/page.tsx
  terms/page.tsx
  copyright/page.tsx
  about/page.tsx
  contact/page.tsx
  sitemap.ts                         canonical registry plus content fingerprints
  robots.ts
components/
  chrome/SiteHeader.tsx
  chrome/MobileMenu.tsx
  chrome/SiteFooter.tsx
  game/GamePage.tsx                 shared home/detail skeleton
  game/GamePlayer.tsx               click-to-create client iframe state machine
  game/FullscreenControls.tsx
  game/GameCard.tsx
  game/GameCollections.tsx
  game/GameSidebar.tsx
  game/GameArticle.tsx
  game/GameVideos.tsx
  guide/GuideCard.tsx
  guide/GuideArticle.tsx
  guide/GuideToc.tsx
  seo/JsonLd.tsx
config/
  navigation.ts                     one Header/mobile/Footer navigation source
  site.ts                           origin, language, social image, contact address
data/games/
  main-game.json                    exactly one main-game object
  games.json                        additional-game objects only
data/guides/
  guides.json                       Guide list/detail/SEO/schema/recommendation source
legal/
  privacy.ts
  terms.ts
  copyright.ts
  about.ts
  contact.ts
lib/
  content/game-schema.ts
  content/guide-schema.ts
  content/load-games.ts
  content/load-guides.ts
  content/collections.ts
  content/fingerprints.ts
  player/frame-policy.ts
  seo/metadata.ts
  seo/schema.ts
  seo/sitemap.ts
seo/
  tdk.js                            static pages; home reads main-game JSON
  page-lastmod.json                 stable per-canonical dates and fingerprints
public/images/
  logo.png
  og-image.png
  games/<game-id>/cover.*
  games/<game-id>/<task-shot>.*
  guides/<guide-id>/cover.*
scripts/
  validate-data.mjs
  validate-media.mjs
  validate-seo.mjs
  validate-content.mjs
  validate-research.mjs
tests/
  unit/
  e2e/
  fixtures/                         private draft-preview fixtures; never a public route
reports/
  command-results.json
  player-runtime-results.json
  acceptance-manifest.json
```

## Existing files preserved

- `app/favicon.ico` remains unless a verified replacement is deliberately created.
- `tsconfig.json` keeps strict mode, bundled module resolution, and the `@/*` alias.
- `AGENTS.md` remains the local operating contract.
- Research, planning, and handoff records remain internal and are never imported by public components.
- Existing starter files are modified in place rather than creating parallel layouts or duplicate styling systems.

## Component boundaries

`GamePage` owns the exact visual order: player, six Recommended cards, independent article, video area, with Featured and New in the bounded right column. The same component receives either the main game or one additional game; it never substitutes data when a required field is absent.

`GamePlayer` alone owns browser state. It begins with a focusable Play Now control over the current cover. It creates at most one iframe only after activation and only when `frame-policy` accepts the configured URL. Unsafe or malformed values enter a visible failure state without DOM frame creation. Route changes unmount the component and clear the iframe, timers, fullscreen state, and errors.

`GameSidebar` uses a page-level sticky boundary rather than its own scroll container. Its top offset is derived from the actual sticky Header custom property. At 768px and below the same collections render in the required single-column sequence and sticky behavior is disabled.

All page-to-page links use ordinary anchors so navigation performs a full document request, while menu disclosure, accordion, player state, and fullscreen are local interactions.

## Data boundaries and publication gates

- Main game: exactly one object in `main-game.json`, rendered only at `/`.
- Additional games: only `status: "published"` records in `games.json` may generate routes or collections.
- Guides: only `status: "published"` records in `guides.json` may generate routes, cards, metadata, schema, recommendations, or sitemap entries.
- Each object must own its ID, slug, title, description, player, media, article, SEO, video, dates, and related IDs.
- Missing or invalid required content is a build error. It never falls back to the main game, another game, a generic image, or placeholder text.
- Public HTML never imports `research/`, `planning/`, `reports/`, or `handoff/`.

## Draft preview boundary

Draft verification is performed through test fixtures and component/browser test harnesses under `tests/`, not through an App Router URL. This gives the workflow a non-public preview path while ensuring the production route manifest has no draft-preview route. Validation commands load draft fixtures explicitly and publication validators reject draft records from public collections.

## Security and third-party boundaries

The production CSP is assembled from the published Game JSON origins plus `youtube-nocookie.com`; development-only script concessions are applied only in local development. It never includes `'unsafe-eval'` in production. Frame permissions, sandbox tokens, referrer policy, and timeout come from the current game object after validation. No ads, forms, accounts, uploads, first-party cookies, analytics, or local storage are introduced.
