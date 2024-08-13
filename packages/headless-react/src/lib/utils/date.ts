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
