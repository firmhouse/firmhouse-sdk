
export function formatCentsToEuros(cents: number, decimalPoints=2): string {
  return `${(cents / 100).toFixed(decimalPoints)}€`;
}

export function formatCentsWithCurrency(cents:number, currency: string, locale?: string | null, decimalPoints=2): string {
  return Intl.NumberFormat(locale ?? undefined, {currency, style: 'currency', maximumFractionDigits: decimalPoints, minimumFractionDigits: decimalPoints}).format(cents / 100);
}