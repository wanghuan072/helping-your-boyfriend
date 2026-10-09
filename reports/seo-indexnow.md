# Sitemap / SEO Manifest / IndexNow — local implementation

## Scope and audit

The sitemap-bing skill was explicitly requested. This implementation keeps the existing Next.js 16.4.0 App Router and its nine business pages. No service was started/restarted; no Git commit, push, remote settings change, deployment or live IndexNow submission was performed.

Route discovery uses `planning/route-registry.json`, the published main-game record and the three published topic records. Legal content comes from the existing five route templates. Actual prerendered HTML captures shared navigation, metadata and structured-data dependencies. Unregistered page files fail the build instead of silently disappearing from the sitemap. There are no remote CMS collections or public dynamic game routes.

Excluded: archived game records, removed `/games` and `/guides` URLs, drafts, noindex pages, noncanonical URLs, queries, fragments, API/machine routes, assets and 404 pages. No compatibility redirects or new business pages were introduced.

## Single SEO source and migration

- `seo/url-manifest.json` is the generated deployment artifact, consumed by the native `app/sitemap.ts` and the static `/.well-known/seo-url-manifest.json` endpoint. It is not proof of successful deployment or notification.
- First audit: canonical production Manifest returned 404; the existing production Sitemap returned valid XML with nine historical dates, all `2026-10-09`. Migration fetched those production pages and important same-origin image bytes to establish semantic fingerprints. `seo/migration-baseline.json` records the audited source and observation time. Dates remain `2026-10-09T00:00:00.000Z`; midnight is a serialization of the existing date, not a claim about the exact editing hour.
- Local verification uses that explicitly labelled migration snapshot. Production builds always fetch the live canonical production Manifest before building. Until the first Manifest is published, a 404 triggers a logged migration from verified production XML, HTML and images. Network errors, redirects, invalid schemas or inaccessible content fail closed; they never reset every date.
- Fingerprint algorithm: `semantic-html-v1`. It tracks body text, headings, image URLs/alt and core-image bytes, title/description/robots, canonical/hreflang, structured data, and rendered links. Shared changes affect only pages whose actual rendered inputs change. Classes, styles, framework scripts/build IDs, copyright year, editorial date labels, JSON-LD revision dates, Vercel `dpl` asset parameters and Cloudflare email protection are excluded as noise.
- An unchanged production fingerprint inherits its exact prior timestamp. A changed/new page uses its reliable content date when it advances the old date, otherwise the build time. Removed/nonindexable URLs disappear from Sitemap and enter the notification deletion set. Version mismatches stop ordinary comparisons; future algorithm migrations must be explicitly audited and preserve old dates for common URLs.
- Legacy `seo/page-lastmod.json`, content JSON `updatedAt` and `scripts/sitemap-state.mjs` now govern editorial month labels only. They are not an independent SEO baseline. Explicit editorial updates use `npm run content:dates:update`; SEO state is generated automatically by the production build.

## Build and sitemap

`npm run build` uses two native Next prerenders: first collect actual static HTML semantics, then publish the final Manifest/Sitemap. Final HTML fingerprints are checked again, so nondeterministic rendering fails. No compiled Next artifacts are manually patched. Local draft timestamps may stabilize local repeated builds, but local drafts are never used as a production baseline or IndexNow checkpoint.

The nine-page site continues to serve ordinary native Sitemap XML at `/sitemap.xml`, with `loc`, ISO-UTC `lastmod`, `changefreq`, and `priority`. Existing page importance/frequency values and canonical slash policy are retained. Robots references the canonical production Sitemap. Above 50,000 entries or the conservative 50 MB byte bound, a conditional internal machine-route rewrite serves a protocol-correct Sitemap Index, whose children are native generated Metadata Routes. It is not a business-page redirect. The current small site has no rewrite; the unused index endpoint returns 404.

## IndexNow safety and persistence

`.github/workflows/indexnow.yml` listens only to successful/promoted Vercel production events and explicit manual runs; it has no push trigger and is disabled unless `INDEXNOW_ENABLED=true` is configured.

Three jobs separate secretless filtering, minimal-read-credential Vercel control-plane verification, and privileged submission. Scripts always come from `github.workflow_sha`, never the deployment/event SHA. Verification checks deployment/project ID, READY/production status, URL, Git SHA, canonical domain ownership/assignment and current project production target. The submit job repeats this verification inside the project/production concurrency lock. Deployment protection credentials are sent only to the verified deployment origin, without redirects or query-string secrets.

The notification checkpoint is independent persistent state, scoped by project ID and production environment. The workflow now stores it on the fixed `indexnow-checkpoints` GitHub branch as `<project-id>-production.json`, using the submit job's temporary `GITHUB_TOKEN`; no external storage account or long-lived GitHub personal token is required. Reads use immutable commit/tree/blob SHAs. Writes create a child of the exact previously read commit and update the ref with `force: false`; a racing sibling cannot fast-forward and fails instead of overwriting accepted state. Initial creation conflicts also fail. All batches must return 200/202 before any checkpoint Git write. Partial failure, timeout, exhausted bounded 429 retries, superseded production, stale manifests or conflicts retain prior state for a safe rerun. The previous external conditional-HTTP backend remains available for existing library tests but is not configured by this workflow.

Deleted URLs are checked for 404/410 or a permanent redirect to a current canonical. Notifications contain added, updated and deleted URLs, at most 10,000 per batch. Same fingerprint with a later timestamp is still notified, covering change-then-revert between successful notifications. A missing checkpoint requires manual, explicit bootstrap. The audited migration snapshot recovers known old deletions for initial bootstrap. If a newer checkpoint is lost later, restore it or supply a newer successful-production snapshot to recover later deletions; they cannot be inferred safely from the current website alone.

A promoted old immutable deployment with backwards Manifest/page dates is rejected. Rollbacks require a new build of the desired content; notification scripts cannot repair already published stale XML.

## Remote configuration still required — not performed

1. Enable Vercel GitHub deployment events. After an explicitly authorized upload, this workflow must be present on GitHub's default branch.
2. GitHub repository Variables: `VERCEL_PROJECT_ID`, optional `VERCEL_TEAM_ID`, `SITE_URL=https://helpingyourboyfriend.org`, and later `INDEXNOW_ENABLED=true`.
3. Provide the least-privilege project/team-bound read credential `VERCEL_READ_TOKEN` for GET deployment/project/domain control-plane verification. Do not substitute a broadly privileged deployment token.
4. Configure the same valid 8–128 character `INDEXNOW_KEY` in Vercel production build environment and GitHub Secrets. The build injects the public root `/<key>.txt` file and never prints its value. Generated root text files are ignored by Git. The initial automation task did not create a key; the later explicit key-configuration request is recorded below.
5. Prefer project-bound Trusted Sources/OIDC for protected deployment access when configuring infrastructure. This local HTTP implementation uses the explicit fallback `VERCEL_AUTOMATION_BYPASS_SECRET` in GitHub Secrets if protection requires it. Never disable protection. If canonical production is protected, Vercel builds separately need the project-specific `SEO_PRODUCTION_BYPASS_SECRET` to fetch that fixed origin's baseline. OIDC integration itself has not been configured.
6. Upload the revised workflow only with explicit user authorization. Only the submit job has `contents: write`, required for its fixed state branch; filter/verify remain read-only. No `INDEXNOW_CHECKPOINT_URL` or `INDEXNOW_CHECKPOINT_TOKEN` is needed. Repository rules must allow the temporary job token to create/update `indexnow-checkpoints`; do not weaken protected main-branch rules. Keep this state-only branch out of Vercel preview builds if the Git integration attempts to build it. The branch contains only public notification metadata/Manifest, no application code or credentials. Do not delete it: that loses the last successfully notified baseline.
7. After a successful production deployment, verify public Manifest/Sitemap/robots/key URLs. Run the workflow manually with project ID, the independently verifiable current deployment ID and `bootstrap=true` for the first checkpoint. Review protocol receipts and the persisted checkpoint. Only then rely on automatic production events.

IndexNow 200/202 means protocol acceptance, not guaranteed crawling or indexing. See the [official protocol](https://www.indexnow.org/documentation) and [Vercel event definitions](https://github.com/vercel/repository-dispatch).

## Verification

Local checks cover unchanged/repeated builds, individual/shared SEO changes, CSS/format/runtime noise, image content replacement, noindex/new/removed/canonical URLs, version/time rollback rejection, 50,001 URL partition/index routing, 10,001 URL notification batching, preview/error filtering, Vercel control-plane mismatches, protected-origin redirects, strong ETags, partial failure, retries, superseded deployments and CAS conflicts. External submission requests are mocked.

Commands: `npm run test:seo`, `test:sitemap`, `sitemap:validate`, `test:paths`, `test:content`, `test:dates`, `validate:publish`, `validate:media`, `lint`, `typecheck`, `build`, and the requested skill's Manifest validator/diff scripts. The final generated Manifest and XML contain exactly nine eligible URLs and retain all nine production dates. Root canonical and Open Graph URLs match the Sitemap.

Production automation remains unverified until the remote configuration above is completed and the changed project is explicitly uploaded/deployed. The installation audit also reports five existing high-severity development-tool dependency findings in the Next ESLint/glob chain; no forced framework downgrade or unrelated dependency repair was performed.

## Follow-up: local IndexNow key configured

At the user's explicit request, a cryptographically random 32-character hexadecimal key was generated and placed in the ignored root `.env.local` as `INDEXNOW_KEY`. Its corresponding UTF-8 verification file is generated under `public/`; its content exactly matches the key. Neither file is tracked by Git. No key value is duplicated into this report, committed source or public Manifest.

The prebuild script now loads Next.js's official `.env*` hierarchy through the explicit matching `@next/env` dependency. Existing process/platform variables take precedence, so a future configured Vercel production key is not silently replaced. `npm run indexnow:verify-key` checks the local environment/file pair; add `-- --built` to also verify the standalone production artifact. It makes no network requests and never displays the key value.

This follow-up does not set Vercel or GitHub Secrets, enable the notification workflow, deploy the key file, or notify search engines. For future authorized remote configuration, copy the existing `.env.local` value to the `INDEXNOW_KEY` entries on both platforms; do not generate a different value or upload the local env file. The other remote prerequisites above still apply. Root key-file requirements follow the [official IndexNow documentation](https://www.indexnow.org/documentation).

## Follow-up: Vercel production key saved

With the user's separate explicit Vercel configuration authorization, the existing local key was saved as a Secret named `INDEXNOW_KEY` for Production on `WH's projects / helping-your-boyfriend-9jzf`. The project's overview independently showed `helpingyourboyfriend.org` and the expected GitHub repository. The other similarly named Vercel project was not modified.

The Vercel environment-variable page confirmed `INDEXNOW_KEY`, Secret type, Production scope, and successful addition. Screenshot: `reports/runtime/vercel-indexnow-config.jpg` (ignored local proof; key value not visible). Vercel explicitly reported that a new deployment is required for the setting to take effect. No Redeploy button was clicked, no GitHub Secret was configured, and no code was uploaded or deployed. Automatic notification prerequisites other than this Vercel key remain pending.

## Follow-up: simpler GitHub checkpoint configuration

At the user's request, GitHub repository Variables `SITE_URL=https://helpingyourboyfriend.org` and `VERCEL_PROJECT_ID=prj_1qZcEoHcXQLW25k4F5MVmp9LwatK` were saved and visually confirmed. The project ID came from the correct Vercel project's settings. The subsequent approved simplification implements GitHub checkpoint persistence locally, removing independent storage service configuration from the active workflow. Mock tests cover first-write conflicts, competing updates, isolated project files, accepted/rejected IndexNow batches, no force writes, and secret exclusion. No remote state branch was created, no notification was submitted, and this follow-up has not been committed or uploaded.

Remaining: save the existing IndexNow key in GitHub Secrets, provide the narrowly scoped Vercel read credential (and team ID/protection access when necessary), separately authorize uploading the local workflow, and explicitly bootstrap the first successful production notification. `INDEXNOW_ENABLED` remains disabled until these steps are complete. Locally passing mocked tests are not a live protocol receipt.

## Follow-up: deployment artifact layout repaired

The Vercel build of commit `615b49d` failed after successful Next prerendering: the SEO script attempted to read `.next/server/app/index.html`. Next 16.4.0 deployment adapters instead write owner-scoped artifacts under `server/route-cache`. The shared reader now resolves page HTML and machine-route bodies from the actual Next manifests, applied adapter configuration, and the pinned framework's route-cache key algorithm. Missing or incomplete artifacts still fail closed. Adapter builds also skip standalone asset copying because the deployment adapter owns packaging.

Regression checks cover all nine pages and three machine routes in both output layouts. Both the normal production build and a real local Next adapter-mode build passed, including sitemap, canonical/social URL, semantic Manifest, and unchanged historical-date checks. The regression adapter is local-only: it starts no server, submits no URLs, and does not deploy. This repair remains local until the user separately authorizes another GitHub upload; the actual Vercel deployment and IndexNow remote prerequisites must then be checked again.
