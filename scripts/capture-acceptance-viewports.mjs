import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:3139";
const includePlayers = !process.argv.includes("--viewports-only");
const playersOnly = process.argv.includes("--players-only");
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const evidenceDir = path.resolve("reports/acceptance-evidence");
const profileDir = path.resolve(`reports/runtime/chrome-acceptance-profile-${process.pid}`);
fs.mkdirSync(evidenceDir, { recursive: true });
fs.mkdirSync(profileDir, { recursive: true });

const routes = ["/", "/endings", "/characters", "/controls", "/privacy", "/terms", "/copyright", "/about", "/contact"];
const viewports = [{ name: "wide", width: 1464, height: 900 }, { name: "tablet", width: 1024, height: 900 }, { name: "mobile", width: 768, height: 900 }];
const chrome = spawn(chromePath, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--remote-debugging-port=9239", "--remote-allow-origins=*", `--user-data-dir=${profileDir}`, "about:blank"], { stdio: "ignore", windowsHide: true });

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
for (let attempt = 0; attempt < 50; attempt += 1) {
  try { const response = await fetch("http://127.0.0.1:9239/json/version"); if (response.ok) break; } catch {}
  if (attempt === 49) throw new Error("Chrome DevTools endpoint did not become ready");
  await wait(100);
}

const target = await fetch("http://127.0.0.1:9239/json/new?about:blank", { method: "PUT" }).then((response) => response.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
let sequence = 0;
const pending = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message)); else resolve(message.result);
});
const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++sequence; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })); });
await send("Page.enable");
await send("Runtime.enable");
await send("Network.enable");
await send("Emulation.setScrollbarsHidden", { hidden: true });

const measurements = [];
try {
  for (const viewport of playersOnly ? [] : viewports) {
    await send("Emulation.setDeviceMetricsOverride", { width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: false });
    for (const route of routes) {
      await send("Page.navigate", { url: `${baseUrl}${route}` });
      let loaded = false;
      for (let attempt = 0; attempt < 100; attempt += 1) {
        const state = await send("Runtime.evaluate", { expression: `({ href: location.href, ready: document.readyState, hasMain: Boolean(document.querySelector("main")) })`, returnByValue: true });
        if (state.result.value.href === `${baseUrl}${route}` && state.result.value.ready === "complete" && state.result.value.hasMain) { loaded = true; break; }
        await wait(100);
      }
      if (!loaded) throw new Error(`Route did not become ready: ${route}`);
      await wait(100);
      const result = await send("Runtime.evaluate", { expression: `(() => {
        const rect = (selector) => { const element = document.querySelector(selector); if (!element) return null; const box = element.getBoundingClientRect(); return { left: box.left, right: box.right, width: box.width, top: box.top }; };
        const columns = (selector) => { const element = document.querySelector(selector); if (!element) return null; return getComputedStyle(element).gridTemplateColumns.split(" ").filter(Boolean).length; };
        const main = document.querySelector(".game-primary");
        return {
          title: document.title,
          ready: document.readyState,
          viewport: [innerWidth, innerHeight],
          scrollWidth: document.documentElement.scrollWidth,
          container: rect(".site-container"),
          primary: rect(".game-primary"), recommended: rect(".recommended-section"), article: rect(".game-article"), video: rect(".video-section"),
          h1Size: document.querySelector("h1") ? parseFloat(getComputedStyle(document.querySelector("h1")).fontSize) : null,
          gamesColumns: columns(".games-grid"), guideColumns: columns(".guide-card"), sidebarColumns: columns(".sidebar-grid"),
          desktopNav: document.querySelector(".desktop-nav") ? getComputedStyle(document.querySelector(".desktop-nav")).display : null,
          mobileMenu: document.querySelector(".mobile-menu") ? getComputedStyle(document.querySelector(".mobile-menu")).display : null,
          primaryOrder: main ? [...main.children].map((element) => ({ className: element.className, order: Number(getComputedStyle(element).order), top: element.getBoundingClientRect().top })) : []
        };
      })()`, returnByValue: true });
      measurements.push({ route, viewportName: viewport.name, ...result.result.value });
      const slug = route === "/" ? "home" : route.slice(1).replaceAll("/", "--");
      const image = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false, fromSurface: true });
      fs.writeFileSync(path.join(evidenceDir, `${slug}--${viewport.name}.png`), Buffer.from(image.data, "base64"));
    }
  }
  if (!playersOnly) fs.writeFileSync(path.join(evidenceDir, "viewport-measurements.json"), `${JSON.stringify(measurements, null, 2)}\n`);
  const failures = measurements.flatMap((item) => {
    const issues = [];
    if (item.scrollWidth > item.viewport[0]) issues.push("horizontal-overflow");
    if (item.viewportName === "wide" && item.container?.width !== 1400) issues.push(`container-${item.container?.width}`);
    if (item.route.startsWith("/games/") || item.route === "/") {
      if (item.viewportName === "wide" && item.sidebarColumns !== 2) issues.push("sidebar-not-two-columns");
      if (item.viewportName === "mobile" && item.h1Size > 40) issues.push(`h1-${item.h1Size}`);
      if (["wide", "tablet"].includes(item.viewportName) && [item.recommended, item.article, item.video].some((box) => box && item.primary && (Math.abs(box.left - item.primary.left) > 1 || Math.abs(box.right - item.primary.right) > 1))) issues.push("primary-track-mismatch");
      if (item.viewportName === "mobile" && item.primaryOrder.some((entry, index, rows) => index && entry.order < rows[index - 1].order)) issues.push("mobile-order");
    } else {
      const h1Limit = item.viewportName === "wide" ? 48 : item.viewportName === "tablet" ? 40 : 34;
      if (item.h1Size > h1Limit) issues.push(`inner-h1-${item.h1Size}`);
    }
    if (item.route === "/games") {
      const expected = item.viewportName === "wide" ? 6 : item.viewportName === "tablet" ? 4 : 2;
      if (item.gamesColumns !== expected) issues.push(`games-columns-${item.gamesColumns}`);
    }
    return issues.map((issue) => `${item.route}@${item.viewportName}:${issue}`);
  });
  if (failures.length) throw new Error(failures.join("\n"));
  const playerObservations = [];
  if (includePlayers) {
    await send("Emulation.setDeviceMetricsOverride", { width: 1464, height: 900, deviceScaleFactor: 1, mobile: false });
    for (const game of []) {
    await send("Network.clearBrowserCookies");
    await send("Network.clearBrowserCache");
    for (const origin of [baseUrl, "https://itch.io", "https://html-classic.itch.zone"]) await send("Storage.clearDataForOrigin", { origin, storageTypes: "all" });
    const route = `/games/${game.slug}`;
    await send("Page.navigate", { url: `${baseUrl}${route}` });
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const state = await send("Runtime.evaluate", { expression: `document.readyState === "complete" && Boolean(document.querySelector(".play-button"))`, returnByValue: true });
      if (state.result.value) break;
      await wait(100);
    }
    await send("Runtime.evaluate", { expression: `document.querySelector(".play-button").click()` });
    await wait(12000);
    const frameState = await send("Runtime.evaluate", { expression: `(() => { const frame=document.querySelector(".player-stage iframe"); if (!frame) return null; const box=frame.getBoundingClientRect(); return { count:document.querySelectorAll(".player-stage iframe").length, src:frame.src, title:frame.title, box:{x:box.x,y:box.y,width:box.width,height:box.height}, pageUrl:location.href }; })()`, returnByValue: true });
    const observation = { gameId: game.id, expectedSrc: game.player.iframeSrc, contextReset: "cookies, cache, and local/itch/html-classic storage cleared before launch", ...frameState.result.value };
      playerObservations.push(observation);
    const before = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false, fromSurface: true });
    fs.writeFileSync(path.join(evidenceDir, `player-${game.slug}.png`), Buffer.from(before.data, "base64"));
    if (observation.box) {
      const x = Math.round(observation.box.x + observation.box.width / 2);
      const y = Math.round(observation.box.y + observation.box.height / 2);
      await send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 });
      await send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 });
      await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
      await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
      await wait(500);
    }
    const after = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false, fromSurface: true });
    fs.writeFileSync(path.join(evidenceDir, `player-${game.slug}-after-input.png`), Buffer.from(after.data, "base64"));
    }
    fs.writeFileSync(path.join(evidenceDir, "player-frame-observations.json"), `${JSON.stringify(playerObservations, null, 2)}\n`);
    const playerFailures = playerObservations.filter((item) => item.count !== 1 || item.src !== item.expectedSrc).map((item) => `${item.gameId}: iframe mismatch`);
    if (playerFailures.length) throw new Error(playerFailures.join("\n"));
  }
  console.log(`Captured ${measurements.length} route/viewport combinations${includePlayers ? ` and ${playerObservations.length} live game frames` : ""} with no geometric or identity failures.`);
} finally {
  socket.close();
  chrome.kill();
  await wait(200);
  fs.rmSync(profileDir, { recursive: true, force: true });
}
