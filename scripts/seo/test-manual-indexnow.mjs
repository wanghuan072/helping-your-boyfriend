import assert from 'node:assert/strict';
import { normalizeUrls, submitManual, siteUrl } from './manual-indexnow.mjs';

const key = 'mock-key-123456';
assert.deepEqual(normalizeUrls(['/', '/endings', '/endings']), [siteUrl + '/', siteUrl + '/endings']);
for (const value of ['https://other.example/', '//other.example/', '/endings/', '/?a=1', '/#x', 'https://user:pass@helpingyourboyfriend.org/']) assert.throws(() => normalizeUrls([value]));
assert.throws(() => normalizeUrls([]));
let posts = 0;
const fetcher = async (url, options) => {
  assert.equal(options.redirect, 'manual');
  if (url === `${siteUrl}/${key}.txt`) return new Response(key);
  assert.equal(url, 'https://api.indexnow.org/indexnow');
  assert.equal(options.method, 'POST');
  assert.deepEqual(JSON.parse(options.body), { host: 'helpingyourboyfriend.org', key, keyLocation: `${siteUrl}/${key}.txt`, urlList: [siteUrl + '/endings'] });
  posts++;
  return new Response('', { status: 202 });
};
const dry = await submitManual({ urls: ['/endings'], dryRun: true, fetcher: () => { throw new Error('Dry run must not perform any HTTP request'); } });
assert.equal(dry.dryRun, true);
assert.equal((await submitManual({ urls: ['/endings'], key, fetcher })).status, 202);
assert.equal(posts, 1);
await assert.rejects(() => submitManual({ urls: ['/endings'], key: '' }), /INDEXNOW_KEY/);
await assert.rejects(() => submitManual({ urls: ['/endings'], key, fetcher: async () => new Response('wrong') }), /未提交/);
await assert.rejects(() => submitManual({ urls: ['/endings'], key, fetcher: async () => new Response('', { status: 302 }) }), /未提交/);
for (const status of [200, 400, 403, 422, 429, 500]) {
  let count = 0;
  const request = () => submitManual({ urls: ['/endings'], key, fetcher: async (url, options) => {
    if (options.method !== 'POST') return new Response(key);
    count++;
    return new Response('', { status });
  } });
  if (status === 200) assert.equal((await request()).accepted, 1);
  else await assert.rejects(request, new RegExp(String(status)));
  assert.equal(count, 1, 'No hidden automatic retries');
}
await assert.rejects(() => submitManual({ urls: Array.from({ length: 10001 }, (_, i) => `/p${i}`), key, dryRun: true }), /10,000/);
console.log('手动 IndexNow 测试通过：规范网址、去重、预览零请求、密钥检查、200/202 及错误状态。所有请求均为模拟，未实际提交。');
