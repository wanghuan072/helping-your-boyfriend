# Flow 05 Handoff

## Status

Flow 05 is complete. The implementation contract is locked without modifying the public site code.

## Locked decisions

- Preserve the current Next.js 16.4.0 App Router, root `app/` layout, strict TypeScript, npm, and existing project architecture.
- Produce a portable Node.js deployment with Next.js standalone output.
- Use Server Components for pages and the smallest client boundaries for the menu, player, fullscreen, and bounded sticky behavior.
- Generate published Game and Guide paths from validated JSON and reject unknown routes with `dynamicParams = false`/404.
- Keep the main game only at `/`; total planned public canonical count is 19.
- Use ordinary anchors for public page changes so each game transition performs a full document navigation and resets player state.
- Use a strict data gate with no cross-game or placeholder fallback.
- Keep draft preview coverage outside public routing in test fixtures/harnesses.
- Generate CSP from approved published frame origins; production may not include `'unsafe-eval'`.
- Preserve sitemap dates through visible-content fingerprints, including actual recommendation sets.

## Required next-stage inputs

- `planning/code-structure.md`
- `planning/data-flow.md`
- `planning/route-registry.json`
- `planning/test-plan.md`
- Existing flow 01–04 research, content, responsive, component, and media plans

## Flow 06 priorities

1. Create the data schemas/loaders and shared navigation/config first.
2. Build the route skeleton and shared game/player components from the locked structure.
3. Implement only the planned breakpoints and confirm full-document navigation.
4. Add validators and production security headers before content population.
5. Keep all draft/incomplete records out of public collections until flow 09 gates pass.

No deployment or Git operation was performed.
