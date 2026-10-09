import fs from 'node:fs';
import crypto from 'node:crypto';

// Editorial UI dates only, NOT the production Sitemap/IndexNow baseline.
// SEO uses normalized prerendered HTML in scripts/seo instead.
// Page-local content dependencies. Technical assets do not alone constitute
// a new editorial revision (fonts, compression, metadata or styles).
export function publicFingerprints(readText = file => fs.readFileSync(file, 'utf8')) {
  const read = file => JSON.parse(readText(file));
  const hash = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
  const clean = record => Object.fromEntries(Object.entries(record).filter(([key]) => !['publishedAt', 'updatedAt', 'seo'].includes(key)));
  const source = files => files.map(readText);
  const main = read('data/games/main-game.json');
  const routes = read('data/topics/routes.json');
  const topics = routes.map(route => ({ ...route, record: read(`data/guides/${route.id}.json`) }));
  const siteSource = readText('config/site.ts');
  const visibleSite = ['name', 'shortName', 'copyrightYear'].map(key => siteSource.match(new RegExp(`\\b${key}:\\s*([^,\\n]+)`))?.[1]);
  const contactEmail = siteSource.match(/contactEmail:\s*"([^"]+)"/)?.[1];
  const chrome = { source: source(['components/chrome/SiteHeader.tsx', 'components/chrome/SiteFooter.tsx', 'config/navigation.ts']), visibleSite };
  const renderer = readText('components/game/ContentRenderer.tsx');
  const topicSummaries = topics.map(({ id, label, path, record }) => ({ id, label, path, title: record.title, summary: record.summary }));
  const portraits = topics.find(topic => topic.path === '/characters').record.sections
    .filter(section => ['our-protagonist', 'adrian', 'ian', 'oliver'].includes(section.id))
    .map(section => section.blocks.find(block => block.type === 'image'));
  const endings = topics.find(topic => topic.path === '/endings').record.sections
    .filter(section => /^ending-(one|two|three|four)$/.test(section.id)).map(({ id, title }) => ({ id, title }));
  const home = clean(main);
  delete home.credits;
  const content = { '/': hash({ chrome, renderer, record: home, topicSummaries, portraits, endings,
    source: source(['components/game/MainGamePage.tsx', 'components/game/GamePlayer.tsx', 'components/game/ContentSection.tsx']) }) };
  for (const { path, record } of topics.filter(topic => topic.record.status === 'published')) {
    const related = topics.filter(topic => record.relatedGuideIds.includes(topic.id)).map(({ id, path, record }) => ({ id, path, title: record.title, summary: record.summary, cover: record.cover }));
    content[path] = hash({ chrome, renderer, record: clean(record), related,
      source: source(record.routeMap ? ['components/guide/EndingsTree.tsx', 'components/guide/RouteConnections.tsx'] : ['components/guide/NotebookTopic.tsx']) });
  }
  const pages = Object.fromEntries(['privacy', 'terms', 'copyright', 'about', 'contact'].map(name => [`/${name}`, hash({ chrome, contactEmail,
    source: source([`app/${name}/page.tsx`, 'components/chrome/LegalPage.tsx']),
    ...(name === 'about' ? { credits: main.credits, title: main.title } : {}) })]));
  return { content, pages };
}
