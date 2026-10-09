export const siteUrl = 'https://helpingyourboyfriend.org';

export function normalizeUrls(values) {
  if (!values.length) throw new Error('请指定网址，或使用 --all 提交线上全部页面。');
  return [...new Set(values.map(value => {
    const url = new URL(value, siteUrl);
    if (url.origin !== siteUrl || url.username || url.password || url.search || url.hash || (url.pathname !== '/' && url.pathname.endsWith('/'))) throw new Error('仅支持本站规范网址，不允许其他域名、查询参数或片段。');
    return url.href;
  }))];
}

export async function submitManual({ urls, key, dryRun = false, fetcher = fetch }) {
  const urlList = normalizeUrls(urls);
  if (urlList.length > 10_000) throw new Error('一次最多提交 10,000 个网址，请分次提交。');
  if (dryRun) return { dryRun: true, urls: urlList };
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(key ?? '')) throw new Error('请在 .env.local 中配置有效的 INDEXNOW_KEY。');
  const keyLocation = `${siteUrl}/${key}.txt`;
  const verification = await fetcher(keyLocation, { redirect: 'manual', signal: AbortSignal.timeout(15_000) });
  if (verification.status !== 200 || (await verification.text()) !== key) throw new Error('线上密钥文件不可访问或内容不匹配，未提交网址。');
  const response = await fetcher('https://api.indexnow.org/indexnow', {
    method: 'POST', redirect: 'manual', signal: AbortSignal.timeout(20_000),
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(siteUrl).host, key, keyLocation, urlList }),
  });
  const explanations = { 400: '请求格式错误', 403: 'IndexNow 无法验证密钥', 422: '网址或密钥不符合要求', 429: '提交过于频繁，请稍后再试' };
  if (![200, 202].includes(response.status)) throw new Error(`IndexNow 返回 ${response.status}：${explanations[response.status] ?? '请求未被接受，请稍后检查'}。`);
  return { status: response.status, accepted: urlList.length, message: response.status === 202 ? '请求已接收，密钥验证待完成；不代表已收录。' : '网址已提交；不代表已抓取或收录。' };
}
