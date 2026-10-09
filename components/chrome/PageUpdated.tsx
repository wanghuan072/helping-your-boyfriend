export function PageUpdated({ date, className = "" }: { date: string | null | undefined; className?: string }) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  return <p className={`page-updated ${className}`.trim()}><time dateTime={date}>Updated {date.slice(0, 7)}</time></p>;
}
