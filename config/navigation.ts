import { topicRoutes } from "@/lib/content/topic-routes";

const navigationOrder = ["/endings", "/characters", "/phone-number-and-address", "/controls"];

export const primaryNavigation = [
  { label: "Home", href: "/" },
  ...navigationOrder.map(path => {
    const topic = topicRoutes.find(item => item.path === path);
    if (!topic) throw new Error(`Missing navigation topic: ${path}`);
    return { label: topic.label, href: topic.path };
  }),
] as const;

export const legalNavigation = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Copyright", href: "/copyright" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
] as const;
