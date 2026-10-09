# Named endings and central page TDK

Date: 2026-10-08

## Content changes

The four ending cards now display the named outcome, a short explanation and its distinguishing condition. Their headings and summaries are sourced from the same section records as the detailed article. Desktop uses two columns; mobile uses one. All chapters remain directly visible and the single page-level spoiler notice remains.

Each ending has an outcome description, unlock steps and practical replay/recovery advice. Previous claims that Endings 1 and 2 both required high Adrian/low Ian affection, or that Ending 2 was determined simply by reversing pills, were removed. The article now distinguishes the first-night pill, scalpel, correct-address rescue call and Ian relationship threshold. The key requirement, number and address are included in the shared investigation checklist. No new ending-detail URLs were created.

Home adds FAQs about actual interactions and protagonist customization, plus names of the four outcomes without their unlock conditions. No additional-game recommendations or new navigation destinations were added.

## Reference material and verification boundary

The requested reference pages were retrieved read-only after the web reader could not access them:

- https://helpingyourboyfriend.com/
- https://helpingyourboyfriend.com/endings/
- https://helpingyourboyfriend.com/endings/ending-1-my-boyfriend-is-the-best/
- https://helpingyourboyfriend.com/endings/ending-2-nobodys-home/
- https://helpingyourboyfriend.com/endings/ending-3-the-empty-cage/
- https://helpingyourboyfriend.com/endings/ending-4-moving-forward/

Names, thresholds, location clues and outcome descriptions were revised against those reference pages. These are not newly verified gameplay runs or a fresh independent audit of the game script. Public prose is rewritten in the existing player-focused voice; no competitor layout, assets, new routes or source-workflow language is imported.

## TDK ownership

`seo/tdk.js` is the central page registry. Home, Endings, Characters and Controls are authored there, and their obsolete JSON SEO copies were removed. Legal/index entries remain there. Preserved additional-game entries are imported into the registry from their existing Game JSON rather than maintaining a second copy. Application loaders, metadata, content validation, sitemap fingerprints and runtime audit expectations resolve the same entries. Next Metadata renders keywords, canonical and matching Open Graph/Twitter text without title suffix inflation. Project instructions now reflect the latest user revision.

| Page | Title characters | Description characters |
| --- | ---: | ---: |
| Home | 53 | 151 |
| Endings | 55 | 157 |
| Characters | 56 | 160 |
| Controls | 54 | 156 |

## Checks

Lint, TypeScript, content contracts, publish-data validation and sitemap validation passed. A read-only HTTP audit of all 19 existing pages on localhost:3002 matched title and description against the central registry. An initial concurrent compile-time request returned 500 for an additional-game page; the subsequent individual request and full sequential audit both returned the correct results. Browser checks confirm main-page keywords, one Endings spoiler notice, no collapsed topic content, desktop/mobile navigation and Back, and no horizontal overflow at 390, 768 and 1024 widths.

Proof screenshots: `ending-names-and-summaries-desktop.png` and `ending-names-and-summaries-mobile.png`.

No service was started, stopped or restarted. Production build and gameplay were not rerun. No deployment or Git operation was performed.
