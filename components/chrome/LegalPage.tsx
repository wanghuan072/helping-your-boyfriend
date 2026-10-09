import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/config/site";
import { PageUpdated } from "./PageUpdated";
import pageState from "@/seo/page-lastmod.json";

export function LegalPage({ eyebrow, title, path, description, children }: { eyebrow: string; title: string; path: string; description: string; children: React.ReactNode }) {
  return <><JsonLd value={{ "@context": "https://schema.org", "@graph": [{ "@type": "WebPage", name: title, url: absoluteUrl(path), description }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") }, { "@type": "ListItem", position: 2, name: title }] }] }} /><main id="main-content" className="site-container page-main legal-page"><nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>{title}</span></nav><header><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></header>{children}<PageUpdated date={pageState[path as keyof typeof pageState]?.lastModified} /></main></>;
}
