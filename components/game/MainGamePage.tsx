import Image from "next/image";
import type { ContentBlock, Game } from "@/lib/content/types";
import { getAllPublishedGuides } from "@/lib/content/load-guides";
import { topicRoutes } from "@/lib/content/topic-routes";
import { absoluteUrl } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { ContentSection } from "./ContentSection";
import { ContentRenderer } from "./ContentRenderer";
import { GamePlayer } from "./GamePlayer";
import { PageUpdated } from "@/components/chrome/PageUpdated";

export function MainGamePage({ game }: { game: Game }) {
  const topics = topicRoutes.map(route => ({ ...route, content: getAllPublishedGuides().find(item => item.id === route.id)! }));
  const find = (id: string) => game.content.find(section => section.id === id)!;
  const tonight = find("tonight-with-adrian");
  const opening = find("the-nightly-routine");
  const cast = find("cast-notes");
  const controls = find("controls-at-a-glance");
  const faq = find("before-another-run");
  const replay = find("replaying-four-endings");
  const castTable = cast.blocks.find(block => block.type === "table");
  const characterSections = topics.find(topic => topic.path === "/characters")!.content.sections;
  const portraitIds = ["our-protagonist", "adrian", "ian", "oliver"];
  const castPortraits = portraitIds.map(id => characterSections.find(section => section.id === id)?.blocks.find(block => block.type === "image"));
  const endingSections = topics.find(topic => topic.path === "/endings")!.content.sections;
  const endingTable = replay.blocks.find(block => block.type === "table");
  const controlTable = controls.blocks.find(block => block.type === "table");
  const dollImage = find("dolls-and-timing").blocks.find(block => block.type === "image");
  const videos = game.content.flatMap(section => section.blocks).filter(block => block.type === "video");
  const special = new Set([tonight.id, opening.id, cast.id, controls.id, faq.id, replay.id]);
  const sections = game.content.filter(section => !special.has(section.id) && section.blocks.some(block => block.type !== "video"));
  const withoutVideo = (blocks: ContentBlock[]) => blocks.filter(block => block.type !== "video");

  return <>
    <JsonLd value={{ "@context": "https://schema.org", "@graph": [
      { "@type": "VideoGame", name: game.title, description: game.shortDescription, image: absoluteUrl(game.image.src), url: absoluteUrl("/") },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") }] },
    ] }} />
    <main id="main-content" className="site-container page-main scrapbook-page">
      <header className="scrapbook-title"><div><p className="eyebrow">{game.tags.slice(0, 2).join(" / ")}</p><h1>Play {game.title} Online</h1></div><p className="handwritten-note">Read. Choose. Replay.</p></header>
      <div className="scrapbook-player-layout">
        <section id="game-player" className="scrapbook-player-paper" aria-label="Play Helping Your Boyfriend"><GamePlayer game={game} /></section>
        <aside className="paper-note tonight-note" aria-label="Before playing"><h2>{tonight.heading}</h2><ContentRenderer blocks={tonight.blocks.filter(block => block.type === "paragraph")} /><p className="eyebrow">How to start</p><div className="quick-keys"><div><kbd>Click</kbd><span>Advance text</span></div><div><kbd>Enter</kbd><span>Confirm / Next</span></div><div><kbd>L</kbd><span>Dialogue log</span></div></div><nav aria-label="Player help">{[...topics].reverse().map(topic => <a href={topic.path} key={topic.id}>{topic.label}<span aria-hidden="true">↗</span></a>)}</nav><ContentRenderer blocks={tonight.blocks.filter(block => block.type === "callout")} /></aside>
      </div>
      <nav className="scrapbook-topic-links" aria-label="Explore Helping Your Boyfriend">{topics.map((topic, index) => <a className="paper-note" key={topic.id} href={topic.path}><span className="chapter-number" aria-hidden="true">0{index + 1}</span><div><h2>{topic.label}</h2><p>{topic.content.summary}</p></div><span className="topic-symbol" aria-hidden="true">{["♡", "♧", "✂"][index]}</span><span className="topic-arrow" aria-hidden="true">↗</span></a>)}</nav>
      <article className="scrapbook-body">
        <section id={opening.id} className="paper-note routine-note"><div><p className="eyebrow">Inside the story</p><h2>{opening.heading}</h2><ContentRenderer blocks={opening.blocks} /></div>{dollImage?.type === "image" ? <figure className="scrapbook-photo"><Image src={dollImage.src} alt={dollImage.alt} width={dollImage.width} height={dollImage.height} loading="lazy" /><figcaption>{dollImage.caption ?? dollImage.alt}</figcaption></figure> : null}</section>
        <section id={cast.id} className="paper-note cast-note"><div className="scrapbook-section-heading"><h2>{cast.heading}</h2><ContentRenderer blocks={cast.blocks.filter(block => block.type === "paragraph")} /></div><div className="cast-grid">{castTable?.type === "table" ? castTable.rows.map((row, index) => {
          const portrait = castPortraits[index];
          return <div className="cast-card" key={row[0]}>{portrait?.type === "image" ? <Image className="cast-portrait" src={portrait.src} alt={portrait.alt} width={portrait.width} height={portrait.height} /> : null}<h3>{row[0]}</h3><p className="cast-role">{row[1]}</p><p>{row[2]}</p></div>;
        }) : null}</div><a className="scrapbook-text-link" href="/characters">Meet the characters ↗</a></section>
        <section id={replay.id} className="ending-note">
          <div className="ending-heading"><div><h2>{replay.heading}</h2><ContentRenderer blocks={replay.blocks.filter(block => block.type === "paragraph")} /></div><a href="/endings">Explore the endings <span aria-hidden="true">↗</span></a></div>
          <nav className="ending-overview-grid" aria-label="The four endings">{endingTable?.type === "table" ? endingTable.rows.map((row, index) => {
            const ending = endingSections.find(section => section.id === row[0]);
            if (!ending) return null;
            return <a key={ending.id} href={`/endings#${ending.id}`}><span className="ending-overview-number" aria-hidden="true">0{index + 1}</span><div><h3>{ending.title.replace(/^Ending \d+: /, "")}</h3><p>{row[1]}</p></div><span className="ending-overview-arrow" aria-hidden="true">↗</span></a>;
          }) : null}</nav>
        </section>
        <div className="scrapbook-help-grid"><section id={controls.id} className="paper-note controls-note"><h2>{controls.heading}</h2><div className="control-card-grid">{controlTable?.type === "table" ? controlTable.rows.map(row => <div key={row[0]}><h3>{row[0]}</h3><kbd>{row[1]}</kbd><p>{row[2]}</p></div>) : null}</div><a className="scrapbook-text-link" href="/controls">All controls & minigames ↗</a></section><section id={faq.id} className="paper-note faq-note"><h2>{faq.heading}</h2><ContentRenderer blocks={faq.blocks} /></section></div>
        <div className="scrapbook-reading-layout"><div className="scrapbook-reading">{sections.map(section => <ContentSection key={section.id} id={section.id} title={section.heading} blocks={withoutVideo(section.blocks).filter(block => block !== dollImage)} />)}</div><aside className="paper-note scrapbook-toc"><p className="eyebrow">In our notebook</p><nav aria-label="On this page">{[opening, cast, replay, controls, faq, ...sections].map(section => <a key={section.id} href={`#${section.id}`}>{section.heading}</a>)}</nav></aside></div>
      </article>
      {videos.length ? <section className="paper-note scrapbook-video"><p className="eyebrow">Gameplay · story spoilers</p><h2>See the scenes in motion</h2>{videos.map(video => <article className="video-entry" key={video.videoId}><h3>{video.title}</h3><p>{video.description}</p><div className="video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${video.videoId}`} title={video.title} width="1280" height="720" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div></article>)}</section> : null}
      <PageUpdated date={game.updatedAt} />
    </main>
  </>;
}
