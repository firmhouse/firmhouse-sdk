export function formatCentsToEuros(cents: number, decimalPoints=2): string {
  return `${(cents / 100).toFixed(decimalPoints)}€`;
}