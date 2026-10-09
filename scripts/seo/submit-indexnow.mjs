import nextEnv from '@next/env';
import { siteUrl, submitManual } from './manual-indexnow.mjs';
import { validate } from './manifest.mjs';

const args = process.argv.slice(2);
const help = '用法：npm run indexnow:submit -- /endings /characters\n全部线上页面：npm run indexnow:submit -- --all\n仅预览：npm run indexnow:submit -- --all --dry-run';
try {
  if (!args.length || args.includes('--help')) { console.log(help); process.exit(0); }
  if (args.some(arg => arg.startsWith('--') && !['--all', '--dry-run'].includes(arg))) throw new Error('未知参数。\n' + help);
  let urls = args.filter(arg => !arg.startsWith('--'));
  if (args.includes('--all')) {
    if (urls.length) throw new Error('--all 不能与指定网址同时使用。');
    // Read the deployed page list, not unshipped local edits or old game records.
    const response = await fetch(`${siteUrl}/.well-known/seo-url-manifest.json`, { redirect: 'manual', signal: AbortSignal.timeout(15_000) });
    if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw new Error('无法读取线上页面列表，请改为指定网址。');
    const manifest = await response.json();
    validate(manifest, siteUrl);
    urls = manifest.entries.filter(entry => entry.indexable).map(entry => entry.canonicalUrl);
  }
  nextEnv.loadEnvConfig(process.cwd(), false);
  const result = await submitManual({ urls, key: process.env.INDEXNOW_KEY, dryRun: args.includes('--dry-run') });
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  // Network exception causes can contain the key-file URL; never print them.
  console.error(error instanceof TypeError || error?.name === 'TimeoutError' ? '网址无效或网络请求失败，请检查网址和连接后重试。' : error.message);
  process.exitCode = 1;
}
