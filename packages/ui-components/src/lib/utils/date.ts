export function getISO8601Date(dateString: string | null) {
  if (dateString === null) return undefined;
  try {
    const date = new Date(dateString);
    return date.toISOString();
  } catch (e) {
    console.error(e);
  }
  return undefined;
}

export function formatShortDate(date: string | number | Date): string {
  return Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
    hour12: false,
  }).format(new Date(date));
}
