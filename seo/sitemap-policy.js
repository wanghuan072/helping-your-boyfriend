/** @template T @param {T[]} entries @returns {T[][]} */
export function partitionSitemap(entries) {
  const result = []; let chunk = []; let bytes = 200;
  for (const entry of entries) {
    const size = Buffer.byteLength(JSON.stringify(entry)) * 2 + 256;
    if (size + 200 > 50 * 1024 * 1024) throw new Error('Sitemap entry exceeds protocol size limit');
    if (chunk.length >= 50_000 || bytes + size > 50 * 1024 * 1024) { result.push(chunk); chunk = []; bytes = 200; }
    chunk.push(entry); bytes += size;
  }
  if (chunk.length) result.push(chunk);
  return result;
}

/** @param {{entries: {indexable: boolean}[]}} manifest */
export function sitemapRewrites(manifest) {
  return { beforeFiles: partitionSitemap(manifest.entries.filter(entry => entry.indexable)).length > 1
    ? [{ source: '/sitemap.xml', destination: '/sitemap-index.xml' }] : [], afterFiles: [], fallback: [] };
}

/** @param {{siteUrl: string, entries: {indexable: boolean, lastModified: string}[]}} manifest */
export function sitemapIndexXml(manifest) {
  const escape = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');
  const shards = partitionSitemap(manifest.entries.filter(entry => entry.indexable));
  return '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + shards.map((entries,id) =>
    `<sitemap><loc>${escape(new URL(`/sitemaps/sitemap/${id}.xml`,manifest.siteUrl).href)}</loc><lastmod>${entries.map(entry => entry.lastModified).sort().at(-1)}</lastmod></sitemap>`).join('\n') + '\n</sitemapindex>\n';
}
