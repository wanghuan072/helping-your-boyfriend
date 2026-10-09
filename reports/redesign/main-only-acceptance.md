# Main-keyword redesign acceptance

Historical revision: superseded by direct-topics-acceptance.md for navigation, page count, visual design and topic content.

Checked 2026-10-08 against the standalone production build at http://127.0.0.1:3140.

## Current scope

Homepage plus three main-game Guides: controls/minigames, characters/relationships, and endings. The latest user request supersedes the earlier additional-game expansion and homepage collection requirements. Existing additional-game files and routes are retained; no additional runtime acceptance is claimed in this scope.

The homepage has no additional-game detail links or Featured/New/Recommended collections. Shared Home, Guides and More Games navigation is preserved. The sidebar now contains Guide entrances and article anchors; mobile Guide entrances follow the player. Each Guide has its own JSON source shared by rendering, cards, metadata and sitemap generation.

## Verification

- `npm run build`: passed, including publish-data and sitemap-state checks.
- `npm run lint`: passed without warnings.
- `npm run typecheck`: passed.
- `npm run test:content`: passed; closed block contracts, negative fixtures, visible-body minimums and stable existing collection selectors.
- `node scripts/audit-production.mjs http://127.0.0.1:3140`: 20 public pages, 20 unique sitemap URLs, three expected 404s, robots and production CSP passed. Includes a new assertion preventing additional-game detail promotion from Home.
- `node scripts/audit-seo.mjs http://127.0.0.1:3140`: 20 routes, zero failures.
- Actual browser clicks from Home to Characters, Characters to Endings, and Endings to Controls passed. A Document request confirmed full page navigation; browser Back returned to Home.
- Character spoiler sections start closed. Enter opens and closes Ian independently of Oliver. Ending 2 also opens and closes with Enter.
- Home tested at 1464, 1024, 768, 600 and 390 pixels. Two columns remain at 1024; single-column flow starts at 768. No horizontal overflow. Fullscreen controls are 44 by 44 pixels.
- Three Guide pages checked at 390 pixels without overflow; Controls also checked at 1024. Corrected the mobile cover width found during visual QA.

## Data and editorial boundaries

Inclusive “we” guides the player through reading, choices, saves and replay. It is not a fabricated claim that the writer personally completed the configured build. Opening facts, controls and credits were checked on the creator page. Route directions were cross-checked with public walkthroughs and creator-hosted player comments; exact affection thresholds remain unestablished. Added omitted scalpel and phone-call actions; the four endings have not been replayed in the configured main player.

The single main iframeSrc remains exactly `test.com`. Play Now displays the explicit unavailable message and creates zero game iframes. No other game is substituted. Production CSP excludes unsafe-eval; the Next development policy includes it for development debugging. The pre-existing development server is left untouched; use the standalone preview above to inspect the final build.

## Visual evidence

- main-home-desktop.png
- main-home-1024.png
- main-home-768.png
- main-home-600.png
- main-home-390.png
- characters-mobile.png

No deployment, Git commit or remote write was performed.
