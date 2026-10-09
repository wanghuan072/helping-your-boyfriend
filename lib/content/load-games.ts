import mainGameData from "@/data/games/main-game.json";
import gamesData from "@/data/games/games.json";
import type { Game } from "./types";
import { staticTdk } from "@/seo/tdk.js";
import { selectHomepage, selectGameCollections } from "./collections.mjs";

const mainGame = { ...mainGameData, seo: staticTdk.home } as Game;
const games = gamesData as Game[];

export function getMainGame({ includeDraft = false } = {}) {
  if (!includeDraft && mainGame.status !== "published") return null;
  return mainGame;
}

export function getAllGames() { return games; }
export function getAllPublishedGames() { return games.filter((game) => game.status === "published"); }
export function getGameBySlug(slug: string, includeDraft = false) {
  return games.find((game) => game.slug === slug && (includeDraft || game.status === "published")) ?? null;
}
export function getGameById(id: string, includeDraft = false) {
  return games.find((game) => game.id === id && (includeDraft || game.status === "published")) ?? null;
}
export function getGameRouteParams() { return getAllPublishedGames().map(({ slug }) => ({ slug })); }

export function getHomepageSections(includeDraft = false) {
  const pool = includeDraft ? games : getAllPublishedGames();
  return selectHomepage(pool);
}

export function getGameCollections(current: Game, includeDraft = false) {
  const pool = includeDraft ? games : getAllPublishedGames();
  return selectGameCollections(pool, current);
}

export function getPublishedGameFrameOrigins() {
  if (mainGame.status !== "published") return [];
  try { return [new URL(mainGame.player.iframeSrc).origin]; } catch { return []; }
}
