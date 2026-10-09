import fs from 'node:fs';
import { filterEvent, verifyDeployment, deploymentManifest, loadCheckpoint, submit } from './indexnow.mjs';

const mode = process.argv[2];
const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
const config = {
  projectId: process.env.VERCEL_PROJECT_ID, teamId: process.env.VERCEL_TEAM_ID,
  siteUrl: process.env.SITE_URL, readToken: process.env.VERCEL_READ_TOKEN,
  key: process.env.INDEXNOW_KEY, bypass: process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
  checkpointUrl: process.env.INDEXNOW_CHECKPOINT_URL, storageToken: process.env.INDEXNOW_CHECKPOINT_TOKEN,
};
const manual = process.env.GITHUB_EVENT_NAME === 'workflow_dispatch';
const candidate = filterEvent(event, config, manual);
const output = (key, value) => fs.appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
if (mode === 'filter') {
  output('eligible', candidate ? 'true' : 'false');
  console.log(candidate ? 'Production candidate requires independent verification.' : 'Ignored event: not a configured successful production deployment.');
} else if (mode === 'verify') {
  const verified = candidate && await verifyDeployment(candidate, config);
  output('verified', verified ? 'true' : 'false');
  console.log(verified ? 'Vercel control plane verified project, production assignment, domain, URL and Git SHA.' : 'Skipped superseded deployment.');
} else if (mode === 'submit') {
  // Requery within the production concurrency lock; never trust prior job outputs.
  const verified = candidate && await verifyDeployment(candidate, config);
  if (!verified) { console.log('Skipped noncurrent production deployment.'); process.exit(0); }
  const current = await deploymentManifest(verified, config);
  const state = await loadCheckpoint(config);
  const bootstrap = manual && event.inputs?.bootstrap === 'true';
  if (bootstrap) console.warn('EXPLICIT BOOTSTRAP: all eligible current URLs and known checkpoint deletions will be notified.');
  const bootstrapBaseline = bootstrap && !state.checkpoint ? JSON.parse(fs.readFileSync('seo/migration-baseline.json', 'utf8')).manifest : undefined;
  if (bootstrapBaseline) console.warn('Bootstrap deletion recovery uses the audited migration snapshot; deletions after a lost newer checkpoint require restoring that checkpoint or a newer successful-production snapshot.');
  const result = await submit({ current, ...state, bootstrapBaseline, verified, config, bootstrap,
    reverify: async () => Boolean(await verifyDeployment(candidate, config)),
  });
  console.log(JSON.stringify(result));
} else throw new Error('Invalid workflow phase');
