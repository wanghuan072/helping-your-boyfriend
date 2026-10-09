export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "image"; src: string; alt: string; width: number; height: number; caption?: string }
  | { type: "list"; style: "unordered" | "ordered"; items: string[] }
  | { type: "steps"; items: Array<{ title: string; body: string }> }
  | { type: "callout"; tone: "info" | "warning" | "tip"; label?: string; body: string }
  | { type: "table"; columns: string[]; rows: string[][] }
  | { type: "video"; provider: "youtube"; videoId: string; title: string; description: string; poster?: string }
  | { type: "faq"; items: Array<{ question: string; answer: string }> };

export type Game = {
  credits?: { creators: string[]; officialUrl: string };
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  status: "draft" | "published";
  publishedAt: string | null;
  updatedAt: string | null;
  tags: string[];
  categories: string[];
  spoilerPolicy: "none" | "marked" | "full";
  flags: { isNewHome: boolean; isFeaturedHome: boolean; isRecommendedHome: boolean };
  image: { src: string; alt: string; width: number | null; height: number | null };
  player: {
    iframeSrc: string;
    aspectRatio: string | null;
    orientation: "landscape" | "portrait" | "adaptive";
    permissionsPolicy: string[];
    referrerPolicy: React.HTMLAttributeReferrerPolicy | null;
    sandbox: string[] | null;
    loadTimeoutMs: number;
  };
  seo: { title: string; description: string; keywords: string[] };
  content: Array<{ id: string; heading: string; blocks: ContentBlock[] }>;
  relatedGameIds: string[];
};

export type Guide = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  status: "draft" | "published";
  publishedAt: string | null;
  updatedAt: string | null;
  authorId: string | null;
  tags: string[];
  spoilerPolicy: "none" | "marked" | "full";
  cover: { src: string; alt: string; width: number; height: number };
  seo: { title: string; description: string; keywords: string[] };
  sections: Array<{ id: string; title: string; summary?: string; blocks: Exclude<ContentBlock, { type: "faq" }>[] }>;
  relatedGuideIds: string[];
  routeMap?: {
    entry: string;
    nodes: Array<{ sectionId: string; kind: "choice" | "investigation" | "relationship" | "ending"; lane: "left" | "center" | "right"; row: number; label: string; checkpoint: string }>;
    edges: Array<{ from: string; to: string; label: string }>;
    afterTree: string[];
  };
};
