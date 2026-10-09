export const staticTdk: Record<string, { title: string; description: string; keywords?: string[] }>;
export const pageTdk: typeof staticTdk;
export function getPageTdk(path: string): { title: string; description: string; keywords?: string[] };
