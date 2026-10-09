# Flow 10 — Production Acceptance

## Outcome

Status: **completed_with_warnings**. The portable Next.js standalone artifact passes production acceptance. No deployment, Git commit, or remote operation was performed. The one warning is the provisional main-game address `test.com`; it is rejected safely and does not create an iframe.

## Published set

- 19 canonical routes: homepage, More Games, Guides, five Legal pages, nine additional games, and two Guide details.
- Main game: `helping-your-boyfriend` at `/` only.
- Additional games: `going-live`, `first-base`, `the-stranger-from-the-bus-stop`, `trapped-with-jester`, `today-im-harvesting-you`, `my-own-sweet-dionaea`, `overdose`, `devour-me-gently`, `dystopia-the-jesters-obsession`.
- Guides: `helping-your-boyfriend-controls-minigames`, `helping-your-boyfriend-endings-walkthrough`.

## Commands and runtime

Publish, media, sitemap-state, type, lint, production build, 19-route runtime audit, 48 route/viewport checks, nine clean-context game launches, and six final-build Lighthouse runs passed. The complete lifecycle and measured counts are in `reports/command-results.json`. The final preview used port 3139 and the current Next.js 16.4.0 standalone build.

## Player acceptance

The homepage begins with zero game iframes. Play Now safely rejects the provisional main source, shows Retry, and never creates a dangerous frame. Every additional game begins with zero game iframes, creates exactly one matching itch wrapper after Play Now, reaches a recognizable game screen, and received mouse plus Enter input in a reset browser context. Sandbox values omit popup and top-navigation tokens. Detailed wrapper and inner-frame URLs, launch chains, input, sandbox, and evidence paths are in `reports/player-runtime-results.json`.

## Layout, accessibility, and visuals

Chrome measured exact 1464×900, 1024×900, and 768×900 CSS viewports. Wide containers are exactly 1400px; game tracks align within 1px; Featured and New remain two-column; More Games uses 6/4/2 columns; no tested route overflows horizontally. Game H1 sizes stay within 64/52/40px and inner-page H1 sizes within 48/40/34px. Mobile order is player → Recommended → article → continuation links → video → Featured → New. The mobile menu reports its state and closes with Escape.

Media evidence includes the five-context cover sheet, Guide cover sheet, 48 viewport screenshots, the nine-game live-frame contact sheet, and per-game before/after-input screenshots. Forty-two unadopted duplicate files were removed; all remaining public game/Guide images are adopted and validated.

## SEO, content, and legal

All 19 pages have unique 40–60 character titles, 140–160 character descriptions, canonical, Open Graph/Twitter data, JSON-LD, one H1, valid internal links, and the unified 1200×630 PNG social image. Sitemap has 19 unique entries and stable fingerprint-controlled dates. All ten game articles exceed 4,000 non-whitespace characters before video, with zero exact paragraph duplication. Both Guide pages are task-specific and complete. Five Legal root routes match declared site capabilities; Contact contains only the domain-derived plain-text email and no form.

## Lighthouse

| Mode | Performance runs | Median | Median LCP | CLS | Median TBT |
| --- | --- | ---: | ---: | ---: | ---: |
| Mobile | 99 / 99 / 99 | 99 | 2.031 s | 0 | 12.5 ms |
| Desktop | 100 / 99 / 100 | 100 | 0.526 s | 0 | 0 ms |

Accessibility, Best Practices, and SEO scored 100 in all six final-build runs.

## Issues fixed and retested

- Homepage canonical trailing-slash mismatch: fixed in `config/site.ts` and route registry; 19-route audit passed.
- Mobile continuation links appeared before the player: fixed flex order in `app/globals.css`; 48-view matrix passed.
- Inner-page H1 exceeded the 48/40/34px caps: added page-type sizing and automated thresholds; matrix passed.
- README Guide links used old slugs: corrected to both published routes.
- Forty-two unadopted duplicate public media files: removed through the ledger whitelist; media validation passed.
- Owned preview processes locked `.next/standalone`: verified and stopped before rebuild; subsequent production builds passed.

## Remaining action

Main-game playability is not verified. When a real absolute browser-build URL is available, replace only `data/games/main-game.json.player.iframeSrc` and rerun publish, sitemap update/validation, build, route audit, player runtime, viewport, and Lighthouse checks.
