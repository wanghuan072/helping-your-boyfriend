"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Guide } from "@/lib/content/types";


type Drawing = { width: number; height: number; paths: string[] };

export function RouteConnections({ map, children }: { map: NonNullable<Guide["routeMap"]>; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [drawing, setDrawing] = useState<Drawing | null>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (window.innerWidth <= 768) { setDrawing(null); return; }
        const bounds = element.getBoundingClientRect();
        const paths = map.edges.map(edge => {
          const start = element.querySelector<HTMLElement>(`[data-route-node="${edge.from}"]`);
          const end = element.querySelector<HTMLElement>(`[data-route-node="${edge.to}"]`);
          if (!start || !end) return "";
          const a = start.getBoundingClientRect(), b = end.getBoundingClientRect();
          const x1 = a.left + a.width / 2 - bounds.left, x2 = b.left + b.width / 2 - bounds.left;
          if (Math.abs(x1 - x2) < 2) return `M ${x1} ${a.bottom - bounds.top} V ${b.top - bounds.top - 8}`;
          const direction = x2 > x1 ? 1 : -1;
          const sx = (direction > 0 ? a.right : a.left) - bounds.left;
          const sy = a.top + 30 - bounds.top;
          if (Math.abs(a.top - b.top) < 2) {
            const ex = (direction > 0 ? b.left : b.right) - bounds.left;
            return `M ${sx} ${sy} H ${ex - direction * 8}`;
          }
          // The side lanes above their terminal cards are empty: joins stay outside every card.
          return `M ${sx} ${sy} H ${x2} V ${b.top - bounds.top - 8}`;
        });
        setDrawing({ width: bounds.width, height: bounds.height, paths });
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    element.querySelectorAll("[data-route-node]").forEach(node => observer.observe(node));
    window.addEventListener("resize", measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); cancelAnimationFrame(frame); };
  }, [map]);
  return <div className={"ending-flow-tree"} ref={root}>
    {drawing ? <svg className={"ending-flow-connections"} width={drawing.width} height={drawing.height} viewBox={`0 0 ${drawing.width} ${drawing.height}`} aria-hidden="true">
      <defs><marker id="route-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M 0 0 L 6 3.5 L 0 7" /></marker></defs>
      {drawing.paths.map((path, index) => <path key={`${map.edges[index].from}-${map.edges[index].to}`} d={path} markerEnd="url(#route-arrow)" />)}
    </svg> : null}
    {children}
  </div>;
}
