# Flow 05 Test Plan

## Test layers

### Data and publication gates

- Parse every JSON source and validate it against the local schema.
- Enforce one main game, at least eight published additional games, at least two published Guides, unique IDs/slugs, and no duplicate main-game route.
- Require each published game to own a title, slug, short description, accurate cover, three distinct task screenshots, player config, 4,000+ non-whitespace visible article characters, SEO fields, one to three verified videos, dates, spoiler policy, and six valid relations.
- Require Featured and New to contain 6–8 unique published games and homepage Recommended to contain exactly six.
- Require each published Guide to own its card/detail cover, player task, outcome, sections, FAQ, SEO, dates, tags, spoiler policy, and relation data.
- Reject missing content instead of allowing fallbacks.

### Unit tests

- Game/Guide schema acceptance and all required rejection cases.
- Published loaders, slug lookup, unknown slug, collection exclusion, uniqueness, ordering, and related-ID integrity.
- Iframe URL classification including exact provisional `test.com`, HTTPS itch wrappers, malformed URLs, duplicate frame prevention, timeout, retry, and unmount cleanup.
- Metadata title/description length, canonical construction, shared social image, and schema-content parity.
- Sitemap canonical uniqueness, 19 planned routes, homepage-only main game, recommendation-aware fingerprints, and stable last-modified behavior.
- Navigation source parity across desktop, mobile, and Footer.

### Browser and lifecycle tests

- Run public routes in development and from the exact production build identity.
- At 1440, 1024, and 768/375 widths, verify only the 1024 and 768 layout transitions, no horizontal overflow, readable focus states, and tap targets.
- Verify the 1400px maximum container, game two-column layout through 1024, 768 single-column order, 6/4/2 More Games grid, Guide card direction, and Guide TOC behavior.
- Verify player starts idle with visible focused Play Now over the correct cover.
- Main game: activation rejects unsafe `test.com`, creates zero iframe, shows a clear failure and retry path.
- Each published additional game: activation creates exactly one iframe with its exact configured source; verify real visual identity and at least one meaningful input.
- Verify visibly distinct Webpage Fullscreen and Browser Fullscreen SVG paths and behavior.
- Navigate from an active game to another via a real full-document link; verify old iframe/timer/fullscreen/error state disappears and the next route has matching URL, history, title, canonical, cover, copy, and idle player.
- Verify Featured, New, and Recommended groups exclude current game, contain no within-group duplicate, and use accurate covers.
- Verify video iframes are after independent article content, lazy, no autoplay, use `youtube-nocookie.com`, and are directly present without a click-gate.
- Verify CSP produces no production refusal for approved game/video origins and no critical JS/CSS/API failure, framework overlay, uncaught exception, or hydration mismatch.

### Content, SEO, accessibility, and privacy audits

- Machine-count non-whitespace visible article characters per game, excluding navigation, cards, media captions, and JSON-LD.
- Compare each game identity across JSON, route, H1, cover, player, screenshots, article, video, title, canonical, schema, recommendations, and sitemap.
- Validate 40–60 character titles and 140–160 character descriptions.
- Validate exactly one natural H1, headings in order, meaningful alt text, spoiler exclusions, player-first copy, and banned internal/report language absent from public HTML.
- Validate structured data against rendered claims and reject invented author/company/jurisdiction fields.
- Confirm no ads, comments, ratings, analytics, uploads, forms, subscriptions, or first-party storage/cookies are introduced.
- Verify keyboard use for menus, player, disclosures, cards, fullscreen controls, and Guide TOC; visible focus and reduced-motion behavior.

### Performance

- Build and start a fresh production instance with recorded PID, port, readiness, build identity, and logs.
- Run Lighthouse Mobile and Desktop three times under identical local conditions; record each run and median.
- Delivery target: both medians at least 90 Performance. Also record LCP, CLS, TBT/INP proxy, first-load transfer, critical image sizing, prefetch behavior, compression, and cache headers.
- Fix project-owned regressions. Third-party or environment limitations remain explicit risks and cannot be represented as passing.

## Planned commands

```text
npm run format:check
npm run lint
npm run typecheck
npm run validate:data
npm run validate:media
npm run validate:research
npm run validate:content
npm run validate:seo
npm run test
npm run build
npm run start
npm run test:e2e
npm run audit:render
npm run audit:responsive
npm run audit:lighthouse
```

Each command is recorded in `reports/command-results.json` with command class, timestamps, exit code, measured test count, build identity, and log path. Long-lived servers additionally record PID, port, readiness, and stop method. Runtime evidence is recorded per game in `reports/player-runtime-results.json`. Requirement-level results and evidence paths are recorded in `reports/acceptance-manifest.json`.

## Completion blockers

Stage 10 cannot pass if any published additional game lacks real visual/input verification, any game lacks the media or independent-content minimum, the main game lacks a qualified embedded video, a required route has runtime errors, production CSP contains `'unsafe-eval'`, a canonical is duplicated, a draft route is public, or either Lighthouse median is below 90 due to project-owned code/media.
