import Image from "next/image";
import type { ContentBlock } from "@/lib/content/types";

export function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return <>{blocks.map((block, index) => {
    if (block.type === "paragraph") return <p key={index}>{block.text}</p>;
    if (block.type === "image") return <figure key={index}><Image src={block.src} alt={block.alt} width={block.width} height={block.height} loading="lazy" />{block.caption ? <figcaption>{block.caption}</figcaption> : null}</figure>;
    if (block.type === "list") { const Tag = block.style === "ordered" ? "ol" : "ul"; return <Tag key={index}>{block.items.map((item) => <li key={item}>{item}</li>)}</Tag>; }
    if (block.type === "steps") return <ol className="steps" key={index}>{block.items.map((item) => <li key={item.title}><strong>{item.title}</strong><p>{item.body}</p></li>)}</ol>;
    if (block.type === "callout") return <aside className={`callout callout-${block.tone}`} key={index}>{block.label ? <strong>{block.label}</strong> : null}<p>{block.body}</p></aside>;
    if (block.type === "table") return <div className="table-wrap" key={index}><table><thead><tr>{block.columns.map((header) => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>;
    if (block.type === "faq") return <div className="faq-list" key={index}>{block.items.map((item) => <div key={item.question}><p><strong>{item.question}</strong></p><p>{item.answer}</p></div>)}</div>;
    return null;
  })}</>;
}
