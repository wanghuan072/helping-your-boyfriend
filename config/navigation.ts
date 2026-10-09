import { topicRoutes } from "@/lib/content/topic-routes";

export const primaryNavigation = [
  { label: "Home", href: "/" },
  ...topicRoutes.map(topic => ({ label: topic.label, href: topic.path })),
] as const;

export const legalNavigation = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Copyright", href: "/copyright" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
] as const;
