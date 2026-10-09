# Flow 02 Brief

## Status

completed

## Confirmed Inputs

- Primary keyword: `Helping Your Boyfriend`
- Site language: English
- Target market: global English-speaking players
- Official main-game page: `https://zieelane.itch.io/helping-your-boyfriend`
- Supplied first-version iframe source: `test.com` (preserved verbatim)
- Main-game runtime status: `provisional / not_embeddable`; this does not block flows 01–10

## Outputs

- `research/evidence.json`
- `research/additional-game-candidates.json`
- `research/keyword-video-map.json`
- `research/keyword-signals.json`
- `research/game-runtime-profile.json`
- `research/game-claim-matrix.json`
- `research/initial-research.md`
- Updated language, market, tags, categories, and spoiler policy in the project configuration and main-game JSON

## Locked Decisions

- Use English throughout the public site.
- Do not create a navigation topic page merely to fill a slot; no independent topic page is justified by the current evidence.
- Plan two distinct Guides: a controls/minigames guide and a four-endings walkthrough.
- Use the official itch.io upload wrapper for eligible additional-game players; direct `html-classic.itch.zone` hotlinks are not acceptable.
- The first release keeps `test.com` as the exact main-game player value and treats it as provisional. The player must reject it safely rather than creating a dangerous iframe.
- Nine candidates passed identity and real pointer-input checks; eight or nine may proceed after media and content completeness checks.

## Decisions Next Flow May Change

- The final published set may drop an eligible candidate if it cannot meet per-game media, content, or video requirements.
- Featured, New, and Recommended memberships and ordering remain to be planned and validated.
- Guide slugs and exact titles may be refined while preserving their distinct player tasks.

## Known Gaps

- The user-provided main-game iframe is not a safe absolute URL and remains provisional by design.
- The available in-app browser did not expose a separate clean profile. Runtime checks were isolated in a temporary local preflight page, but final acceptance must repeat player tests against the production build.
- Full timestamp-by-timestamp video observation, screenshot adoption, and media-rights registration are deferred to the dedicated research and media flows.

## Required Reads For Next Flow

- `03-页面与内容结构规划/workflow/03-页面与内容结构规划.md`
- Any planning, Guide, SEO, navigation, and sitemap specifications explicitly named by that workflow
- `handoff/flow-01-brief.md`
- `handoff/flow-02-brief.md`
- Stage 02 research JSON files

## Next Flow Instructions

- Define the route and content architecture without modifying site implementation files.
- Select the final game set only when every selected item has a unique identity, player source, planned media, and sufficient content scope.
- Keep the main game exclusively at `/`; do not create a duplicate main-game detail route.
- Keep navigation limited to Home, Guides, and More Games unless new evidence supports a truly independent topic page.
- Plan all data consumers, URL ownership, canonical behavior, responsive layouts, sticky boundaries, Guide outlines, spoiler policies, and acceptance evidence before visual design or implementation.

