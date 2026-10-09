# Prelaunch content and media audit — 2026-10-09

Scope: the homepage, Endings, Characters and Controls. Archived additional-game records were preserved and were not treated as published pages. This is a source-based audit, not a claim that every route was replayed on every platform.

## Confirmed primary-source facts

The live [creator page](https://zieelane.itch.io/helping-your-boyfriend) lists four endings, five minigames, name/pronoun/body-type customisation, English and Thai, 8,000+ English words, and Windows/macOS/Android downloads. Its “115 CGs & character sprites” is a combined statement, not 115 of each. The premise, content warnings and published keyboard/mouse controls match the public articles. Adrian, Ian and Oliver are credited to Vertin Vii, BigG and Omong respectively. The [1.0.1 devlog](https://zieelane.itch.io/helping-your-boyfriend/devlog/1686354/update-101-choose-your-gameplay-difficulty) confirms difficulty selection and its October 2 release files. Cached search results still show 1.0; the live release page/devlog takes precedence.

## Route information and corrections

Compared the user-supplied [Endings reference](https://helpingyourboyfriend.com/endings/), the [independent October 4 walkthrough](https://sammiotomeaddicted.wordpress.com/2026/10/04/helping-your-boyfriend-guide/), and creator-hosted community walkthroughs. A walkthrough appearing in itch comments is player testimony, not developer documentation. Community accounts disagree on some affection prerequisites: [Jupikoou](https://zieelane.itch.io/helping-your-boyfriend/comments?before=6) describes affection gates, while [Pudding Queen](https://itch.io/post/17491311) describes Adrian affection as irrelevant. This conflict must not be concealed as fully verified game logic.

- Added the missing later medicine choice, “Pretend to swallow”, separately from Ian’s first-night blue pill. The indexed creator-hosted route checklist and independent walkthrough agree that actually taking Adrian’s medicine is different from continuing the investigation.
- Removed uncorroborated public thresholds: Adrian -3, Ian 40, optional scene above 14. Qualitative relationship directions are better supported, but are not an exhaustive verified choice-by-choice solution.
- Replaced the single-reference street address with the discovered package location / third address option. The number 015767438 and third-option/package prerequisite are supported by the indexed community route checklist, not by a developer-authored manual.
- Retained the four named outcomes and epilogue descriptions from the supplied detailed reference. These remain secondary-source descriptions; this pass did not independently watch all four ending title cards or all epilogues.
- Fixed contradictory drag advice: release in the slot, then inspect feedback. Replaced implied in-game save renaming with external notes of slot purpose. Softened unsupported scaling-bug and compact-keyboard incompatibility claims.
- Removed obsolete homepage/README claims that content is folded or must be opened. Chapters remain directly visible.

## Media accuracy and provenance

| Public assets | Finding |
| --- | --- |
| Main cover, customisation, dialogue-choice, doll-task and three late-scene screenshots | Ledger records identify original creator-hosted itch image URLs. No cross-game substitution identified in these records. Screenshots illustrate a state, not proof of an ending or successful input. |
| Protagonist crop | Visually consistent with the official body-type screen; original full screenshot URL is recorded for customisation. Existing crop lacks a separate derivation record. |
| Adrian crop | Visually consistent with the official Adrian character-card cover. Existing crop lacks a separate derivation record. |
| Ian and Oliver crops | Inspected locally; the current ledger contains no original URL, source frame or crop record. Their exact provenance and scene timing remain unconfirmed. Preserved user assets rather than inventing provenance. |
| Characters cover | Local typography composite using existing Adrian artwork; not a raw gameplay screenshot. |
| Endings and Controls covers | Existing ledger explicitly identifies generated illustrative diagrams. Their alt text describes diagrams, not actual game screens. They must not be used as gameplay evidence. |
| Embedded YouTube F-ouLW_MDkY | Existing identity check covers only 00:00–00:24. It cannot substantiate late endings. No complete new video review was performed here. |

Image existence/dimensions passing validation does not establish copyright permission. The old ledger’s “approved” editorial basis is not a creator licence grant. Do not imply creator endorsement or proven redistribution rights.

## Browser build boundary

The configured Kingdom of Marionettes iframe is separate from official downloadable distribution. No official browser build is offered on the creator page observed in this pass. The iframe address was preserved. Public release wording now separates downloadable 1.0.1 facts from a browser build that may differ. Exact mirror version, full gameplay, touch mappings, save persistence and redistribution permission remain unverified. Historical `research/game-runtime-profile.json` describes an older provisional address and is not a current runtime result.

## Homepage design

Replaced five dense paragraphs plus abstract checkpoints with a short introduction and four two-column ending cards (single column at 768px and below). Names are resolved from the shared Endings JSON; teaser text remains in the main-game JSON. Each card links to its existing ending anchor without new routes, JavaScript state or redirects. Character portraits now resolve from the shared Characters JSON instead of duplicating media metadata in the component. The first-viewport player, navigation, other rich content and archived game data remain intact.

## Release checks still required

1. Supply original sources or exact gameplay frames for Ian and Oliver crops.
2. Independently replay or inspect all four endings before declaring every condition and epilogue verified; resolve community affection-gate disagreements against the actual build.
3. Verify the hosted browser build/version, persistent saves and mobile inputs separately from official downloadable facts.
4. Replace prelaunch domain/contact configuration when choosing the production domain; no deployment was performed.

## Completed implementation checks

- ESLint, TypeScript, content contracts, publication validation and media-file validation passed.
- Sitemap state validation passed for nine public routes; production build completed successfully.
- Existing local development server was used without starting, restarting or stopping services.
- Browser DOM measurements at 1280, 1024, 768 and 390px showed no horizontal overflow. Ending cards use two columns above 768px and one column at/below it. The original two-column player remains at 1024px; it becomes single-column at 768px.
- A clicked ending card produced a `Document` network request to `/endings` and the expected ending anchor, verifying full-document navigation rather than a client-only route update.
- Validation success establishes project contracts and files, not the unresolved game-route/provenance facts listed above.
