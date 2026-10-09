import Image from "next/image";
import type { Guide } from "@/lib/content/types";
import { ContentRenderer } from "@/components/game/ContentRenderer";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/config/site";
import { getAllPublishedGuides } from "@/lib/content/load-guides";
import { topicPath, topicRoutes } from "@/lib/content/topic-routes";
import { EndingsTree } from "./EndingsTree";
import { NotebookTopic } from "./NotebookTopic";
import { PageUpdated } from "@/components/chrome/PageUpdated";

export function GuideArticle({ guide }: { guide: Guide }) {
  const pagePath = topicPath(guide.id);
  const definition = topicRoutes.find(topic => topic.id === guide.id)!;
  const spoilerNotice = guide.sections.flatMap(section => section.blocks).find(block => block.type === "callout" && block.label === "Spoilers ahead");
  const endingRoutes = guide.sections.filter(section => /^ending-(one|two|three|four)$/.test(section.id));
  const related = guide.relatedGuideIds.map(id => getAllPublishedGuides().find(item => item.id === id)).filter((item): item is Guide => Boolean(item));
  return <>
    <JsonLd value={{ "@context": "https://schema.org", "@graph": [
      { "@type": "Article", headline: guide.title, description: guide.summary, mainEntityOfPage: absoluteUrl(pagePath), image: absoluteUrl(guide.cover.src), datePublished: guide.publishedAt, dateModified: guide.updatedAt },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") }, { "@type": "ListItem", position: 2, name: definition.label, item: absoluteUrl(pagePath) }] },
    ] }} />
    {guide.routeMap ? <EndingsTree guide={guide} /> : ["Characters", "Controls"].includes(definition.label) ? <NotebookTopic guide={guide} label={definition.label as "Characters" | "Controls"} /> : <main id="main-content" className={`site-container page-main topic-page topic-${definition.label.toLowerCase()}`}>
      <nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>{definition.label}</span></nav>
      <header className="guide-heading topic-heading"><div className="topic-heading-copy"><p className="eyebrow">Helping Your Boyfriend / {definition.label}</p><h1>{guide.title}</h1><p>{guide.summary}</p><div className="tag-list">{guide.tags.map(tag => <span key={tag}>{tag}</span>)}</div><PageUpdated date={guide.updatedAt} className="guide-meta" /></div><Image src={guide.cover.src} alt={guide.cover.alt} width={guide.cover.width} height={guide.cover.height} preload /></header>
      {spoilerNotice ? <div className="topic-spoiler-note"><ContentRenderer blocks={[spoilerNotice]} /></div> : null}
      {endingRoutes.length ? <nav className="ending-route-index" aria-label="Jump to an ending">{endingRoutes.map((section, index) => <a key={section.id} href={`#${section.id}`}><span aria-hidden="true">0{index + 1}</span><strong>{section.title}</strong><p>{section.summary}</p><small>Outcome & unlock steps ↓</small></a>)}</nav> : null}
      <div className="guide-layout"><article className="guide-article topic-document">{guide.sections.map((section, index) => <section key={section.id} id={section.id} className={endingRoutes.includes(section) ? "topic-chapter ending-route-chapter" : "topic-chapter"}><div className="chapter-heading"><span className="chapter-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h2>{section.title}</h2></div><ContentRenderer blocks={section.blocks.filter(block => !(block.type === "callout" && block.label === "Spoilers ahead"))} /></section>)}<nav className="content-links" aria-label="Continue exploring">{related.map(item => <a key={item.id} href={topicPath(item.id)}>{topicRoutes.find(topic => topic.id === item.id)!.label}<span aria-hidden="true"> ↗</span></a>)}<a href="/">Back to the game</a></nav></article><aside className="guide-toc"><strong>In our notebook</strong>{guide.sections.map((section, index) => <a key={section.id} href={`#${section.id}`}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{section.title}</a>)}</aside></div>
    </main>}
  </>;
}
