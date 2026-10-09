import Image from "next/image";
import type { Game } from "@/lib/content/types";

export function GameCard({ game, compact = false }: { game: Game; compact?: boolean }) {
  return <a className={`game-card${compact ? " game-card-compact" : ""}`} href={`/games/${game.slug}`}>
    <span className="card-media" style={{ aspectRatio: `${game.image.width ?? 16} / ${game.image.height ?? 9}` }}>{game.image.src ? <Image src={game.image.src} alt={game.image.alt} fill sizes={compact ? "(max-width: 768px) 44vw, 185px" : "(max-width: 768px) 44vw, 300px"} /> : <span className="missing-media">Game cover</span>}</span>
    <span className="card-copy"><strong>{game.title}</strong><span className="card-tags">{game.tags.slice(0, 2).join(" · ")}</span>{compact ? null : <span className="card-description">{game.shortDescription}</span>}</span>
  </a>;
}
