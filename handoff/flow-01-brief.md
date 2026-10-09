# Flow 01 Brief

## Status

completed

## Confirmed Inputs

- Project directory: `D:\wh\202610\Helping Your Boyfriend\Helping Your Boyfriend\helping-your-boyfriend`
- Workflow directory: `D:\wh\Agent\Game-Agent`
- Main keyword and locked initial title: `Helping Your Boyfriend`
- Main-game first-version iframe value: `test.com` (stored verbatim; provisional and not tested in this flow)
- Domain input: `test.com`; normalized canonical origin: `https://test.com`

## Outputs

- Added `project.yaml` with normalized paths, detected runtime, execution defaults, and safety boundaries.
- Added `data/games/main-game.json` using the draft Game schema and the unchanged first-version iframe value.
- Added the empty additional-game collection at `data/games/games.json`.
- Added the required project-management directories: `research`, `planning`, `reports`, and `handoff`.
- Extended the existing generated Next.js `AGENTS.md` without removing its framework rule block.

## Locked Decisions

- The project is an existing, minimally customized Next.js 16.4.0 App Router starter using npm, React 19.3.0, TypeScript, and Tailwind CSS 4 tooling.
- The main game is identified by `helping-your-boyfriend`, appears only at `/`, and reads its only player address from `data/games/main-game.json`.
- No deployment or Git commit is authorized. This directory is not currently a Git repository.
- Work is confined to this project; no other game project may be read.

## Decisions The Next Flow May Change

- Language, target market, standard game identity, search intent, content risk, and device/runtime profile remain unresolved pending research.
- Player ratio, permissions, referrer policy, sandbox, media, SEO, content, dates, categories, tags, and spoiler policy remain draft values.
- Deployment target and portable production-output strategy remain unresolved.

## Known Gaps

- `test.com` has deliberately not been normalized or tested as an iframe address and is recorded as provisional.
- The starter contains only its default root route and assets. It has no existing game/Guide data, shared navigation, SEO registry, sitemap, or established media library to migrate.
- No prior Game schema or player configuration was found, so there is no legacy-consumer migration list.
- The directory has no `.git` metadata; there are no tracked user changes to report.

## Required Reads For The Next Flow

- `D:\wh\Agent\Game-Agent\02-关键词与市场研究\workflow\02-关键词与市场研究.md`
- Every specification named by flow 02 before research begins.
- `project.yaml`, `data/games/main-game.json`, and this handoff.

## Next Flow Instructions

- Begin flow 02 immediately, use live web research, determine language and target market, investigate the main game and 12–20 additional-game candidates, and write only the flow-02 research and handoff artifacts permitted by that stage.
- Preserve the exact current `player.iframeSrc` unless the user supplies a replacement. Record its runtime conclusion as provisional rather than blocking the workflow.
