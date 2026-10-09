import type { ContentBlock } from "@/lib/content/types";
import { ContentRenderer } from "./ContentRenderer";

export function ContentSection({ id, title, blocks }: { id: string; title: string; blocks: ContentBlock[] }) {
  return <section id={id}><h2>{title}</h2><ContentRenderer blocks={blocks} /></section>;
}
