import type { Game } from './types';
type Collections = { recommended: Game[]; featured: Game[]; newest: Game[] };
export function selectHomepage(pool: Game[]): Collections;
export function selectGameCollections(pool: Game[], current: Game): Collections;
