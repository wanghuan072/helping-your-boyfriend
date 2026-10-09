# Flow 09 handoff

## Complete

- 19-route publication set generated and statically built.
- TDK lengths, ownership, uniqueness, canonical, Open Graph, JSON-LD, H1, public anchors, robots, and sitemap pass the standalone runtime audit.
- Content-aware sitemap state is initialized and validated without build-time date mutation.
- Published Game/Guide ID and slug sets match the route and sitemap sets.

## Flow 10 actions

- Run the complete command matrix on the final build.
- Verify all public routes in a real browser with no framework overlay, hydration error, console error, CSP rejection, or critical first-party request failure.
- Exercise main-player safe rejection and retry, all nine additional-game launch/input flows, navigation cleanup, both fullscreen controls, and mobile menu.
- Capture 375px, 768px, 1024px, and desktop evidence for homepage, game, Guide, lists, background/logo, and full-screen controls.
- Run Mobile and Desktop Lighthouse three times under identical production-preview conditions; use medians and fix site-caused scores below 90.
- Generate final acceptance manifest, command results, player runtime results, and final acceptance report. Do not deploy or commit Git.
