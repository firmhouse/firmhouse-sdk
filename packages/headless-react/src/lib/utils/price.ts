import { calculateCartTotals, FirmhouseCart } from '@firmhouse/firmhouse-sdk';

export function formatCentsWithCurrency(
  cents: number,
  currency: string,
  locale?: string | null,
  decimalPoints = 2,
): string {
  return Intl.NumberFormat(locale ?? undefined, {
    currency,
    style: 'currency',
    maximumFractionDigits: decimalPoints,
    minimumFractionDigits: decimalPoints,
  }).format(cents / 100);
}

export function getOrderCalculations(cart: FirmhouseCart | null) {
  if (!cart || !cart.orderedProducts) {
    const totals = cart ? calculateCartTotals(cart) : null;
    return {
      totalIncludingTax: totals?.payNowTotalCents ?? 0,
      totalDiscount: totals?.payNowDiscountCents ?? 0,
      totalTax: 0,
      currency: cart?.currency ?? 'EUR',
    };
  }
  const { orderedProducts } = cart;
  const nonPlanProducts = orderedProducts?.filter((op) => !op.plan) ?? [];
  const totalOrderedProducts = nonPlanProducts.reduce((acc, op) => {
    return acc + (op.totalAmountIncludingTaxCents ?? 0);
  }, 0);
  const totalTaxOrderedProducts = nonPlanProducts?.reduce((acc, op) => {
    return (
      acc +
      (op.totalAmountIncludingTaxCents ?? 0) -
      (op.totalAmountExcludingTaxCents ?? 0)
    );
  }, 0);

  const planTax =
    (cart.activePlan?.initialAmountIncludingTaxCents ?? 0) -
    (cart.activePlan?.initialAmountExcludingTaxCents ?? 0);
  const tax = totalTaxOrderedProducts + planTax;
  const sum =
    totalOrderedProducts +
    (cart?.activePlan?.initialAmountIncludingTaxCents ?? 0);
  const taxPercentage = tax / sum;
  const { payNowDiscountCents, payNowTotalCents } = calculateCartTotals(cart);
  const totalTax = sum > 0 ? payNowTotalCents * taxPercentage : 0;

  return {
    totalIncludingTax: payNowTotalCents,
    totalDiscount: payNowDiscountCents,
    totalTax,
    currency: cart.currency,
  };
}
