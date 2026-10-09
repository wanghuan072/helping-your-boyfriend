import fs from 'node:fs';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd(), false);
const key = process.env.INDEXNOW_KEY;
if (!/^[a-zA-Z0-9-]{8,128}$/.test(key ?? '')) throw new Error('INDEXNOW_KEY is missing or invalid');
const file = `public/${key}.txt`;
if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== key) throw new Error('Local root verification file does not exactly match INDEXNOW_KEY');
const bundled = `.next/standalone/public/${key}.txt`;
if (process.argv.includes('--built') && (!fs.existsSync(bundled) || fs.readFileSync(bundled, 'utf8') !== key)) throw new Error('Built standalone verification file is missing or mismatched');
console.log(`IndexNow key verified: valid format, official environment loading, exact UTF-8 root file${process.argv.includes('--built') ? ', matching production artifact' : ''}. Key value not logged; no network submission performed.`);
