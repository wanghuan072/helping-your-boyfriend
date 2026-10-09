"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Game } from "@/lib/content/types";
import { parseSafeFrameUrl } from "@/lib/player/frame-policy";

type State = "idle" | "loading" | "opened" | "failed";

export function GamePlayer({ game, compactUnavailable = false }: { game: Game; compactUnavailable?: boolean }) {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const shellRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safeUrl = parseSafeFrameUrl(game.player.iframeSrc);
  const clearTimer = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); timeoutRef.current = null; };
  useEffect(() => () => { clearTimer(); if (document.fullscreenElement) void document.exitFullscreen(); }, []);
  useEffect(() => {
    const sync = () => { if (!document.fullscreenElement) setExpanded(false); };
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const play = () => {
    clearTimer();
    if (!safeUrl) { setState("failed"); setMessage("Browser play is not available here yet. We can explore Characters, Endings and Controls instead."); return; }
    setMessage(""); setFrameKey((value) => value + 1); setState("loading");
    timeoutRef.current = setTimeout(() => { setState("failed"); setMessage("The player did not open in time. Try again. Game availability depends on the external host."); }, game.player.loadTimeoutMs);
  };
  const reload = () => {
    if (window.confirm("Reload the game? Unsaved progress may be lost.")) play();
  };
  const browserFullscreen = async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await shellRef.current?.requestFullscreen(); }
    catch { setMessage("Browser fullscreen could not be started."); }
  };
  return <section className={`player-shell${expanded ? " is-expanded" : ""}${compactUnavailable && !safeUrl ? " is-unavailable" : ""}`} ref={shellRef} aria-label={`${game.title} player`}>
    <div className="player-stage" style={{ aspectRatio: game.player.aspectRatio ?? "16 / 9" }}>
      {state === "idle" || state === "failed" ? <>
        {compactUnavailable && !safeUrl ? null : game.image.src ? <Image src={game.image.src} alt={game.image.alt} fill sizes="(max-width: 768px) 100vw, 900px" className="player-cover" preload /> : <div className="missing-media" role="img" aria-label="Game cover">{game.title}</div>}
        <div className="player-scrim" />
        <div className="player-action"><button type="button" className="play-button" onClick={play}><span aria-hidden="true">▶ </span>{state === "failed" ? "Retry" : "Play Now"}</button>{message ? <p role="alert">{message}</p> : !safeUrl ? <p>Browser play is unavailable here. We can explore the story and guides below.</p> : null}</div>
      </> : null}
      {(state === "loading" || state === "opened") && safeUrl ? <>
        {state === "loading" ? <div className="player-loading" role="status"><span className="spinner" aria-hidden="true" />Opening the player…</div> : null}
        <iframe
          key={frameKey}
          src={safeUrl.toString()} title={`${game.title} game`} allow={game.player.permissionsPolicy.join("; ")} referrerPolicy={game.player.referrerPolicy ?? undefined}
          sandbox={game.player.sandbox?.join(" ")} onLoad={() => { clearTimer(); setState("opened"); }}
        />
      </> : null}
    </div>
    <div className="player-bar"><strong>{game.title}</strong><div className="player-controls">
      {state === "loading" || state === "opened" ? <button type="button" onClick={reload} aria-label="Reload game" title="Reload game (save progress first)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 6V2l-2 2a9 9 0 1 0 4 9h-2a7 7 0 1 1-3-7l-3 3h8V6z" /></svg><span>Reload game</span></button> : null}
      <button type="button" onClick={() => setExpanded((value) => !value)} aria-pressed={expanded} aria-label={expanded ? "Exit webpage fullscreen" : "Webpage fullscreen"}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4zM8 9v6h8V9z" /></svg><span>Webpage Fullscreen</span></button>
      <button type="button" onClick={browserFullscreen} aria-label="Browser fullscreen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9V3h6v2H5v4H3zm12-6h6v6h-2V5h-4V3zM3 15h2v4h4v2H3v-6zm16 0h2v6h-6v-2h4v-4z" /></svg><span>Browser Fullscreen</span></button>
    </div></div>
    {state === "loading" || state === "opened" ? <p className="player-status" role="status">{message || (state === "loading" ? "Opening the external player. The game may continue loading after it opens." : "Wait for the game’s start screen. If loading stalls, use Reload game. Save progress before reloading.")}</p> : null}
  </section>;
}
