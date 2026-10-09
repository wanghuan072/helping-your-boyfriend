import Image from "next/image";
import type { Guide } from "@/lib/content/types";
import { topicPath } from "@/lib/content/topic-routes";
export function GuideCard({ guide }: { guide: Guide }) { return <a className="guide-card" href={topicPath(guide.id)}><span className="guide-media">{guide.cover.src ? <Image src={guide.cover.src} alt={guide.cover.alt} fill sizes="360px" /> : <span className="missing-media">Guide cover</span>}</span><span><strong>{guide.title}</strong><span>{guide.summary}</span></span></a>; }
