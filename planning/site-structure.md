# Site Structure Plan

## Identity and audience

The locked site name and short name are both **Helping Your Boyfriend**. This preserves the supplied keyword and verified game title without implying that the site is official, a studio, or a company. Public copy is English for a global English-speaking audience.

## URL and navigation policy

- Canonical URLs do not use trailing slashes.
- Header, mobile menu, and Footer share one navigation source in this exact order: Home `/`, Guides `/guides`, More Games `/games`.
- No topic page is planned. Controls/minigames and endings are separate task Guides; promoting either as a fourth navigation section would duplicate the Guide system rather than satisfy an independent page need.
- The main game exists only at `/`. `/games/helping-your-boyfriend` and other aliases must not be generated.
- Additional games use `/games/[slug]`; Guides use `/guides/[slug]`.
- Five Legal pages use root routes: `/privacy`, `/terms`, `/copyright`, `/about`, and `/contact`.

## Public page inventory

| Page group | Routes | Responsibility |
| --- | --- | --- |
| Main game | `/` | Main player, six recommendations, complete independent article, current-game video, Featured and New side panels |
| Guides | `/guides` | JSON-driven list of the two published task Guides |
| Guide details | `/guides/helping-your-boyfriend-controls-minigames`, `/guides/helping-your-boyfriend-endings-walkthrough` | One control task and one explicitly spoiler-marked completion task |
| More Games | `/games` | All published additional games in a 6/4/2 grid |
| Game details | Nine `/games/[slug]` routes | Shared player shell with game-specific data, six recommendations, independent 4,000+ non-whitespace article, video, and two sidebar collections |
| Legal and trust | `/privacy`, `/terms`, `/copyright`, `/about`, `/contact` | Accurate capability, ownership, identity, usage, and contact statements |

The planned additional-game set is Going Live!, First Base, The stranger from the bus stop, Trapped with Jester, Today, I'm Harvesting You!, My Own Sweet Dionaea, OVERD0SE, Devour Me Gently, and Dystopia: The Jester's Obsession. Silver Thread : Episode I and My Vampire Boyfriend Smokes Lucky Strikes remain deferred because real input or visible runtime was not confirmed. Welcome, Dear Human is excluded because its current web runtime does not work within the secure embed boundary.

## Game page skeleton

Every game page uses the same data-driven skeleton but not the same prose:

1. Compact H1 and short start guidance.
2. Current game cover with a real, keyboard-focusable Play Now button.
3. A state bar with visually distinct Webpage Fullscreen and Browser Fullscreen SVG controls.
4. Six Recommended Games in the left content track.
5. A game-specific article of at least 4,000 visible non-whitespace characters, with no maximum and no iframe content counted.
6. One to three lazy `youtube-nocookie.com` embeds after the complete article.
7. Featured Games and New Games together in the right sidebar, six to eight cards each and two cards per row.

At desktop and 1024px the player, recommendations, article, and video retain one complete left-column width. The right sidebar shares the same parent grid, stays below the actual Header, and stops at the grid's bottom. If it is taller than the viewport, a height-aware bidirectional sticky controller must expose both ends without an internal scrollbar or ordinary-flow fallback. At 768px and below, sticky is disabled and the sequence becomes player, Recommended, article, video, Featured, New.

The desktop container is exactly 1400px maximum and fluid below that width. The only responsive width breakpoints are 1024px and 768px. More Games uses 6, 4, and 2 columns across those layouts. Guide cards use left-image/right-copy at wide and 1024px widths, then top-image/bottom-copy at 768px and below.

## Player behavior boundary

The main-game JSON keeps `test.com` byte-for-byte as supplied. Because it is not a safe absolute HTTPS address, Play Now enters a clear failure state and creates no iframe. Retry remains available, and a later valid replacement requires only the JSON value and affected CSP/runtime checks to change. Verified additional games create exactly one sandboxed official itch.io upload wrapper iframe after activation. Route changes unmount the old frame and clear timers, errors, and fullscreen state before displaying the new game's untouched cover state.

## Guide architecture

The controls/minigames Guide teaches concrete input modes, settings/save access, QTE recognition, drag acceptance, and recovery. It excludes route solutions. The endings Guide starts with a spoiler boundary and reusable checkpoint, then documents four verified routes and missed-ending recovery. It excludes all route details from cards, leads, TDK, cover/alt text, and unmarked video descriptions. Neither Guide displays an author because no identity has been supplied or verified.

## Media architecture

Every game owns one independent local cover, three explanatory screenshots with different jobs, and one required post-article video slot. Cover fit is decided per asset after checking its real aspect ratio, lettering safe area, and focal subject. No game can inherit another game's image or generic fallback. The main visual system must be derived from actual Helping Your Boyfriend imagery or an original non-figurative system; generic gaming-room, keyboard, controller, or neon stock imagery is prohibited.

## Content and spoiler boundaries

Each game article answers its own start state, controls, goals, feedback, progression or failure, first-run strategy, device/runtime issue, safety concern, and verified FAQ. Similar titles may link to one another, but paragraphs cannot be copied with names changed. Marked and full-spoiler material remains outside cards, leads, TDK, alt text, and unmarked video copy. The complete execution blueprint is in `planning/page-content-blueprints.json`.

## Data ownership

- `data/games/main-game.json` exclusively owns the main game.
- `data/games/games.json` exclusively owns additional games and every player/card/TDK/schema/sitemap field they expose.
- One file per Guide in `data/guides/` owns its list card, detail, TDK, schema, relations, and sitemap fields.
- `seo/tdk.js` owns static-page TDK and derives homepage values from main-game JSON.
- A single shared navigation configuration owns Header desktop, Header mobile, and Footer primary links.
- Sitemap state stores content fingerprints; only materially changed pages receive a changed date.

## Legal and capability boundary

The planned site has no account, contact form, comments, ratings, first-party analytics, first-party storage, first-party cookies, payments, uploads, subscriptions, or advertising. It does use click-created game iframes and deferred YouTube privacy-enhanced iframes. Contact is plain text `wyong@test.com`, without a form or `mailto:` link. No company, team, author, founding year, or jurisdiction will be invented.

