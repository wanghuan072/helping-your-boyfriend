# Topic page reading layout

Date: 2026-10-08

Endings, Characters and Controls render their chapters directly. Endings and Characters each have one page-level spoiler notice, sourced from their existing JSON. Duplicate notices were removed from the data; useful gameplay warnings remain. Home retains its separate spoiler disclosures, and its descriptions now accurately distinguish the topic pages.

The shared layout uses a compact handwritten masthead, framed cover, numbered paper chapters and a sticky desktop chapter index. Endings has four in-page route shortcuts and numbered action steps. Characters retains the character-specific accents; Controls uses readable steps, input tables and recovery notes. All existing detailed paragraphs, screenshots and route instructions remain.

Validation: lint, TypeScript, content contracts, publish data and sitemap checks pass. Browser checks on the existing localhost:3002 service confirm no topic-page details elements; one spoiler notice each on Endings and Characters; all four ending routes rendered; no horizontal page overflow at 390, 768 and 1024 widths. Desktop and mobile navigation, chapter anchors and browser Back were checked. A mobile masthead implicit-grid-column bug was found and fixed.

Screenshots: endings-expanded-desktop.png, ending-route-expanded.png, endings-expanded-mobile.png, characters-expanded-desktop.png, characters-expanded-mobile.png, controls-expanded-desktop.png and controls-expanded-mobile.png.

No service was started, stopped or restarted. Production build was not rerun because the previously observed standalone-directory lock has not been cleared by the user. No deployment or Git operation was performed.
