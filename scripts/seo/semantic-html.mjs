import { parse } from 'parse5';
import { createHash } from 'node:crypto';

export const fingerprintVersion = 'semantic-html-v1';
const space = value => value.replace(/\s+/g, ' ').trim();
const assetUrl = value => {
  if (!value) return '';
  const absolute = /^[a-z][a-z0-9+.-]*:/i.test(value);
  const url = new URL(value, 'https://helpingyourboyfriend.org');
  url.searchParams.delete('dpl'); // Vercel deployment affinity, not a media revision.
  return absolute ? url.href : `${url.pathname}${url.search}${url.hash}`;
};
// Cloudflare email obfuscation is transport noise. Decode its public XOR payload
// to the same plain-text email authored by this project; do not hash protection links.
const email = node => {
  const value = node.attrs?.find(attr => attr.name === 'data-cfemail')?.value;
  if (!value || !/^(?:[a-f0-9]{2}){2,}$/i.test(value)) return null;
  const bytes = Buffer.from(value, 'hex');
  return new TextDecoder().decode(Uint8Array.from(bytes.subarray(1), byte => byte ^ bytes[0]));
};
const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().filter(key => !['dateModified', 'datePublished'].includes(key)).map(key => [key, stable(value[key])])) : value;

// Parse real prerendered HTML, never React flight scripts or raw source/CSS.
// This also follows cross-page dependencies actually rendered by shared templates.
export function seoInputs(html) {
  const result = { language: '', title: '', metadata: [], links: [], headings: [], media: [], structuredData: [], body: '' };
  const text = [];
  let canonical;
  let indexable = true;
  function visit(node, inBody = false) {
    const tag = node.tagName;
    const a = Object.fromEntries((node.attrs ?? []).map(attr => [attr.name, attr.value]));
    const children = node.childNodes ?? [];
    const contents = n => email(n) ?? (n.nodeName === '#text' ? n.value : (n.childNodes ?? []).map(contents).join(''));
    if (tag === 'html') result.language = a.lang ?? '';
    if (tag === 'script') {
      if (a.type === 'application/ld+json') result.structuredData.push(stable(JSON.parse(contents(node))));
      return;
    }
    if (['style', 'svg', 'template'].includes(tag) || (tag === 'time' && /^\d{4}-\d{2}-\d{2}$/.test(a.datetime ?? '') && /^Updated\s/.test(contents(node)))) return;
    if (tag === 'body') inBody = true;
    if (tag === 'title') result.title = space(contents(node));
    if (tag === 'meta') {
      const name = (a.name ?? a.property ?? '').toLowerCase();
      if (/^(description|keywords|robots|googlebot|bingbot|og:.+|twitter:.+)$/.test(name)) {
        result.metadata.push([name, a.content ?? '']);
        if (['robots', 'googlebot', 'bingbot'].includes(name) && /(?:^|[,\s])(noindex|none)(?:$|[,\s])/i.test(a.content ?? '')) indexable = false;
      }
    }
    if (tag === 'link' && a.rel === 'canonical') {
      if (canonical) throw new Error('Multiple HTML canonical links');
      canonical = a.href;
    }
    if (tag === 'link' && a.rel === 'alternate') result.links.push([a.rel, a.hreflang ?? '', a.href ?? '']);
    if (inBody && tag === 'a' && !a.href?.startsWith('/cdn-cgi/l/email-protection')) result.links.push(['a', a.href ?? '', a.rel ?? '', space(contents(node))]);
    if (inBody && /^h[1-6]$/.test(tag ?? '')) result.headings.push([tag, space(contents(node))]);
    if (inBody && ['img', 'iframe', 'video', 'audio', 'source'].includes(tag)) result.media.push([tag, assetUrl(a.src), a.alt ?? '', a.title ?? '', assetUrl(a.poster)]);
    if (inBody && email(node)) { text.push(email(node)); return; }
    if (inBody && node.nodeName === '#text') text.push(node.value.replace(/Copyright © \d{4}/g, 'Copyright © [year]'));
    for (const child of children) visit(child, inBody);
  }
  visit(parse(html));
  result.body = space(text.join(' '));
  result.metadata.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  if (!canonical || !result.title || !result.headings.some(([tag]) => tag === 'h1')) throw new Error('Incomplete indexable HTML: missing canonical/title/H1');
  return { inputs: { ...result, canonical }, canonical, indexable };
}

export function coreImages(html, origin) {
  const inputs = seoInputs(html).inputs;
  const images = [...inputs.media.filter(([tag, , alt]) => tag === 'img' && alt).map(([, src]) => src),
    ...inputs.metadata.filter(([name]) => ['og:image', 'twitter:image'].includes(name)).map(([, src]) => src)];
  return [...new Set(images.map(src => new URL(src, origin)).filter(url => url.origin === origin && url.pathname.startsWith('/images/')).map(url => url.pathname))].sort();
}

export function fingerprint(html, mediaDigests = {}) {
  return `sha256:${createHash('sha256').update(JSON.stringify({ ...seoInputs(html).inputs, mediaDigests })).digest('hex')}`;
}
