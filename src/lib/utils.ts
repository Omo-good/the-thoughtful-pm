/** Formats an ISO date (YYYY-MM-DD) in UTC so the output is the same worldwide. */
export function formatDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}

/** Current year for dynamic copyright lines (PRD §6.7). */
export function currentYear(): number {
  return new Date().getUTCFullYear();
}
