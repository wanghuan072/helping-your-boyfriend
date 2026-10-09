import { GuideArticle } from "./GuideArticle";
import { getAllPublishedGuides } from "@/lib/content/load-guides";
import { topicPath } from "@/lib/content/topic-routes";
import { pageMetadata } from "@/lib/seo";

function topicById(id: string) {
  const topic = getAllPublishedGuides().find(item => item.id === id);
  if (!topic) throw new Error(`Missing published topic: ${id}`);
  return topic;
}
export function topicMetadata(id: string) {
  const topic = topicById(id);
  return pageMetadata(topic.seo.title, topic.seo.description, topicPath(id), "article", topic.seo.keywords);
}
export function TopicPage({ id }: { id: string }) {
  return <GuideArticle guide={topicById(id)} />;
}
