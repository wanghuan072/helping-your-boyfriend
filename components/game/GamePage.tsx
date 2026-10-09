import type { Game } from "@/lib/content/types";
import { getGameCollections, getHomepageSections } from "@/lib/content/load-games";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, siteConfig } from "@/config/site";
import { ContentSection } from "./ContentSection";
import { GameCard } from "./GameCard";
import { GamePlayer } from "./GamePlayer";
import { HeightAwareSidebar } from "./HeightAwareSidebar";

export function GamePage({ game, isHome = false, includeDraft = false }: { game: Game; isHome?: boolean; includeDraft?: boolean }) {
  const collections = isHome ? getHomepageSections(includeDraft) : getGameCollections(game, includeDraft);
  const videos = game.content.flatMap((section) => section.blocks.filter((block) => block.type === "video"));
  const pagePath = isHome ? "/" : `/games/${game.slug}`;
  const breadcrumb = { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") }, ...(!isHome ? [{ "@type": "ListItem", position: 2, name: "More Games", item: absoluteUrl("/games") }, { "@type": "ListItem", position: 3, name: game.title }] : [])] };
  const graph = [{ "@type": "VideoGame", name: game.title, url: absoluteUrl(pagePath), description: game.shortDescription, image: absoluteUrl(game.image.src) }, breadcrumb, ...(isHome ? [{ "@type": "WebSite", name: siteConfig.name, url: absoluteUrl("/") }] : [])];
  return <><JsonLd value={{ "@context": "https://schema.org", "@graph": graph }} /><main id="main-content" className="site-container page-main">
    {isHome ? null : <nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/games">More Games</a><span aria-hidden="true">/</span><span>{game.title}</span></nav>}
    <header className={`game-heading${isHome ? " home-heading" : ""}`}><p className="eyebrow">{isHome ? "Romance, with a darker side" : game.tags.slice(0, 2).join(" · ")}</p><h1>{game.title}</h1><p>{game.shortDescription}</p></header>
    <div className="game-layout">
      <div className="game-primary">
        <GamePlayer game={game} />
        <section className="recommended-section"><div className="section-heading"><span>Keep the story going</span><h2>Recommended Games</h2></div><div className="recommended-grid">{collections.recommended.map((item) => <GameCard key={item.id} game={item} />)}</div></section>
        <article className="game-article">{game.content.filter((section) => section.blocks.some((block) => block.type !== "video")).map((section) => <ContentSection id={section.id} key={section.id} title={section.heading} blocks={section.blocks.filter((block) => block.type !== "video")} />)}</article>
        <nav className="content-links" aria-label="Continue exploring"><a href="/endings">Helping Your Boyfriend Endings</a><a href="/games">Browse all More Games</a></nav>
        {videos.length ? <section className="video-section"><h2>Watch the Game in Action</h2>{videos.map((video) => video.type === "video" ? <article className="video-entry" key={video.videoId}><h3>{video.title}</h3><p>{video.description}</p><div className="video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${video.videoId}`} title={video.title} width="1280" height="720" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div></article> : null)}</section> : null}
      </div>
      <HeightAwareSidebar><GameShelf title="Featured Games" games={collections.featured} /><GameShelf title="New Games" games={collections.newest} /></HeightAwareSidebar>
    </div>
  </main></>;
}

function GameShelf({ title, games }: { title: string; games: Game[] }) {
  return <section className="game-shelf"><h2>{title}</h2><div className="sidebar-grid">{games.map((game) => <GameCard key={game.id} game={game} compact />)}</div></section>;
}
