# Design Reference Matrix

Checked on 2026-10-08. These references inform interaction and density only; their code, copy, assets, ratings, and layouts are not copied.

| Current site | Relevant method | Adopt | Reject |
| --- | --- | --- | --- |
| [Helping Your Boyfriend on itch.io](https://zieelane.itch.io/helping-your-boyfriend) | Long-form visual-novel page with a strong title image, clear download action, screenshots, warnings, controls, release facts, and creator credits | Preserve the game's pale pink paper/sticker warmth, dark medical tension, readable control list, and early content warning; keep media adjacent to the fact it explains | Do not copy the creator page layout, comments, donation/download UI, artwork as a full-site background, or dense marketplace chrome; do not expose community spoilers |
| [Poki](https://poki.com/) and its [game-page guidance](https://developers.poki.com/guide/your-game-page) | Immediate play emphasis, dense scannable discovery tiles, device-aware framing, fullscreen as a deliberate game action | Make Play Now dominant over decoration, keep game-card labels brief, reserve media geometry, and keep essential player controls in safe areas | Reject popularity/rating language without first-party evidence, animated hover previews, ad-led density, category sprawl, account/cookie behavior, and a square-crop assumption for every cover |
| [Crazy Chameleon on CrazyGames](https://www.crazygames.com/game/crazy-chameleon) and [gameplay requirements](https://docs.crazygames.com/requirements/gameplay/) | Player-first detail route followed by concrete features, platform facts, and exact controls; tested game frame sizes and fullscreen expectations | Put the player before the article, use concise state controls, separate controls by device only when verified, and keep long explanatory copy below play | Reject ratings, Hot labels, ads, huge category navigation, a mandatory 16:9 crop for all artwork, and generic metadata tables that displace current-game guidance |

## Method conclusion

The useful common pattern is “play first, explain immediately afterward, keep alternatives scannable.” This project diverges by pairing that utility with a quieter editorial reading surface, strong spoiler boundaries, and a distinctive prescription-tab motif derived from the main game's medical/stationery contrast.

The UI/UX skill suggested retro-futurism and newsletter conversion. Both are rejected: CRT/neon would be generic and unrelated, while subscription patterns conflict with the capability matrix. Its accessibility guidance—visible focus, reserved layout space, restrained animation, skip navigation, keyboard reachability, and reduced-motion support—is adopted.

## Two realizable composition directions

### Direction A — Clinical case file (selected)

- Light paper canvas, ink-dark player/footer, rose action color, gold warning markers.
- The prescription-tab signature labels Header active state, player status, section transitions, and Footer brand line.
- Dense right rail uses small real-cover cards; long article remains one uninterrupted left track.
- Strengths: connects directly to Adrian's doctor role and the game's paper/doll routine; supports warnings and lengthy instructions without visual fatigue; keeps the player visibly primary.
- Risks: can become sterile. Mitigation is warm pink surface tint, editorial serif headings, and character/game media left in its original colors.

### Direction B — Midnight bedroom vignette (rejected)

- Dark plum canvas, framed bedroom-like media panels, crimson controls, large cinematic opening image.
- Strengths: immediate horror mood and high media drama.
- Rejected because dark full-page reading is tiring across 4,000+ characters, a cinematic hero delays the player, and repeating framed scenes would make every additional game inherit the main game's bedroom atmosphere.

## Cover-fit decision matrix

All decisions remain provisional until processed files are inspected in every card context.

| Game | Expected title/focus behavior | Player cover | Recommended / More Games | Sidebar |
| --- | --- | --- | --- | --- |
| Helping Your Boyfriend | Wide illustrated title composition; logo and doctor sit far apart | `contain` on dark ink matte | Not used as an additional-game card | Not used |
| Going Live! | Title/interface composition likely contains edge text | `contain` | dedicated 4:3 canvas with `contain` | same canvas, no crop |
| First Base | Title art likely has title and character near edges | `contain` | dedicated 4:3 canvas; safe `cover` only after review | `contain` by default |
| The stranger from the bus stop | Scene-led cover with important setting | safe `cover` after focal check | safe `cover` | safe `cover` |
| Trapped with Jester | Title composition and character silhouette | `contain` | dedicated canvas with `contain` | `contain` |
| Today, I'm Harvesting You! | Title must remain readable and graphic content excluded | `contain` | `contain` on neutral matte | `contain` |
| My Own Sweet Dionaea | Readable title and plant/character focal pair | `contain` | dedicated canvas with `contain` | `contain` |
| OVERD0SE | Current-build title/UI must not be cropped | `contain` | `contain`; no graphic frame | `contain` |
| Devour Me Gently | Hand-painted title scene, edge details matter | `contain` | dedicated canvas with `contain` | `contain` |
| Dystopia: The Jester's Obsession | Monochrome title art with likely edge lettering | `contain` | `contain` on pale matte | `contain` |

