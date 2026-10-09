// Dates belong to page revisions, not sitemap generation or deployment runs.
export function revisionDate({ previousFingerprint, fingerprint, previousDate, today, preserveDates = false }) {
  if (previousDate && (preserveDates || previousFingerprint === fingerprint)) return previousDate;
  return today;
}
