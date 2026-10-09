import fs from 'node:fs';
import { getPageTdk } from '../seo/tdk.js';
export const readTopicRoutes = () => JSON.parse(fs.readFileSync('data/topics/routes.json','utf8'));
export const topicPath = id => {
  const topic = readTopicRoutes().find(item => item.id === id);
  if (!topic) throw new Error(`Missing topic route: ${id}`);
  return topic.path;
};
export const readGuides = () => fs.readdirSync('data/guides').filter(name=>name.endsWith('.json')).sort().map(name=>{const guide=JSON.parse(fs.readFileSync(`data/guides/${name}`,'utf8'));return {...guide,seo:getPageTdk(topicPath(guide.id))};});
