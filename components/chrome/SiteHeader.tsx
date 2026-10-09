"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { primaryNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { MobileMenu } from "./MobileMenu";

export function SiteHeader() {
  const pathname = usePathname();
  return <header className="site-header">
    <div className="site-container header-inner">
      <a className="brand" href="/" aria-label={`${siteConfig.name} home`}>
        <Image className="brand-icon" src={siteConfig.logo} alt="" width={48} height={48} preload />
        <span className="brand-wordmark">{siteConfig.shortName.split(" ").slice(0, -1).join(" ")}<br />{siteConfig.shortName.split(" ").at(-1)}</span>
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">{primaryNavigation.map((item) => <a key={item.href} href={item.href} aria-current={(item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)) ? "page" : undefined}>{item.label}</a>)}</nav>
      <MobileMenu />
    </div>
  </header>;
}
