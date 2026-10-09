# Stitched-heart brand assets — 2026-10-09

Created with the built-in imagegen tool, not the API/CLI fallback. These are independent site-brand graphics, not official game artwork or gameplay screenshots.

## Deliverables

- `public/images/logo.png`: 128×128 transparent stitched-heart mark, sized for the 48px header at high pixel density. The header keeps the full site name as readable HTML in the existing Notebook font. The original artwork is preserved separately.
- `app/favicon.ico`: the same symbol in a standard ICO container with PNG entries at 16, 32, 48, 64 and 256 pixels.
- `app/icon.png`: 64×64 transparent PNG companion, automatically linked with a content hash by Next.js.
- `public/images/og-image.png`: 1200×630 PNG share card. All nine public pages already resolve Open Graph and Twitter images to this shared path.

The source PNGs and previous logo, favicon and share image are retained here. `node scripts/prepare-brand-assets.mjs` only converts formats and sizes; it does not redesign or retouch artwork. No deployment, Git commit or service startup is part of this work.

## Final prompt set

### Icon generation

Use case: logo-brand. Create one original production-ready icon for an independent player companion website about the horror visual novel Helping Your Boyfriend. A single bold dusty-rose heart with a dark burgundy outline and a diagonal seam held together by just three thick cream stitches, suggesting lovingly repaired dolls and an unsettling romance. Charming pink scrapbook aesthetic with a subtly ominous edge, not medical branding. Crisp flat graphic silhouette, carefully balanced curves, no grain, no gradient, no shadow, no lettering, no faces, no extra symbols, no watermark, no mockup. Palette burgundy #482334, rose #d68ba4, cream #fff6ed. Square composition; icon occupies about 85% of canvas, isolated on genuinely transparent background. Must stay recognizable as a 16px browser favicon, so strong simple large shapes and no small detail.

### Icon refinement

Edit the supplied heart logo. Keep the exact heart silhouette, diagonal broken seam, three cream stitches, and transparent background. Make all fills absolutely uniform solid flat colors: pink heart #d68ba4, burgundy outlines #482334, cream stitches #fff6ed. Remove the dark smudge/ghost mark in the left half of the heart, ALL gradients, noise, mottling, texture, glows and lighting. Clean sharp professional flat logo only. No other changes, no lettering, no added motifs.

### Social card

Use case: logo-brand / social share card. Input image 1 is the approved brand symbol reference: pink heart with burgundy outline, diagonal broken seam and three cream stitches. Generate a polished horizontal 1.90476:1 social sharing banner (ideally 1200x630 composition). Same existing pink scrapbook horror-romance website aesthetic. Warm pale blush pink lightly textured notebook-paper background, subtle tiny dot pattern, a thin dark burgundy editorial frame inset with generous margins. Large approved stitched heart symbol at left occupying roughly 28% of width; match its silhouette and colors precisely. To the right, large confidently legible expressive handwritten lettering in dark burgundy arranged on two lines, EXACT text 'Helping Your' then 'Boyfriend'. Underneath, a restrained small crisp sans-serif text line exactly 'Play • Endings • Characters • Controls'. Clear balanced hierarchy, generous breathing space, understated premium independent game companion identity, subtle rose paper-tab accent but no clutter. Keep every element comfortably inside 8% safe area. No characters, game screenshots, fabricated gameplay, blood, weapons, photographs, stock logos, watermarks, URLs, official badges or extra words. This is a brand share card not an illustration or web page mockup.
