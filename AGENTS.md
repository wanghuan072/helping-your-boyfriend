<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project execution rules

- The only writable project boundary is `D:\wh\202610\Helping Your Boyfriend\Helping Your Boyfriend\helping-your-boyfriend`; do not read or copy from other game projects.
- Preserve the existing Next.js architecture and user changes. Do not deploy or commit to Git without a separate explicit request.
- GitHub upload authorization is limited to the current request. Keep all subsequent edits local; commit or push them only when the user explicitly requests it again.
- 用户后续明确授权上传 GitHub 时，上传完成后确认本次提交已成功部署到 helpingyourboyfriend.org，再自动运行简单版 IndexNow 提交并检查返回结果，无需再次询问是否提交网址。优先提交已部署的新增、更新、删除网址；首次或无法可靠确定变更范围时，对当前小站使用 `npm run indexnow:submit -- --all`。部署失败或尚未完成时不得提前提交；200/202 仅代表协议接受，不宣称已收录。此规则不授权自动 Git 提交、推送或部署，也不创建定时任务；只有本地修改时不运行提交。
- Latest user revision: the shared navigation contains only Home (`/`), Endings (`/endings`), Characters (`/characters`), and Controls (`/controls`). No More Games or Guides navigation. Old Guide URLs are removed and return 404; do not add compatibility redirects during development.
- The main game exists only at `/`. Additional game records stay in `data/games/games.json` and are not public routes, sitemap entries, or on-page links. `/games` and `/games/[slug]` return 404. All game identity, player, media, content, SEO, and recommendation data comes from `data/games/main-game.json` and `data/games/games.json`; the three topic pages use one JSON source shared by all consumers.
- Each game owns exactly one `player.iframeSrc`. Derive iframe configuration and CSP from Game JSON. A provisional main-game address may fail safely; every published additional game must be verified in the final site with visible gameplay and valid input.
- Never substitute another game's title, slug, cover, copy, iframe, screenshots, or video. Each publishable game needs an independent cover, at least three task-specific gameplay screenshots, 4,000 or more non-whitespace visible body characters, and one to three verified embeddable YouTube videos after the body.
- Latest user revision: public pages are only Home, Endings, Characters, Controls, and the five Legal pages. Do not display additional games on any page. Preserve existing additional-game data.
- Public copy must be player-focused and must not expose research, sourcing, collection, report, evidence, or internal workflow language. Do not create comments or advertising placeholders.
- Use a local `/images/logo.png` image logo and `/images/og-image.png` for every social card. Preserve the exact game name and punctuation in H1 text; never force H1 text to uppercase with CSS.
- Latest user revision: public pages resolve TDK through `seo/tdk.js`. Home and the three topics are authored only there, not duplicated in JSON. Additional-game TDK stays on each game record and is not registered as a public page. Final titles are 40–60 characters and descriptions 140–160 characters.
- Footer Legal links are `/privacy`, `/terms`, `/copyright`, `/about`, and `/contact`, with `rel="noopener noreferrer nofollow"`. Contact exposes only a plain-text domain-derived email and no form.
- The desktop content container is at most 1400px. Use only 1024px and 768px responsive width breakpoints. Keep the specified two-column game layout through 1024px and switch to the prescribed single-column order at 768px and below.
- Generate sitemap entries from the canonical registry and data files. Change a page date only for a new page or materially changed visible content.
- The English README is player-facing and links every Header and Footer destination; build and validation commands belong in internal reports.
