# Initial Research: Helping Your Boyfriend

Observed: 2026-10-08  
Language: English  
Target market: global English-speaking players

## Keyword boundary

The exact phrase identifies **Helping Your Boyfriend**, the horror visual novel released by Zieelane for the 2026 Spooktober visual novel jam. The official title contains no question mark and uses the same word order as the startup keyword. The official page describes a visual novel that alternates dialogue and choices with five hands-on minigames, supports English and Thai, and has four endings.

The ordinary-language phrase also appears in unrelated relationship advice and discussions about helping a partner play games. Those results are outside this project's identity boundary. Public pages must consistently combine the full title with game-specific context such as visual novel, minigames, controls, endings, Adrian, Ian, horror, Windows, macOS or Android.

The official release observed in this flow is downloadable for Windows, macOS and Android. It is not presented as an official browser game. The user-supplied first-version value `test.com` is not a safe absolute URL and does not identify the official game. It remains unchanged and provisional; the future player must refuse to create an unsafe iframe, display a clear failure state and allow retry. This does not block the rest of the site workflow.

## Search-result overview

Current results are characteristic of a very recent release:

- The creator's itch.io page is the strongest identity, feature, control, platform and warning source.
- New third-party browser/play pages are appearing quickly, but they are not evidence of an official web build.
- Ending walkthroughs and full-session YouTube videos appeared within days of launch.
- Repeated player tasks concern starting the correct game, minigame controls, QTE keys, saving/loading, four ending routes, platform installation and content warnings.
- Search-volume figures were not available from a reliable account. The project uses only qualitative strength labels and does not invent volume.

The clearest information gap is a single player-focused site that separates the official downloadable game's facts from the provisional browser player, explains the changing controls, gives spoiler-controlled ending help, and treats the extensive warnings responsibly.

## User-task clusters and page fit

1. **Play and identify the game** belongs to Home. Home must explain what is being launched and handle the provisional iframe honestly.
2. **Controls and five minigames** supports a complete Guide because players switch among clicking, dragging, dialogue shortcuts, arrow keys and Space.
3. **All four endings** supports a separate marked-spoiler Guide because affection and pivotal choices form a distinct task.
4. **Save, load and replay** supports both Guides and the Home FAQ; it is too narrow for its own page.
5. **Windows, macOS and Android setup** is a reserve Guide candidate. Flow 07 should publish it only if real troubleshooting depth is found.
6. **Warnings and accessibility** belong on Home and in relevant Guide introductions, not in a separate navigation page.
7. **Characters and story** should stay in a spoiler-light Home overview and marked walkthrough sections to avoid cannibalization and accidental spoilers.

No extra main-navigation topic page is justified. The required navigation should remain Home, Guides and More Games.

## Guide candidate scores

| Candidate | Task value | Independence | Evidence/media | Recommendation |
| --- | --- | --- | --- | --- |
| Controls and Minigames | High | High | Strong official controls and gameplay footage | Publish |
| All Endings Walkthrough | High | High | Strong but requires flow-07 route verification | Publish with spoiler warning |
| Installation and Platforms | Medium | Medium-low | Official files are clear; troubleshooting depth open | Reserve/merge into Home |
| Content Warnings | Medium | Low | Strong official list, limited independent depth | Home section and FAQ |

The two publish recommendations satisfy the requirement for at least two complete Guide details without manufacturing extra topics.

## Main-game runtime summary

- Official runtime: Unity with Naninovel, distributed as downloads in the observed creator page.
- Documented inputs: left click and Enter advance text; the mouse points, selects and drags; Space toggles dialogue; L opens history; A starts auto-play; Ctrl/Tab skips; arrow keys and Space handle QTEs; the bell opens Save, Load and Settings.
- Mobile: Android is officially offered, but the complete touch replacement for keyboard QTEs was not verified. Treat mobile playability as partial.
- Audio and visual warnings: loud noises, jumpscares and flashing/disturbing imagery make audio useful but require a clear warning and comfortable-volume advice.
- Save/load: required for practical replay and ending exploration.
- Player configuration: `test.com` is provisional and rejected before iframe creation. No permissions, sandbox, ratio or CSP origin can be truthfully derived from it.

## Controlled iframe findings

The flow used a temporary localhost page with HTTPS-only allowlisting, `strict-origin-when-cross-origin`, and a sandbox containing scripts, same-origin, forms, pointer lock and downloads but no popups or top navigation.

Direct `html-classic.itch.zone` upload URLs displayed itch.io's anti-hotlink page. The official `https://itch.io/embed-upload/{uploadId}` wrappers loaded correctly from the project origin and are the only candidate addresses retained. Nine candidates showed the correct game and accepted a real pointer input. The test did not observe popup or top-navigation attempts. These are preliminary `embeddable` results; the final Next.js player and production CSP must still be tested later.

The environment exposed only the Codex in-app browser. A new temporary tab was used, but a separately isolated browser profile was unavailable. This limitation is recorded and must be closed during final clean-context acceptance.

## Candidate set

| Game | Runtime result | Content/media capacity | Risk note | Status |
| --- | --- | --- | --- | --- |
| Going Live! | Correct warning/title and input passed | 14k words, three endings, verified full-session video | Suicide, homicide, flashing and animal gore | Eligible |
| First Base | Correct title and name prompt reached | 25k words, six endings, verified video; footage version needs comparison | 17+, blood, murder, kidnapping, no explicit sexual content stated | Eligible |
| The stranger from the bus stop | Correct title and opening narration reached | Four endings, four CGs, short replay loop, verified video | Stalking, mild blood, death and suicide | Eligible |
| Trapped with Jester | Creator splash and opening card reached | Six endings, voiced, multilingual, verified video | Fantasy threat and betrayal | Eligible |
| Today, I'm Harvesting You! | Correct menu and opening text reached | Point-and-click task, known web bugs, verified video | Suggestive language, violence and gore | Eligible |
| My Own Sweet Dionaea | Correct title and demo text reached | 5–6k words, care choices, verified video | 17+, suggestiveness, body horror, child-death reference, pet suffering | Eligible, strict media review required |
| OVERD0SE | Current creator splash and Day 1 dialogue reached | Multiple systems and current devlogs, verified video | Graphic self-harm, suicide, gore, drugs and abuse | Eligible, severe warning/media review required |
| Devour Me Gently | Correct title and name prompt reached | Complete short-demo video and clear confinement task | Kidnapping/confinement framing | Eligible |
| Dystopia: The Jester's Obsession | Correct title and name prompt reached | Four endings, point system, verified video | Suggestive/obsessive behavior; future NSFW plan is not current content | Eligible |
| Silver Thread : Episode I | Correct title loaded; input not confirmed | Strong facts and video candidate | Cartoon blood and violence | Needs secondary input check |
| My Vampire Boyfriend Smokes Lucky Strikes | External frame stayed black | Strong Episode 1 facts and video candidate | Blood, death and murder | Needs secondary runtime check |
| Welcome, Dear Human [Demo] | Godot Cross-Origin Isolation/SharedArrayBuffer error | Strong facts/video but unusable external runtime | Horror/monster romance | Excluded |

Nine eligible candidates leave one item of margin above the required final eight. Flow 03 should select eight or nine based on recommendation graph completeness and risk/media feasibility. It must not select Silver Thread or My Vampire Boyfriend until their runtime gaps close, and must keep Welcome, Dear Human excluded.

## Candidate relationship graph

The candidates are linked by player behavior, not only by the broad visual-novel label:

- First Base, The stranger from the bus stop, Devour Me Gently and Going Live! share apparently affectionate encounters that require the player to read warning signs and manage high-impact choices.
- OVERD0SE, My Own Sweet Dionaea and Helping Your Boyfriend connect through medical/caretaking dependency and systems that turn ordinary care into psychological danger.
- Trapped with Jester and Dystopia share jester-centered uncertainty, affection choices and compact multi-ending replay.
- Today, I'm Harvesting You! is the closest mechanical companion to Helping Your Boyfriend because dialogue is interrupted by a hands-on point-and-click task, although the player's moral role is reversed.

Each eligible detail can be connected to six other eligible records using these concrete relationships. Flow 03 must lock the actual six-card sets and confirm no page requires an unrelated fallback.

## Video discovery result

The main game and each of the nine runtime-qualified candidates has a matching `youtube-nocookie.com` candidate that rendered a play control from the local origin. Playback began for the main game and all nine candidates; visible title art, UI or characters matched the named game. The selected footage is initial research, not final evidence: flow 07 must watch task-specific segments, record timestamps, compare build versions, distinguish commentary from game facts and reject misleading thumbnails or spoiler-heavy placements.

First Base and OVERD0SE videos are clearly older than the current observed browser uploads and are marked `different-version`. Silver Thread, My Vampire Boyfriend and Welcome, Dear Human remain `unknown` until runtime/version identity is resolved. No video transcript or creator description is copied into public content.

## Risk boundaries

The main game contains significant but fictional horror material. Public copy must describe warnings calmly, avoid glamorizing coercive relationships and keep graphic events, ending conditions, the locked-room solution and final reveals out of cards, descriptions, TDK, alt text and unmarked video captions.

Risk is recorded separately for every candidate. No candidate is treated as safe merely because it is an itch.io visual novel. `My Own Sweet Dionaea`, `OVERD0SE` and `Today, I'm Harvesting You!` require especially conservative image selection. Planned adult content in Dystopia is not part of the observed current demo and must not be represented as shipped content.

## Flow-07 research gaps

- Recheck the official Helping Your Boyfriend build number, language selector, Android touch mappings and each minigame's exact failure/recovery behavior.
- Resolve conflicting or rapidly changing ending guidance through current-build observation.
- Watch and timestamp every adopted video segment; connect each claim, screenshot and section to the page blueprint.
- Recheck the nine eligible candidates inside the real project preview, then reduce to at least eight only if every page has independent 4,000-character content depth, three explanatory screenshots and one adoptable video.
- Retry Silver Thread and My Vampire Boyfriend only as alternates; do not weaken sandbox or CSP to admit them.
- Keep the main iframe provisional unless the user supplies a replacement. Do not search for or substitute an unofficial browser build.
