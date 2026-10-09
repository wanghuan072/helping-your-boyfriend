# Responsive Plan

Only `max-width: 1024px` and `max-width: 768px` may change layout. Default desktop rules are fluid between those breakpoints and the 1400px maximum.

## Desktop default

- Container: 1400px actual content width when the viewport permits, 24px minimum gutters below that.
- Header: 72px, local 216×48 Logo, inline Home → Guides → More Games.
- Game grid: `minmax(0, 1fr) 400px`, 28px gap. At a 1440px viewport with 20px outer gutters, the left track is 972px and sidebar 400px.
- H1: homepage 56px maximum; game detail 44px maximum. Player remains visible in the first common 900px desktop viewport.
- Player: 16:9, 972×547 in the 1400px grid.
- Recommended: three columns; each card is about 305×250 including a 4:3 media canvas and text.
- Sidebar: two columns with 10px gap; each media canvas is about 190×143. Groups contain 3–4 rows.
- More Games: six columns, about 213px each after five 16px gaps.
- Guides index: horizontal cards, 320px image and flexible copy.
- Guide detail: reading track up to 68ch plus 260px TOC; game articles never use that reading cap.

## 1024px and below

- Gutters: 20px; Header: 64px and hamburger navigation.
- Game grid remains two columns: `minmax(0, 1fr) 312px`, 20px gap. At 1024px the content width is 984px, left track 652px, sidebar 312px.
- Player is about 652×367; homepage H1 ≤50px and inner H1 ≤40px.
- Recommended switches to two columns. Sidebar remains two columns and drops optional helper labels to preserve 44px links without oversized cards.
- Sticky top becomes `64px + 16px`; height-aware bidirectional boundary logic remains active.
- More Games uses four columns. Guide index remains left image/right text; Guide detail keeps TOC at about 220px.
- Header menu uses the exact three navigation items and closes on Escape, link activation, and button toggle.

## 768px and below

- Gutters: 16px; homepage H1 ≤38px, inner H1 ≤32px; body ≥16px.
- Game grid becomes a single track. DOM/visual order is player, six Recommended cards, complete article, current-game video section, Featured, New.
- Sidebar sticky and its controller are disabled. Sidebar groups become normal sections without an internal scroll area.
- Player uses full available width and the status bar may wrap into two rows while both fullscreen targets remain 44×44 and inside safe-area padding.
- Recommended stays two columns; Featured and New each stay two columns. Long titles use two lines and the card media keeps its planned canvas.
- More Games uses two columns. Guide index becomes media-above-copy. Guide TOC enters the document before the first section and does not stick.
- Footer becomes a compact vertical brand, primary navigation, Legal group, and copyright sequence; every link remains 44px high.

## 375px verification

- Available content width is 343px. Two-column compact cards are approximately 164px each with an 8–12px gap.
- No fixed card width, long unbroken game title, iframe, table, or code-like control label may force horizontal overflow.
- Cover media uses its own fit metadata; `contain` canvases can letterbox with the ink or surface tint rather than crop title art.
- Webpage Fullscreen respects `env(safe-area-inset-*)`; Browser Fullscreen failure returns focus to its button.

## Anchors, layers, and motion

- `scroll-margin-top` uses Header height plus 16px.
- Header z-index 50; hamburger 60; sticky rail/TOC 30; webpage fullscreen 80.
- Motion is 150–320ms using opacity/transform only. `prefers-reduced-motion: reduce` removes pulses, smooth scrolling, and transform transitions without suppressing state changes.

## Required screenshot comparisons after implementation

- 1440×1000: home and an additional detail with 1400px container, 972/400 split, both sidebar groups, and player in view.
- 1024×768: hamburger Header, 652/312 game split, two-column sidebar and usable sticky position.
- 768×1024 and 375×812: strict single-column ordering, two-column card groups, stacked Guide cards, no overflow.
- Full-page captures must prove the sidebar reaches both top and bottom during real scrolling and stops before Footer.

