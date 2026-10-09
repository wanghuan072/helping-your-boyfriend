import Image from "next/image";
import type { ContentBlock, Guide } from "@/lib/content/types";
import { ContentRenderer } from "@/components/game/ContentRenderer";
import { PageUpdated } from "@/components/chrome/PageUpdated";
import "./notebook-topic.css";

type Section = Guide["sections"][number];
type Picture = Extract<ContentBlock, { type: "image" }>;
const pictureOf = (section: Section) => section.blocks.find((block): block is Picture => block.type === "image");
const withoutPicture = (section: Section) => section.blocks.filter(block => block.type !== "image" && !(block.type === "callout" && block.label === "Spoilers ahead"));

function Photo({ image, portrait = false, preload = false }: { image: Picture; portrait?: boolean; preload?: boolean }) {
  return <figure className={`notebook-photo${portrait ? " notebook-portrait" : ""}`}>
    <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={portrait ? "(max-width: 768px) 80vw, 400px" : "(max-width: 768px) 90vw, 640px"} loading={preload ? "eager" : "lazy"} fetchPriority={preload ? "high" : "auto"} />
    {image.caption ? <figcaption>{image.caption}</figcaption> : null}
  </figure>;
}

function Dossier({ section, featured = false }: { section: Section; featured?: boolean }) {
  const image = pictureOf(section);
  return <section id={section.id} className={`notebook-paper notebook-dossier${featured ? " notebook-featured" : ""}`}>
    <header className="notebook-dossier-heading"><h2>{section.title}</h2>{section.summary ? <p>{section.summary}</p> : null}</header>
    <div className="notebook-dossier-body">
      {image ? <Photo image={image} portrait /> : null}
      <div className="notebook-observations">{withoutPicture(section).map((block, index) => block.type === "callout" ? <div key={index}><h3>{block.label}</h3><p>{block.body}</p></div> : <ContentRenderer key={index} blocks={[block]} />)}</div>
    </div>
  </section>;
}

function Characters({ guide }: { guide: Guide }) {
  const section = (id: string) => guide.sections.find(item => item.id === id)!;
  const introduction = section("meet-the-cast");
  const cast = introduction.blocks.find(block => block.type === "table")!;
  const profileIds = ["our-protagonist", "adrian", "ian", "oliver"];
  const profiles = profileIds.map(section);
  const spoiler = guide.sections.flatMap(item => item.blocks).find(block => block.type === "callout" && block.label === "Spoilers ahead");
  const credits = section("voice-cast");
  const voices = credits.blocks.find(block => block.type === "table")!;
  return <>
    <nav className="notebook-cast" aria-label="Meet the characters">{profiles.map((profile, index) => {
      const image = pictureOf(profile)!;
      return <a key={profile.id} className="notebook-cast-card" href={`#${profile.id}`}><Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 768px) 42vw, 300px" loading="eager" fetchPriority={index === 0 ? "high" : "auto"} /><strong>{cast.rows[index][0]}</strong><span>{cast.rows[index][1]}</span></a>;
    })}</nav>
    {spoiler ? <div className="notebook-spoiler"><ContentRenderer blocks={[spoiler]} /></div> : null}
    <nav className="notebook-anchors" aria-label="On this page">{["adrian", "ian", "oliver", "our-protagonist", "voice-cast"].map(id => <a key={id} href={`#${id}`}>{id === "voice-cast" ? "Voice cast" : cast.rows[profileIds.indexOf(id)][0]}</a>)}</nav>
    <Dossier section={section("adrian")} featured />
    <section id={introduction.id} className="notebook-paper notebook-relations"><h2>{introduction.title}</h2>
      <div className="notebook-relation-map" aria-label="Character connections">
        <a className="notebook-relation-card" href="#adrian"><strong>{cast.rows[1][0]}</strong><span>{cast.rows[1][1]}</span></a>
        <span className="notebook-relation-line" aria-hidden="true">↔</span>
        <div className="notebook-relation-centre"><strong>{cast.rows[0][0]}</strong><span>{cast.rows[0][1]}</span></div>
        <span className="notebook-relation-line" aria-hidden="true">↔</span>
        <div className="notebook-relation-branches">{[2, 3].map(index => <a className="notebook-relation-card" key={index} href={`#${profileIds[index]}`}><strong>{cast.rows[index][0]}</strong><span>{cast.rows[index][1]}</span></a>)}</div>
      </div>
      <div className="notebook-context"><ContentRenderer blocks={introduction.blocks.filter(block => block.type !== "table")} /></div>
    </section>
    <div className="notebook-dossier-pair"><Dossier section={section("ian")} /><Dossier section={section("oliver")} /></div>
    <Dossier section={section("our-protagonist")} featured />
    <section id={credits.id} className="notebook-paper notebook-credits"><h2>{credits.title}</h2><dl>{voices.rows.map(([name, performer]) => <div key={name}><dt>{name}</dt><dd>{performer}</dd></div>)}</dl><ContentRenderer blocks={credits.blocks.filter(block => block.type !== "table")} /></section>
  </>;
}

function ManualTask({ section, number }: { section: Section; number: string }) {
  const image = pictureOf(section);
  const steps = section.blocks.find(block => block.type === "steps");
  const prompts = section.id === "qte-controls" ? section.blocks.filter(block => block.type === "callout" && block.tone === "info") : [];
  return <section id={section.id} className="notebook-paper notebook-task">
    <header><h2><span>{number} / </span>{section.title}</h2>{section.summary ? <p>{section.summary}</p> : null}</header>
    <div className="notebook-task-inner">
      {image && steps ? <div className="notebook-task-spread"><Photo image={image} /><ContentRenderer blocks={[steps]} /></div> : null}
      {prompts.length ? <div className="notebook-prompt-grid">{prompts.map((block, index) => block.type === "callout" ? <div key={block.label}><h3>{block.label}</h3><div className="notebook-keycaps" aria-label={index === 0 ? "Arrow keys" : "Space key"}>{(index === 0 ? ["↑", "←", "↓", "→"] : ["Space"]).map(key => <kbd key={key}>{key}</kbd>)}</div><p>{block.body}</p></div> : null)}</div> : null}
      <div className={section.id === "saves-skipping-and-recovery" ? "notebook-recovery" : "notebook-task-notes"}><ContentRenderer blocks={section.blocks.filter(block => block.type !== "image" && !(image && steps && block.type === "steps") && !prompts.includes(block))} /></div>
    </div>
  </section>;
}

function Controls({ guide }: { guide: Guide }) {
  const section = (id: string) => guide.sections.find(item => item.id === id)!;
  const quick = section("before-you-start");
  const shortcuts = quick.blocks.find(block => block.type === "table")!;
  const tasks = ["dialogue-and-menu", "drag-actions", "qte-controls", "saves-skipping-and-recovery"].map(section);
  const issues = section("questions");
  const devices = section("device-questions");
  return <>
    <section id={quick.id} className="notebook-paper notebook-quick"><h2>{quick.title}</h2><dl>{shortcuts.rows.map(([key, action, body]) => <div key={key}><dt><kbd>{key}</kbd><strong>{action}</strong></dt><dd>{body}</dd></div>)}</dl><ContentRenderer blocks={quick.blocks.filter(block => block.type !== "table")} /></section>
    <nav className="notebook-anchors" aria-label="On this page">{tasks.map(task => <a key={task.id} href={`#${task.id}`}>{task.title}</a>)}<a href="#questions">Common issues</a></nav>
    {tasks.map((task, index) => <ManualTask key={task.id} section={task} number={String(index + 1).padStart(2, "0")} />)}
    <section id={issues.id} className="notebook-paper notebook-issues"><h2>{issues.title}</h2><div><ContentRenderer blocks={issues.blocks} /></div></section>
    <section id={devices.id} className="notebook-paper notebook-device"><h2>{devices.title}</h2><ContentRenderer blocks={devices.blocks} /></section>
  </>;
}

export function NotebookTopic({ guide, label }: { guide: Guide; label: "Characters" | "Controls" }) {
  return <main id="main-content" className={`site-container page-main notebook-topic notebook-${label.toLowerCase()}`}>
    <nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>{label}</span></nav>
    <header className="notebook-heading"><h1>{guide.title}</h1><p>{guide.summary}</p></header>
    {label === "Characters" ? <Characters guide={guide} /> : <Controls guide={guide} />}
    <nav className="notebook-next" aria-label="Continue exploring"><a href="/endings">Explore the endings <span aria-hidden="true">→</span></a><a href={label === "Characters" ? "/controls" : "/characters"}>{label === "Characters" ? "Controls" : "Characters"} <span aria-hidden="true">→</span></a><a href="/">Back to the game <span aria-hidden="true">→</span></a></nav>
    <PageUpdated date={guide.updatedAt} />
  </main>;
}
