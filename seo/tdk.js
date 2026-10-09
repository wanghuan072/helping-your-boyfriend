export const staticTdk = {
  home: { title: "Play Helping Your Boyfriend - Free Horror Game Online", description: "Play Helping Your Boyfriend online: enter an unsettling nightly routine, work on dolls, choose who to trust, and explore four endings with player help.", keywords: ["Helping Your Boyfriend", "play Helping Your Boyfriend", "Helping Your Boyfriend online"] },
  endings: { title: "Helping Your Boyfriend Endings - All 4 Routes Explained", description: "Explore all four Helping Your Boyfriend endings: learn their names, story outcomes, pill and scalpel choices, phone clues, and how to recover a missed route.", keywords: ["Helping Your Boyfriend endings", "Helping Your Boyfriend walkthrough", "Helping Your Boyfriend ending 4"] },
  characters: { title: "Helping Your Boyfriend Characters - Adrian, Ian & Oliver", description: "Meet Helping Your Boyfriend characters: understand our protagonist, Adrian, Ian and Oliver, their relationships, later encounters and roles in the four endings.", keywords: ["Helping Your Boyfriend characters", "Helping Your Boyfriend Adrian", "Helping Your Boyfriend Ian", "Helping Your Boyfriend Oliver"] },
  controls: { title: "Helping Your Boyfriend Controls - Keys & Minigame Help", description: "Learn Helping Your Boyfriend controls for dialogue, doll work and timed minigames. Find saving, skipping, difficulty and recovery tips before your next run.", keywords: ["Helping Your Boyfriend controls", "Helping Your Boyfriend minigames", "Helping Your Boyfriend how to play"] },
  privacy: { title: "Privacy Policy | Helping Your Boyfriend Site", description: "Read how Helping Your Boyfriend handles server requests, delayed game and YouTube frames, third-party services, browser choices, and privacy contact." },
  terms: { title: "Terms of Service | Helping Your Boyfriend Site", description: "Review terms for using Helping Your Boyfriend pages, independent guides, external browser games, YouTube players, availability limits, and spoiler help." },
  copyright: { title: "Copyright Policy | Helping Your Boyfriend Site", description: "Understand rights in original site writing and design, ownership of games and media, limited editorial screenshots, linking, and review requests." },
  about: { title: "About the Helping Your Boyfriend Player Site", description: "Learn about this independent Helping Your Boyfriend site, its player-focused pages, spoiler guidance, editorial scope, creator rights, and support contact." },
  contact: { title: "Contact the Helping Your Boyfriend Player Site", description: "Find the plain-text email for factual corrections, accessibility issues, broken players, video mismatches, privacy questions, and copyright concerns." }
};

// Public pages only. Additional-game titles stay on each game record.
export const pageTdk = Object.fromEntries(Object.entries(staticTdk).map(([key, value]) => [key === "home" ? "/" : `/${key}`, value]));

/** @param {string} path */
export function getPageTdk(path) {
  const entry = pageTdk[path];
  if (!entry) throw new Error(`Missing page TDK: ${path}`);
  return entry;
}
