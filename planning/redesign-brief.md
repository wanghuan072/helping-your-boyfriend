# October 8 quality rebuild

Scope: preserve the Next.js routes and game identities; redo editorial hierarchy, card presentation, article substance and strict data contracts. No Git or deployment.

## Observed failures

- At 600px, the player shrinks to its intrinsic width after the primary wrapper becomes display:contents.
- Every game repeats the same eight headings, including unsupported claims about hidden route systems.
- The main game's premise incorrectly calls Adrian a stranger; late clues appear without a disclosure.
- Guide JSON uses an obsolete aggregate shape. Rendering and validation disagree with the current contract.
- Large square sidebar mattes waste space; long card descriptions obscure game differences.

## Current references, directly observed

The official itch.io main-game page uses warm pink stationery, readable character art and a contrast between care and unease. Poki reserves compact image-first tiles. CrazyGames allocates the dominant first screen to the player with a separate right rail. The latter two initially showed loading skeletons; no inference about their unavailable gameplay was made. Refer to design-reference-matrix.md for sources and rejected conventions.

## Composition choices

Selected: warm editorial case-file. Off-white paper, dark ink, muted rose, thin rules, restrained serif headings, unaltered game artwork, compact landscape recommendations. The player stays before the long article, not below a cinematic hero.

Rejected: full-page dark bedroom cinema. It delays play, makes nine unrelated games inherit Adrian's setting and burdens long-form reading.

Proof: reports/redesign/design-proof-wide.png uses the actual adopted covers. This is a direction proof, not an acceptance screenshot. Wide two-column layout, 1024px two-column continuity, 768px single-column transition. Mobile player's width must equal the content width at 390, 600 and 768px.

## Editorial acceptance

Each game answers a different player problem: streamer interface, six-ending baseball romance, short bus-stop encounter, voiced captive conversation, click-and-select harvesting, botanical marriage demo, inventory/awareness horror, injured caretaker demo, affection/points-gated jester demo. Do not invent thresholds or promise complete prototype content. Keep all nine independently playable extras; exclude the three previously failed candidates until actual input succeeds.

Spoiler-marked screenshots belong behind native keyboard-operable details. Routine explanations remain visible. Video examples follow the full article and indicate version limitations when the capture is older.

## Data and interaction

One JSON per Guide; exact current block keys; one shared selection algorithm for rendering and fingerprints. Normal anchor navigation with full document requests. No client-side page navigation. Current destination receives aria-current. Do not change main iframeSrc test.com.
