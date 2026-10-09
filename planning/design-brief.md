# Helping Your Boyfriend Visual Design Brief

## Core direction

The visual system is a **clinical case file that initially feels sweet**. The main game juxtaposes pale-pink stationery, sticker-like symbols, soft character art, a doctor/caretaker setting, black gloves and red danger accents. The site translates that relationship into a warm paper canvas, ink-dark player/Footer surfaces, rose actions, and gold warnings. It does not reproduce the game's artwork as a page skin or add generic neon gaming effects.

The signature element is a **prescription tab**: a rounded paper label with a tiny notch/perforation and one clinical rule. It marks the current Header item, player state, article transitions, warning callouts, and Footer brand line. This gives the site a recognizable grammar while each additional game keeps its own unfiltered cover and screenshots.

Selected composition is the light clinical case file. A darker bedroom-cinematic alternative was rejected because it delays the player, makes long reading tiring, and wrongly imposes the main game's scene on every additional title. Full comparison and three-site method research are recorded in `planning/design-reference-matrix.md`.

## Visual hierarchy

- Header and page canvas are light; the player frame is the strongest dark mass and therefore the first action target.
- Homepage H1 tops at 56px; game-detail H1 tops at 44px. They are never uppercased by CSS.
- Rose is reserved for the primary Play action, links, active navigation, and focused context. Gold is a warning/status cue paired with an icon and label.
- Editorial serif headings communicate story and tension; the sans-serif body carries controls and long instructions; monospace is restricted to keys/status.
- Surfaces rely on spacing and a single soft shadow, not repeated boxed borders. Sections transition through the prescription tab and rule rather than decorative panels around every paragraph.

## Page responsibilities

- Home: player-first orientation, then a complete first-run explanation with control screenshots and a post-article video.
- Additional game details: shared player/recommendation frame, but unique article rhythm, screenshots, warnings, and system explanations from the per-game matrix.
- More Games: highest card density, minimal prose, accurate covers, six/four/two columns.
- Guides index: two calm horizontal task cards; the media tells controls apart from ending completion.
- Guide detail: editorial reading surface and task navigation. Both planned Guides merit a TOC; spoiler disclosures are explicit text controls.
- Legal: compact text-first pages without decorative game art or invented identity blocks.

## Dimensioned page diagrams

### Home and additional game detail — 1440px viewport

```text
20px  ┌──────────────────────── 1400px container ───────────────────────┐ 20px
      │ Header 72px: Logo 216×48 | Home | Guides | More Games          │
      ├──────────────────────────── 972px ─────┬─28─┬──── 400px ───────┤
      │ H1 56/44 + 19px lead                   │     │ Featured 6       │
      │ Player 972×547 (16:9)                  │     │ 2×3, media 190×143│
      │ status 56px + two 44px controls        │     │ New 6            │
      │ Recommended: 3×2, media ≈305×229       │     │ 2×3, same density│
      │ Article uses complete 972px track      │     │ height-aware      │
      │ section screenshot / copy / callout    │     │ sticky rail       │
      │ Post-article video 16:9                │     │                  │
      └────────────────────────────────────────┴─────┴──────────────────┘
```

The homepage first 900px shows Header, H1/lead, and most or all of the player. An additional-game detail adds a compact breadcrumb but keeps the player visible.

### Home and game detail — 1024px viewport

```text
20px ┌────────────────────── 984px ─────────────────────────┐ 20px
     │ Header 64px: Logo | hamburger 44×44                  │
     ├────────────── 652px ──────────────┬─20─┬── 312px ───┤
     │ H1 ≤50/40; lead                   │     │ Featured 2×3│
     │ Player 652×367                    │     │ New 2×3     │
     │ Recommended 2×3                   │     │ sticky below│
     │ Full-width left-track article     │     │ 64+16px     │
     │ Video                             │     │              │
     └───────────────────────────────────┴─────┴──────────────┘
```

### Home and game detail — 768px viewport

```text
16px ┌──────────────────── 736px ─────────────────────┐ 16px
     │ Header 64px: Logo | hamburger                  │
     │ H1 ≤38/32 + lead                               │
     │ Player 736×414 + wrapped status controls       │
     │ Recommended: 2 columns × 3 rows                │
     │ Full article + 3 explanatory screenshots       │
     │ 1–3 videos                                     │
     │ Featured: 2 columns × 3–4 rows                 │
     │ New: 2 columns × 3–4 rows                      │
     └─────────────────────────────────────────────────┘
```

### More Games — 1440 / 1024 / 768

```text
1440: 1400px container → 6 columns, 16px gaps, ≈220px cards
1024:  984px container → 4 columns, 16px gaps, ≈234px cards
 768:  736px container → 2 columns, 12px gaps, ≈362px cards
```

Each card has a 4:3 canvas that applies its own `contain` or verified safe `cover`, a two-line title limit, and a two-line short description. No search, pagination, or fake category controls are added for nine games.

### Guides index — 1440 / 1024 / 768

```text
1440 and 1024: [task cover 320×200 / 260×164] [title, summary, tags, dates, action]
768 and below: [full card-width task cover] then [title, summary, tags, action]
```

The controls cover shows a visible input prompt; the endings cover shows a neutral branching choice. The same cover object appears in list and detail.

### Guide detail — 1440 / 1024 / 768

```text
1440: breadcrumb → H1 ≤44 → lead/dates/tags → cover → body ≈68ch + 260px TOC
1024: breadcrumb → H1 ≤40 → metadata → cover → body + ≈220px sticky TOC
 768: breadcrumb → H1 ≤32 → compact metadata → cover → in-flow TOC → body
```

TOC top is Header height plus 16px, is bounded by the article, and may use its own available-height scrolling only when its contents exceed the viewport. Section anchors use the same offset.

## Player state appearance

Ready shows the accurate cover on an ink matte and a rose Play Now button. Loading keeps the 16:9 box fixed and announces progress with a quiet tab and reduced-motion-safe pulse. Timeout and failure return the cover under an ink wash, pair a gold/danger edge with plain copy, and keep Retry visible. Loaded state names the current game in a 56px bar. Webpage Fullscreen and Browser Fullscreen use visibly different line SVGs and persistent pressed styles.

## Media behavior

The main cover and Logo reserve dimensions and load eagerly; all article screenshots and YouTube frames are lazy. `contain` is the default when title text, Logo, or edge subjects would crop. A dark or pale matte fills unused canvas. `cover` is allowed only after Featured, New, Recommended, More Games, and player previews prove that no title or essential subject is lost. Media slots and their adjacent player questions are in `planning/media-slots.json`.

## Accessibility and restraint

All normal text pairs exceed 4.5:1 in the token file. Focus is a gold ring plus dark offset, not color alone. Targets are at least 44px. A skip link, logical tab order, live player states, accurate alt, explicit warning icons/labels, and reduced-motion behavior are mandatory. There is no parallax, scroll-jacking, carousel, animated thumbnail wall, comment UI, rating UI, subscription UI, or ad placeholder.

## High-fidelity review artifact

`planning/high-fidelity-wide.png` shows the selected desktop homepage direction at 1600×1120 with the 1400px container, real project title, real main-game art direction, six real planned titles in Featured and New density, six Recommended cards, and the opening article hierarchy. It is a visual contract, not a source of public media rights.

