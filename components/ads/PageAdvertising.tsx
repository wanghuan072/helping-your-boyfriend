"use client";

import { useEffect } from "react";
import { chooseAdPositions } from "@/lib/ads/placement.mjs";

export function PageAdvertising() {
  useEffect(() => {
    const main = document.getElementById("main-content");
    if (!main || main.dataset.adsMounted) return;
    main.dataset.adsMounted = "true";
    let cancelled = false;
    const hosts: HTMLElement[] = [];
    const media = window.matchMedia("(max-width: 768px)");
    let generation = 0;
    const clear = () => {
      hosts.forEach(host => {
        const previous = host.previousElementSibling as HTMLElement | null;
        if (previous) previous.style.marginBottom = host.dataset.previousMargin ?? "";
        host.remove();
      });
      hosts.length = 0;
    };
    // 字体就绪后测量完整内容；不轮询、不自动刷新广告。
    const place = async () => {
      const current = ++generation;
      clear();
      await document.fonts.ready;
      if (cancelled || current !== generation) return;
      const home = main.classList.contains("scrapbook-page");
      const hero = main.querySelector<HTMLElement>(home ? ".scrapbook-player-layout" : ":scope > header");
      if (!hero) return;
      const mobile = media.matches;
      const width = mobile ? 300 : 728, height = mobile ? 250 : 90;
      const bottom = main.lastElementChild as HTMLElement;
      const start = hero.getBoundingClientRect().bottom, end = bottom.getBoundingClientRect().bottom;
      // 首页只选完整整行块；结局图中不拆分节点或截断连线。
      const selector = home
        ? ":scope > .scrapbook-topic-links, .scrapbook-body > section, .scrapbook-body > .scrapbook-help-grid, .scrapbook-body > .scrapbook-reading-layout, :scope > .scrapbook-video"
        : ":scope > section, :scope > .notebook-dossier-pair, .guide-article > section";
      const boundaries = Array.from(main.querySelectorAll<HTMLElement>(selector))
        .map((element, row) => ({ element, row, y: element.getBoundingClientRect().bottom }))
        .filter(item => item.element.parentElement!.getBoundingClientRect().width >= width);
      const selected = chooseAdPositions({ start, end, boundaries, home });
      // 每个位置仅请求当前设备的尺寸，不同时请求隐藏的另一个版本。
      for (const [index, position] of selected.entries()) {
        const host = document.createElement("div");
        host.className = "advertising-slot";
        host.dataset.adSlot = String(index + 1);
        host.dataset.adDevice = mobile ? "mobile" : "desktop";
        host.setAttribute("role", "complementary");
        host.setAttribute("aria-label", "Advertisement");
        const frame = document.createElement("iframe");
        frame.title = "Advertisement";
        frame.width = String(width);
        frame.height = String(height);
        frame.loading = "lazy";
        // 独立文档隔离 atOptions，禁止广告读取父页面和跳转当前页面。
        frame.setAttribute("sandbox", "allow-scripts allow-popups allow-popups-to-escape-sandbox");
        frame.referrerPolicy = "strict-origin-when-cross-origin";
        frame.src = `/ad-frame/${mobile ? "mobile" : "desktop"}.html`;
        host.append(frame);
        if (position === start) hero.after(host);
        else if (position === end) main.append(host);
        else boundaries.find(item => item.y === position)!.element.after(host);
        // 相邻内容原有外边距不与广告的 10px 外边距叠加。
        const previous = host.previousElementSibling as HTMLElement | null;
        if (previous) {
          host.dataset.previousMargin = previous.style.marginBottom;
          previous.style.marginBottom = "0px";
        }
        hosts.push(host);
      }
    };
    void place();
    // 仅跨过设备断点才切换格式；普通缩放不重复请求，绝不计时刷新。
    const changeDevice = () => { void place(); };
    media.addEventListener("change", changeDevice);
    return () => {
      cancelled = true;
      media.removeEventListener("change", changeDevice);
      clear();
      delete main.dataset.adsMounted;
    };
  }, []);
  return null;
}
