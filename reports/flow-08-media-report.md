# Flow 08 media report

Date: 2026-10-08

## Result

Media completion passed for ten game pages and two Guide pages.

- 40 game images: one unique cover and three distinct explanatory screenshots per game.
- 8 referenced Guide images: one task-specific cover and three step images per Guide. The two covers are original spoiler-safe task diagrams; the six step images use current game media.
- 10 adopted YouTube embeds: one per game, all linked to the matching video-analysis record and reviewed opening range.
- Original local logo and 1200×630 social image retained and registered.
- 60 adopted records in `research/media-ledger.json`.
- 48 local Game/Guide WebP files, 2,643,062 bytes total, with 48 unique SHA-256 hashes.

All public image paths are local. Creator-published game media was downloaded from each game's official itch.io page, resized without upscaling, and registered for limited editorial identification and explanation. The Guide covers were generated as original project illustrations from the stage-04 clinical case-file brief and contain no copied characters or game artwork. No YouTube file or thumbnail was downloaded. Embedded videos use validated 11-character IDs and the privacy-enhanced host.

## Visual review

- `reports/cover-context-contact-sheet.png` shows every game cover in Original, Featured/New, Recommended, More Games, and player-cover contexts.
- `reports/guide-cover-contact-sheet.png` shows each Guide cover in ledger-original, `/guides` list-card, and detail-lead contexts.
- `reports/game-media-contact-sheet.png` and `reports/guide-media-contact-sheet.png` retain the full cover-plus-article-image review.
- The initial Trapped with Jester selection contained a localized screenshot. It was removed and replaced with clean official title/interface imagery; the four public files remain unique.
- Images use `contain` in cards and the player so logos, titles, and focal characters are not cropped.

## Validation

- `npm run validate:media`: pass.
- `npm run typecheck`: pass.
- `npm run lint`: pass.
- Ten `youtube-nocookie.com` embeds were rechecked from a local HTTP origin with `strict-origin-when-cross-origin`; all ten exposed the YouTube play control and none showed error 153, an age gate, or an unavailable-video message.
- Media validation now checks actual dimensions, byte counts, local-path boundaries, unique cover hashes, three adopted screenshots per game, three task images per Guide, video-ledger linkage, reviewed-range linkage, and content-brief adoption IDs.

Records remain draft. Publication dates, canonical sitemap membership, final TDK checks, and production route exposure belong to flow 09.
