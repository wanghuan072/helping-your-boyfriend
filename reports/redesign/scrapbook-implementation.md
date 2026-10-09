# Scrapbook implementation

Implemented the approved pink mystery-scrapbook direction without changing the Next.js architecture or starting, stopping, or restarting a service.

- Main player is first: its complete frame fits within the tested desktop and phone first viewport.
- Real main-game media and the configured single iframe address are unchanged.
- Content remains in Game JSON; topic destinations remain Home, Endings, Characters and Controls.
- Paper notes, restrained tape corners, local Caveat/Nunito fonts, character dossiers, ending checkpoints, controls and native FAQ disclosures replace the old promotional hero.
- Later character details remain closed by default and support keyboard disclosure.
- Preserved the detailed article and all three safe gameplay screenshots; late-scene images remain spoiler-gated. The video remains after the body.
- Fonts are local files with their original OFL license notices.
- Removed unused previous homepage hero CSS.

Validation: lint, typecheck, publish data, content contracts and sitemap state pass. Development-browser checks show no horizontal overflow on desktop and phone; mobile topic navigation sends a full Document request and browser Back returns to Home. The rendered body contains more than 9,000 visible non-whitespace characters.

Production build is not confirmed: the existing running standalone service locks `.next/standalone` (EBUSY). No process was stopped. Run the normal build after manually stopping that service.
