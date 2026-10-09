# Direct topics and editorial redesign — 2026-10-08

This revision supersedes the previous main-only report's Guides hierarchy.

## Delivered

- Primary navigation: Home, Endings, Characters, Controls, More Games. One shared topic registry supplies paths to desktop/mobile navigation, article links, SEO and sitemap consumers.
- Direct canonical pages: /endings, /characters and /controls.
- Removed the two /guides page implementations. Their content remains in independent JSON files. /guides returns 308 to Home; the three former detail addresses return 308 to their corresponding topic. Removed all former Guide canonicals from the sitemap.
- Homepage: actual-game artwork hero, pink/deep-plum visual contrast, three topic entrances, compact unavailable-player state and two-column game/article structure. No additional-game detail recommendations.
- Rewritten Home and Characters around specific scenes, roles and player actions. Added visible doll-tool/slot/counter explanation to Controls. Improved paragraph separation and shortened topic H1s.
- Homepage visible body: 7,593 non-whitespace characters. All body, game facts and media remain sourced from the main Game JSON. Each topic retains a single independent content JSON.

## Final verification

Final standalone build: http://127.0.0.1:3140. The server was stopped before rebuilding and restarted against the final build. The original development process was not stopped.

- Production build, publish-data validation, sitemap validation, lint, TypeScript and content contract tests passed.
- Production page/SEO audits: 19 public routes and 19 unique sitemap URLs, zero SEO failures; three expected 404s, robots, security headers and four permanent redirects passed.
- Desktop primary navigation: Characters to Endings caused an observed Document request to /endings; Back restored /characters. Home returned to /.
- Mobile menu: Home, Endings, Characters, Controls, More Games; no Guides item. Characters click caused an observed Document request to /characters; the new document reset the menu to closed.
- Mobile continuation: Characters to Controls to Endings navigated to the direct paths.
- Endings route disclosures and Ian character disclosure opened/closed using Enter; Oliver remained independently closed.
- Home at 1024px retained 625px/312px columns inside a 961px container. At 768px and 390px it used single-column flow. No horizontal overflow.
- All three topic pages at 390px had document width 375px, within the 390px viewport.
- Play Now on the provisional main source displayed the explicit unavailable message and created zero game iframes.

Main game gameplay and all four endings were not personally replayed: the configured address remains exactly test.com. Published prose does not claim a fabricated first-person completion. Existing additional-game runtime records are outside this revision; no new additional-game runtime pass is asserted.

Evidence: direct-topics-home-desktop.png, direct-topics-home-mobile.png and direct-topics-characters-desktop.png in this directory.

No deployment, commit or remote write.
