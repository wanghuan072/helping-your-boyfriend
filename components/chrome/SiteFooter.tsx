import { legalNavigation, primaryNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return <footer className="site-footer"><div className="site-container footer-grid">
    <div><p className="footer-brand">{siteConfig.name}</p><p>A darker side of romance. We explore the story, read its characters, and find our next step through controls and endings.</p></div>
    <nav aria-label="Footer navigation"><h2>Explore</h2>{primaryNavigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>
    <nav aria-label="Legal"><h2>Legal</h2>{legalNavigation.map((item) => <a key={item.href} href={item.href} rel="noopener noreferrer nofollow">{item.label}</a>)}</nav>
  </div><div className="site-container copyright">Copyright © {siteConfig.copyrightYear} {siteConfig.name}. All rights reserved.</div></footer>;
}
