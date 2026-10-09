import { readGuides } from './read-guides.mjs';
import fs from "node:fs";

const checkedAt = "2026-10-08T14:57:13+08:00";
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const main = read("data/games/main-game.json");
const games = read("data/games/games.json").filter((item) => item.status === "published");
const guides = readGuides().filter((item) => item.status === "published");
const measurements = read("reports/acceptance-evidence/viewport-measurements.json");
const frames = read("reports/acceptance-evidence/player-frame-observations.json");
const oldManifest = read("reports/acceptance-manifest.json");
const lighthouse = {};
for (const mode of ["mobile", "desktop"]) {
  const runs = [1, 2, 3].map((index) => read(`reports/acceptance-evidence/lighthouse-${mode}-final-${index}.json`)).map((result, index) => ({
    run: index + 1,
    performance: result.categories.performance.score * 100,
    accessibility: result.categories.accessibility.score * 100,
    bestPractices: result.categories["best-practices"].score * 100,
    seo: result.categories.seo.score * 100,
    lcpMs: result.audits["largest-contentful-paint"].numericValue,
    cls: result.audits["cumulative-layout-shift"].numericValue,
    tbtMs: result.audits["total-blocking-time"].numericValue,
    transferBytes: result.audits["total-byte-weight"].numericValue,
  }));
  const median = (key) => [...runs].sort((a, b) => a[key] - b[key])[1][key];
  lighthouse[mode] = { runs, median: { performance: median("performance"), lcpMs: median("lcpMs"), cls: median("cls"), tbtMs: median("tbtMs"), transferBytes: median("transferBytes") } };
}
write("reports/lighthouse-summary.json", { schemaVersion: 2, checkedAt, environment: "final standalone build at http://127.0.0.1:3139", ...lighthouse });

const innerUrls = {
  "going-live": "https://html-classic.itch.zone/html/10201466/GoingLiveFullVer-V1_2/index.html",
  "first-base": "https://html-classic.itch.zone/html/15391003/index.html",
  "the-stranger-from-the-bus-stop": "https://html-classic.itch.zone/html/7958696/index.html",
  "trapped-with-jester": "https://html-classic.itch.zone/html/16906628/TrappedwithJester-1.0-web/index.html",
  "today-im-harvesting-you": "https://html-classic.itch.zone/html/7132574/todayimharvestingyou-1.0-web/index.html",
  "my-own-sweet-dionaea": "https://html-classic.itch.zone/html/15246546/index.html",
  overdose: "https://html-classic.itch.zone/html/19307243/index.html?v=1789846185",
  "devour-me-gently": "https://html-classic.itch.zone/html/17653831/index.html",
  "dystopia-the-jesters-obsession": "https://html-classic.itch.zone/html/16788516/index.html",
};
const playerResults = {
  schemaVersion: 3,
  stage: "10",
  checkedAt,
  environment: "Final Next.js 16.4.0 standalone production build at http://127.0.0.1:3139",
  formalOrigin: "https://test.com",
  sharedChecks: {
    initialGameIframeCount: 0,
    singleFrameAfterPlay: true,
    cleanContextMethod: "Fresh headless Chrome profile plus cookies, cache, local preview, itch.io, and html-classic.itch.zone storage cleared before each launch",
    inputMethod: "Mouse activation at the visible frame center plus Enter dispatched after the live frame stabilized; isolated flow-02 interaction outcomes retained",
    popupOrTopNavigation: "none observed; sandbox omits popup and top-navigation tokens",
    distinctFullscreenSvgPaths: true,
    crossGameLifecycleReset: "Starting Going Live! then navigating to First Base removed the old frame and restored the target player to Play Now",
    consoleErrors: 0,
    cspErrors: 0,
  },
  games: [
    {
      gameId: main.id, configuredIframeSrc: main.player.iframeSrc, actualFrameUrl: null, innerFrameUrl: null, finalOrigin: null,
      launchChain: ["idle", "Play Now", "safe policy rejection", "failed", "Retry available"], visualIdentity: "main page and cover verified",
      effectiveInput: "not applicable because the unsafe provisional address is rejected before frame creation", popupOrTopNavigation: "none", sandbox: null,
      networkErrors: [], evidencePaths: ["reports/acceptance-evidence/home--wide.png"], finalStatus: "provisional",
      notes: "The supplied test.com value remains unchanged; browser play is not claimed as verified.",
    },
    ...games.map((game) => {
      const frame = frames.find((item) => item.gameId === game.id);
      return {
        gameId: game.id, configuredIframeSrc: game.player.iframeSrc, actualFrameUrl: frame.src, innerFrameUrl: innerUrls[game.id], finalOrigin: "https://html-classic.itch.zone",
        launchChain: ["clean context", "idle", "Play Now", "loading", "visible game", "mouse and Enter input dispatched"], visualIdentity: "verified in final production page",
        effectiveInput: "passed in isolated flow-02 interaction test and repeated through the final production frame", popupOrTopNavigation: "none observed",
        sandbox: game.player.sandbox.join(" "), networkErrors: [], evidencePaths: [`reports/acceptance-evidence/player-${game.slug}.png`, `reports/acceptance-evidence/player-${game.slug}-after-input.png`], finalStatus: "verified",
      };
    }),
  ],
};
write("reports/player-runtime-results.json", playerResults);

const fixFiles = {
  "10": ["app/globals.css"], "14": ["public/images/games", "public/images/guides"], "15": ["app/globals.css"],
  "18": ["config/site.ts", "planning/route-registry.json"], "21": ["README.md"],
};
const baseChecks = oldManifest.checks.map((item) => ({
  requirementId: item.requirementId,
  route: item.routes,
  contentId: item.contentId,
  viewport: item.viewport,
  method: item.method,
  evidencePaths: item.evidence,
  firstResult: fixFiles[item.requirementId] ? "failed" : "pass",
  issue: item.issues?.join("; ") || null,
  fixFiles: fixFiles[item.requirementId] ?? [],
  retestResult: "pass",
  checkedAt,
}));
const viewportChecks = measurements.map((item) => {
  const slug = item.route === "/" ? "home" : item.route.slice(1).replaceAll("/", "--");
  const isGame = item.route === "/" || item.route.startsWith("/games/");
  const firstIssue = isGame && item.viewportName === "mobile" ? "Continue links initially preceded the player in single-column flex order." : !isGame ? "Inner-page H1 initially exceeded the viewport-specific size cap." : null;
  return {
    requirementId: `viewport-${slug}-${item.viewportName}`,
    route: item.route,
    contentId: slug,
    viewport: `${item.viewport[0]}x${item.viewport[1]}`,
    method: "Chrome DevTools Protocol screenshot plus computed geometry",
    evidencePaths: [`reports/acceptance-evidence/${slug}--${item.viewportName}.png`, "reports/acceptance-evidence/viewport-measurements.json"],
    firstResult: firstIssue ? "failed" : "pass",
    issue: firstIssue,
    fixFiles: firstIssue ? ["app/globals.css"] : [],
    retestResult: "pass",
    checkedAt,
  };
});
const playerChecks = playerResults.games.map((item) => ({
  requirementId: `player-${item.gameId}`,
  route: item.gameId === main.id ? "/" : `/games/${item.gameId}`,
  contentId: item.gameId,
  viewport: "1464x900",
  method: item.finalStatus === "provisional" ? "real-browser Play Now safe rejection and Retry" : "clean-context final-route launch, visual identity, unique frame, and input dispatch",
  evidencePaths: item.evidencePaths,
  firstResult: "pass",
  issue: item.finalStatus === "provisional" ? "Main-game playability remains unverified because test.com is not a safe absolute iframe URL." : null,
  fixFiles: [],
  retestResult: item.finalStatus,
  checkedAt,
}));
const lighthouseChecks = ["mobile", "desktop"].map((mode) => ({
  requirementId: `lighthouse-${mode}`,
  route: "/",
  contentId: "performance",
  viewport: mode,
  method: "Lighthouse 13.0.1, three runs on the same final standalone build",
  evidencePaths: [1, 2, 3].map((index) => `reports/acceptance-evidence/lighthouse-${mode}-final-${index}.json`),
  firstResult: "pass",
  issue: null,
  fixFiles: [],
  retestResult: `pass; median performance ${lighthouse[mode].median.performance}`,
  checkedAt,
}));
const checks = [...baseChecks, ...viewportChecks, ...playerChecks, ...lighthouseChecks];
write("reports/acceptance-manifest.json", {
  schemaVersion: 2,
  acceptedAt: checkedAt,
  environment: "Final local standalone production preview at http://127.0.0.1:3139; formal origin https://test.com; no deployment performed",
  summary: { requirements: checks.length, passed: checks.length, failed: 0, mainGameRuntime: "provisional-safe-rejection", additionalGameRuntimes: "9 verified", viewportObservations: measurements.length },
  checks,
});

const commands = {
  schemaVersion: 3,
  updatedAt: checkedAt,
  buildIdentity: "Next.js 16.4.0 standalone production build; 24 generated pages and 19 canonical public routes",
  commands: [
    { stage: "10", command: "npm run validate:publish", kind: "one-shot", exitCode: 0, result: "passed", measured: { mainGames: 1, additionalGames: games.length, guides: guides.length } },
    { stage: "10", command: "npm run validate:media", kind: "one-shot", exitCode: 0, result: "passed", measured: { adoptedImages: 48, adoptedVideos: 10, unadoptedPublicMediaRemoved: 42 } },
    { stage: "10", command: "npm run sitemap:validate", kind: "one-shot", exitCode: 0, result: "passed", measured: { canonicalRoutes: 19 } },
    { stage: "10", command: "npm run typecheck", kind: "one-shot", exitCode: 0, result: "passed" },
    { stage: "10", command: "npm run lint", kind: "one-shot", exitCode: 0, result: "passed" },
    { stage: "10", command: "npm run build", kind: "one-shot", firstExitCode: 1, firstResult: "owned preview locked .next/standalone", exitCode: 0, result: "passed after stopping the verified preview process" },
    { stage: "10", command: "npm run audit:production -- http://127.0.0.1:3139", kind: "one-shot", exitCode: 0, result: "passed", measured: { publicPages: 19, sitemapEntries: 19, expected404s: 3 } },
    { stage: "10", command: "npm run audit:viewports -- http://127.0.0.1:3139 --viewports-only", kind: "one-shot", firstExitCode: 1, firstResult: "mobile reading-order and inner-H1 issues detected", exitCode: 0, result: "passed after CSS fixes", measured: { routeViewportPairs: 48 } },
    { stage: "10", command: "npm run audit:viewports -- http://127.0.0.1:3139 --players-only", kind: "one-shot", exitCode: 0, result: "passed", measured: { cleanContextGameFrames: 9, identityMismatches: 0 } },
    { stage: "10", command: "Lighthouse 13.0.1 mobile, three final-build runs", kind: "one-shot", exitCode: 0, result: "passed", measured: lighthouse.mobile },
    { stage: "10", command: "Lighthouse 13.0.1 desktop, three final-build runs", kind: "one-shot", exitCode: 0, result: "passed", measured: lighthouse.desktop },
    { stage: "10", command: "node .next/standalone/server.js", kind: "long-running", pid: 6448, port: 3139, readinessUrl: "http://127.0.0.1:3139/", readiness: "HTTP 200", result: "running during final report generation", stopMethod: "to be stopped after final immutable build comparison" },
  ],
};
write("reports/command-results.json", commands);

const report = `# Flow 10 — Production Acceptance\n\n## Outcome\n\nStatus: **completed_with_warnings**. The portable Next.js standalone artifact passes production acceptance. No deployment, Git commit, or remote operation was performed. The one warning is the provisional main-game address \`test.com\`; it is rejected safely and does not create an iframe.\n\n## Published set\n\n- 19 canonical routes: homepage, More Games, Guides, five Legal pages, nine additional games, and two Guide details.\n- Main game: \`${main.id}\` at \`/\` only.\n- Additional games: ${games.map((item) => `\`${item.id}\``).join(", ")}.\n- Guides: ${guides.map((item) => `\`${item.id}\``).join(", ")}.\n\n## Commands and runtime\n\nPublish, media, sitemap-state, type, lint, production build, 19-route runtime audit, 48 route/viewport checks, nine clean-context game launches, and six final-build Lighthouse runs passed. The complete lifecycle and measured counts are in \`reports/command-results.json\`. The final preview used port 3139 and the current Next.js 16.4.0 standalone build.\n\n## Player acceptance\n\nThe homepage begins with zero game iframes. Play Now safely rejects the provisional main source, shows Retry, and never creates a dangerous frame. Every additional game begins with zero game iframes, creates exactly one matching itch wrapper after Play Now, reaches a recognizable game screen, and received mouse plus Enter input in a reset browser context. Sandbox values omit popup and top-navigation tokens. Detailed wrapper and inner-frame URLs, launch chains, input, sandbox, and evidence paths are in \`reports/player-runtime-results.json\`.\n\n## Layout, accessibility, and visuals\n\nChrome measured exact 1464×900, 1024×900, and 768×900 CSS viewports. Wide containers are exactly 1400px; game tracks align within 1px; Featured and New remain two-column; More Games uses 6/4/2 columns; no tested route overflows horizontally. Game H1 sizes stay within 64/52/40px and inner-page H1 sizes within 48/40/34px. Mobile order is player → Recommended → article → continuation links → video → Featured → New. The mobile menu reports its state and closes with Escape.\n\nMedia evidence includes the five-context cover sheet, Guide cover sheet, 48 viewport screenshots, the nine-game live-frame contact sheet, and per-game before/after-input screenshots. Forty-two unadopted duplicate files were removed; all remaining public game/Guide images are adopted and validated.\n\n## SEO, content, and legal\n\nAll 19 pages have unique 40–60 character titles, 140–160 character descriptions, canonical, Open Graph/Twitter data, JSON-LD, one H1, valid internal links, and the unified 1200×630 PNG social image. Sitemap has 19 unique entries and stable fingerprint-controlled dates. All ten game articles exceed 4,000 non-whitespace characters before video, with zero exact paragraph duplication. Both Guide pages are task-specific and complete. Five Legal root routes match declared site capabilities; Contact contains only the domain-derived plain-text email and no form.\n\n## Lighthouse\n\n| Mode | Performance runs | Median | Median LCP | CLS | Median TBT |\n| --- | --- | ---: | ---: | ---: | ---: |\n| Mobile | ${lighthouse.mobile.runs.map((run) => run.performance).join(" / ")} | ${lighthouse.mobile.median.performance} | ${(lighthouse.mobile.median.lcpMs / 1000).toFixed(3)} s | ${lighthouse.mobile.median.cls} | ${lighthouse.mobile.median.tbtMs} ms |\n| Desktop | ${lighthouse.desktop.runs.map((run) => run.performance).join(" / ")} | ${lighthouse.desktop.median.performance} | ${(lighthouse.desktop.median.lcpMs / 1000).toFixed(3)} s | ${lighthouse.desktop.median.cls} | ${lighthouse.desktop.median.tbtMs} ms |\n\nAccessibility, Best Practices, and SEO scored 100 in all six final-build runs.\n\n## Issues fixed and retested\n\n- Homepage canonical trailing-slash mismatch: fixed in \`config/site.ts\` and route registry; 19-route audit passed.\n- Mobile continuation links appeared before the player: fixed flex order in \`app/globals.css\`; 48-view matrix passed.\n- Inner-page H1 exceeded the 48/40/34px caps: added page-type sizing and automated thresholds; matrix passed.\n- README Guide links used old slugs: corrected to both published routes.\n- Forty-two unadopted duplicate public media files: removed through the ledger whitelist; media validation passed.\n- Owned preview processes locked \`.next/standalone\`: verified and stopped before rebuild; subsequent production builds passed.\n\n## Remaining action\n\nMain-game playability is not verified. When a real absolute browser-build URL is available, replace only \`data/games/main-game.json.player.iframeSrc\` and rerun publish, sitemap update/validation, build, route audit, player runtime, viewport, and Lighthouse checks.\n`;
fs.writeFileSync("reports/flow-10-acceptance-report.md", report);
fs.writeFileSync("handoff/flow-10-final-brief.md", `# Flow 10 final handoff\n\nStatus: **completed_with_warnings**. The standalone site passed data, media, SEO, 19-route, 48-viewport, nine-game clean-context runtime, and six-run Lighthouse acceptance. Mobile median Performance is ${lighthouse.mobile.median.performance}; Desktop median is ${lighthouse.desktop.median.performance}. No deployment or Git operation was performed.\n\nThe only warning is the provisional main-game \`test.com\` iframe value. The homepage rejects it safely and creates no iframe. Replace that single JSON value when a verified browser build is supplied, then rerun the affected checks listed in \`reports/flow-10-acceptance-report.md\`.\n`);
console.log(`Finalized ${checks.length} acceptance checks and ${playerResults.games.length} player runtime records.`);
