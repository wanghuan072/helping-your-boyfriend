import type { Metadata } from "next";
import { MainGamePage } from "@/components/game/MainGamePage";
import mainGame from "@/data/games/main-game.json";
import type { Game } from "@/lib/content/types";
import { pageMetadata } from "@/lib/seo";
import { staticTdk } from "@/seo/tdk.js";

const game = { ...mainGame, seo: staticTdk.home } as Game;
export const metadata: Metadata = pageMetadata(game.seo.title, game.seo.description, "/", "website", game.seo.keywords);
export default function Home() { return <MainGamePage game={game} />; }
