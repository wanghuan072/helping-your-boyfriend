import definitions from "@/data/topics/routes.json";

export const topicRoutes = definitions;
export function topicPath(id: string) {
  const topic = topicRoutes.find(item => item.id === id);
  if (!topic) throw new Error(`Missing topic route: ${id}`);
  return topic.path;
}
