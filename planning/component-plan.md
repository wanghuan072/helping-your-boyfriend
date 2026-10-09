# Component and State Plan

## Shared shell

`SiteHeader` reads one navigation array for desktop and hamburger views. It renders a real 216×48 local `/images/logo.png`, a skip link, current-route state, and a 44×44 menu button at 1024px and below. Escape, selection, and the toggle close the menu; focus returns to the toggle when appropriate. `SiteFooter` reads the same primary navigation plus the fixed Legal group and the derived copyright year/name.

The prescription-tab signature appears as the active Header tab, the player-state label, the left edge of article section headings/callouts, and the Footer brand rule. It is structural: the tab indicates current context or status and is never scattered as meaningless decoration.

## GameDetailShell

The shell receives one complete Game object. Missing title, cover, player data, article, related IDs, or SEO blocks publication. It owns a 1400px parent grid with a left content track and a right `DiscoverySidebar`. The left track contains H1/lead, `GamePlayer`, `RecommendedGames`, `GameArticle`, and `GameVideoSection` in that order. No nested prose width is allowed.

### GamePlayer states

| State | Visual and message | Available actions |
| --- | --- | --- |
| unconfigured | Cover remains visible under an ink wash; gold tab says “Player unavailable”; plain copy says this version is not ready | Back to More Games; no iframe |
| ready | Accurate cover fully visible in its fit strategy; centered rose `Play Now` button with play SVG and visible focus | Play Now |
| loading | Reserved 16:9 frame; subtle opacity pulse and `Loading [title]…` live status | Cancel/back; fullscreen disabled |
| loaded | Exactly one iframe; compact dark status bar names the current game | Webpage Fullscreen, Browser Fullscreen |
| timeout | Cover returns behind a translucent layer; “The game is taking longer than expected” | Retry, return |
| failure | Gold/danger prescription tab, player-language error, no implementation jargon | Retry; More Games |
| webpage fullscreen | Player expands within the page layer; body scroll is managed and restored | Distinct panel-collapse icon and label |
| browser fullscreen | Native fullscreen request; four-corner icon becomes four inward corners | Exit Browser Fullscreen |
| fullscreen failure | Player stays loaded; inline live status explains browser refusal | Retry button for the requested mode |

The Webpage Fullscreen SVG is a rectangular page outline with two diagonal outward arrows inside. Browser Fullscreen is four separated outer corner brackets. They use different path data, not shared geometry. Both have 20px icons inside 44px targets, tooltips, accessible names, and pressed state in addition to color.

The state machine cancels timers and iframe listeners during navigation. Before the next route paints, it exits either fullscreen mode, removes the old iframe, clears error/loading state, and returns the new game's player to its untouched cover and Play Now state.

## Discovery components

- `RecommendedGames`: exactly six game links, three columns on wide screens and two at 1024px and below. Cards use a 4:3 media canvas, own-image fit metadata, title, and one short mechanic label.
- `DiscoverySidebar`: Featured Games and New Games are separate headings and grids. Each grid has six to eight unique items, always two columns. It does not render descriptions, ratings, comments, ads, or a scrollbar.
- `GameCard`: receives one Game ID and resolves image/title/slug from the same object. Its entire link surface remains semantic, keyboard reachable, and at least 44px high. Hover changes border/shadow only.
- `MoreGamesGrid`: the same game cards at higher density, 6/4/2 columns. Short descriptions are line-clamped to two lines and never determine media height.

## Height-aware sidebar

Normal-height sidebar uses native `position: sticky` with `top: calc(var(--header-height) + var(--space-4))` and `align-self: start`. The containing game grid establishes the bottom boundary. For a rail taller than the available viewport, a small client controller observes header, rail, grid, viewport, and scroll direction; it switches only between top and bottom sticky constraints so downward scrolling reaches the final card and upward scrolling returns to the first. It never applies permanent fixed positioning, creates an inner scrollbar, crosses the parent bottom, or overlaps Header/Footer.

## Game-specific composition matrix

| Game | First-screen lead job | Article rhythm and useful components | Three screenshot jobs | Video job | Never reuse |
| --- | --- | --- | --- | --- | --- |
| Helping Your Boyfriend | State that this is a cute-turned-creepy visual novel, the current page owns its player, and mouse/keyboard inputs matter | Start/safety callout → control matrix → minigame steps → four-ending replay note → warning panel → device FAQ | bell/dialogue UI; accepted drag; QTE prompt/result | Confirm all five task types and visible completion states | Another game's caretaker copy, doctor imagery, or provisional-player claim |
| Going Live! | Identify a canceled fan-management prototype | Scope badge → action/feedback pairs → replay checklist → warnings → browser recovery | warning choice; fan dashboard; non-graphic consequence | Show a fan action changing narrative feedback | Current-development language or generic streamer stock art |
| First Base | Identify version 1.6, customization, and survival stakes | setup steps → choice comparison → save/replay strategy → 17+ warning → device FAQ | start/title; name/customization; consequence choice | Separate older footage from 1.6-stable actions | Main-game minigame language or unmarked death routes |
| The stranger from the bus stop | Set a 15–20 minute, four-ending encounter | time/scope strip → choice chain → clue callout → mobile text recovery → replay FAQ | bus-stop setting; high-impact choice; clue context | Demonstrate clue presentation and response without using video as the solution | Number answer in unmarked text or metadata |
| Trapped with Jester | Set a fully voiced compact carriage encounter | audio start → dialogue decision pair → six-outcome replay map → browser audio/stutter FAQ | opening card; carriage exchange; non-reveal choice | Show voice start, choice, and immediate response | Identity or ending-name imagery |
| Today, I'm Harvesting You! | Explain pointer dialogue and active harvest interaction | input steps → safe interface anatomy → bug/recovery sequence → role/choice warning → FAQ | opening text; safe choice; pre-result harvest UI | Show item selection, placement, and visible acceptance | Graphic result images or victim-framed copy |
| My Own Sweet Dionaea | Define demo 1.01 and care-versus-risk tension | demo facts → input → workplace/care comparison → 17+ warning → current/planned boundary | menu; laboratory context; care-risk choice | Show immediate choice feedback within 1.01 | Planned full-game claims or suggestive thumbnails |
| OVERD0SE | Identify the current build and four interacting state systems | customization steps → system table → state-change case → multi-day/failure diagnosis → strong safety panel | customization; anxiety/awareness; inventory/affinity | Show a complete state-before/action/state-after process with version note | Graphic self-harm or old-build route assertions |
| Devour Me Gently | Identify a short injury/confinement demo and name entry | setup steps → caretaker-signal comparison → boundary advice → short replay → device FAQ | name prompt; caretaker scene; response feedback | Show name submission and one early decision response | Romanticized coercion or invented touch support |
| Dystopia: The Jester's Obsession | Identify demo v1 and affection/hidden points | startup/name → point-system explanation → early choice case → four-ending replay → current/planned table | name prompt; first encounter; point-affecting choice | Show choice, dialogue unlock, and route transition | Optional future NSFW features as current content |

## Guides

`GuideList` uses two horizontal cards with a 320×200 task cover and right-side title, summary, tags, dates, and action. At 768px it stacks media above copy. Cards share data with details and do not duplicate a list model.

`GuideDetail` orders breadcrumb, H1, lead, optional author, dates, tags, cover, then body. Both planned Guides exceed the TOC usefulness threshold because they have six or more task sections; their desktop and 1024px TOC is sticky beneath the real Header and bounded by the article. A TOC taller than the viewport may scroll inside its available height; at 768px it returns to flow before the article. No author slot renders while `authorId` is null.

## Content components

Paragraphs remain full left-track width on game pages. Structured components include `ControlTable`, `Steps`, `ChoiceComparison`, `VersionBoundary`, `WarningCallout`, `RecoveryChecklist`, responsive `FactTable`, `SpoilerDisclosure`, `Figure`, `FAQ`, and `VideoEmbed`. Each section uses the smallest structure appropriate to its question rather than a repeated universal order. Images sit beside or immediately after the copy they explain, with quiet captions.

## Performance and accessibility

Only the first player cover and local Logo are eager. All article media and YouTube iframes are lazy with intrinsic dimensions. Loading feedback appears after 300ms. Every interactive target is 44px minimum, focus is visible, live states are announced, color is never the only state cue, and reduced motion disables pulsing and transforms. A skip link precedes Header navigation.

