const stable = (a, b) => a.id.localeCompare(b.id);
const dated = (a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '') || stable(a, b);
const unique = (items, currentId) => [...new Map(items.filter(item => item.id !== currentId).map(item => [item.id, item])).values()];
export function selectHomepage(pool) {
  return { recommended: pool.filter(g => g.flags.isRecommendedHome).sort(stable), featured: pool.filter(g => g.flags.isFeaturedHome).sort(stable), newest: pool.filter(g => g.flags.isNewHome).sort(dated) };
}
export function selectGameCollections(pool, current) {
  const related = current.relatedGameIds.map(id => pool.find(g => g.id === id)).filter(Boolean);
  const sorted = [...pool].sort(stable);
  const home = selectHomepage(pool);
  return { recommended: unique([...related, ...home.recommended, ...sorted], current.id).slice(0, 6), featured: unique([...home.featured, ...related, ...sorted], current.id).slice(0, 6), newest: unique([...home.newest, ...[...pool].sort(dated)], current.id).slice(0, 6) };
}
