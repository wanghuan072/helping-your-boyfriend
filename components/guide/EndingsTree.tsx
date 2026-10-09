import Image from "next/image";
import type { CSSProperties } from "react";
import type { Guide } from "@/lib/content/types";
import { ContentRenderer } from "@/components/game/ContentRenderer";
import { RouteConnections } from "./RouteConnections";
import { PageUpdated } from "@/components/chrome/PageUpdated";
import "./endings-tree.css";

export function EndingsTree({ guide }: { guide: Guide }) {
  const map = guide.routeMap!;
  const sections = new Map(guide.sections.map(section => [section.id, section]));
  const endings = guide.sections.filter(section => /^ending-(one|two|three|four)$/.test(section.id));
  const notice = guide.sections.flatMap(section => section.blocks).find(block => block.type === "callout" && block.label === "Spoilers ahead");
  return <main id="main-content" className={`site-container page-main ending-flow-page`}>
    <nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>Endings</span></nav>
    <header className={"ending-flow-heading"}>
      <p className="eyebrow">Our route notebook / All four endings</p>
      <h1>{guide.title}</h1><p>{guide.summary}</p>
      <nav className={"ending-flow-index"} aria-label="Jump to an ending">{endings.map((ending, index) => <a href={`#${ending.id}`} key={ending.id}><span>0{index + 1}</span>{ending.title.replace(/^Ending \d: /, "")}</a>)}</nav>
      <p className={"ending-flow-legend"}><span>↓ Follow the shared steps</span><span>↳ Follow the labelled choices</span><span>↺ Reload the checkpoint on each card</span></p>
    </header>
    {notice ? <div className={`topic-spoiler-note ending-flow-spoiler`}><ContentRenderer blocks={[notice]} /></div> : null}
    <RouteConnections map={map}>{map.nodes.map(node => {
      const section = sections.get(node.sectionId)!;
      const image = section.blocks.find(block => block.type === "image");
      const outgoing = map.edges.filter(edge => edge.from === node.sectionId);
      return <section key={section.id} id={section.id} data-route-node={section.id} data-lane={node.lane} className={`ending-flow-node ${node.kind === "ending" ? "ending-flow-ending" : ""}`} style={{ "--route-row": node.row, "--route-column": { left: 1, center: 2, right: 3 }[node.lane] } as CSSProperties} aria-labelledby={`${section.id}-title`}>
        <div className={"ending-flow-ribbon"}>{node.label}</div>
        {image?.type === "image" ? <figure className={"ending-flow-picture"}><Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 768px) 100vw, 560px" loading={node.sectionId === map.entry ? "eager" : "lazy"} />{image.caption ? <figcaption>{image.caption}</figcaption> : null}</figure> : null}
        <div className={"ending-flow-copy"}><h2 id={`${section.id}-title`}>{section.title}</h2><ContentRenderer blocks={section.blocks.filter(block => block.type !== "image" && !(block.type === "callout" && block.label === "Spoilers ahead"))} />
          <p className={"ending-flow-checkpoint"}><span aria-hidden="true">↺ </span><strong>Replay from:</strong> {node.checkpoint}</p>
          {outgoing.length ? <nav className={"ending-flow-destinations"} aria-label={`Choices after ${section.title}`}>{outgoing.map(edge => <a key={edge.to} href={`#${edge.to}`}><strong>{edge.label}</strong><span>→ {sections.get(edge.to)!.title}</span></a>)}</nav> : <p className={"ending-flow-finish"}>Route complete. Keep this save separate from our working slots.</p>}
        </div>
      </section>;
    })}</RouteConnections>
    <div className={"ending-flow-after"}>{map.afterTree.map(id => { const section = sections.get(id)!; return <section id={id} key={id}><h2>{section.title}</h2><ContentRenderer blocks={section.blocks} /></section>; })}</div>
    <nav className="content-links" aria-label="Continue exploring"><a href="/">Back to the game ↗</a><a href="/characters">Characters ↗</a><a href="/controls">Controls ↗</a><a href={`#${map.entry}`}>Back to the first choice ↑</a></nav>
    <PageUpdated date={guide.updatedAt} />
  </main>;
}
