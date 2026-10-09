export const siteConfig = {
  name: "Helping Your Boyfriend",
  shortName: "Helping Your Boyfriend",
  language: "en",
  origin: "https://helpingyourboyfriend.org",
  logo: "/images/logo.png",
  logoAlt: "Helping Your Boyfriend",
  socialImage: "/images/og-image.png",
  contactEmail: "support@helpingyourboyfriend.org",
  copyrightYear: 2026,
} as const;

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.origin).toString();
}
