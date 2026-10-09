"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

export function HeightAwareSidebar({ children }: { children: ReactNode }) {
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const updateBoundary = () => {
      const header = document.querySelector<HTMLElement>(".site-header");
      const headerHeight = header?.getBoundingClientRect().height ?? 0;
      const gap = 18;
      const sidebarHeight = sidebar.getBoundingClientRect().height;
      const availableHeight = window.innerHeight - headerHeight - gap * 2;
      const top = sidebarHeight <= availableHeight
        ? headerHeight + gap
        : window.innerHeight - sidebarHeight - gap;

      sidebar.style.setProperty("--sidebar-sticky-top", `${Math.round(top)}px`);
    };

    const resizeObserver = new ResizeObserver(updateBoundary);
    resizeObserver.observe(sidebar);
    window.addEventListener("resize", updateBoundary, { passive: true });
    updateBoundary();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateBoundary);
    };
  }, []);

  return <aside ref={sidebarRef} className="game-sidebar" aria-label="More games">{children}</aside>;
}
