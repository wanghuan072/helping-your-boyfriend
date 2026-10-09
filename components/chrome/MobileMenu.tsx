"use client";

import { useEffect, useRef, useState } from "react";
import { primaryNavigation } from "@/config/navigation";
import { usePathname } from "next/navigation";

export function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) { setOpen(false); buttonRef.current?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return <div className="mobile-menu">
    <button ref={buttonRef} className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)}>
      <span aria-hidden="true">☰</span><span>Menu</span>
    </button>
    {open ? <nav id="mobile-navigation" aria-label="Mobile navigation">
      {primaryNavigation.map((item) => <a key={item.href} href={item.href} aria-current={(item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)) ? "page" : undefined}>{item.label}</a>)}
    </nav> : null}
  </div>;
}
