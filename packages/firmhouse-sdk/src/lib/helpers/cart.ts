import { FirmhouseAppliedPromotion, FirmhouseCart } from './types';

export interface FirmhouseCartTotals {
  /** Amount due at signup before promotion discounts, excluding shipping. */
  payNowSubtotalCents: number;
  /** Promotion discount applied to the signup amount. */
  payNowDiscountCents: number;
  /** Amount due at signup after promotion discounts, excluding shipping. */
  payNowTotalCents: number;
  /** Recurring monthly amount before promotion discounts. */
  monthlySubtotalCents: number;
  /** Promotion discount applied to the recurring monthly amount. */
  monthlyDiscountCents: number;
  /** Recurring monthly amount after promotion discounts. */
  monthlyTotalCents: number;
}

function promotionDiscountCents(
  amountCents: number,
  appliedPromotions: FirmhouseAppliedPromotion[],
) {
  return appliedPromotions.reduce((largestDiscount, appliedPromotion) => {
    if (!appliedPromotion.active) return largestDiscount;

    const { promotion } = appliedPromotion;
    const discount =
      promotion.discountType === 'FIXED_AMOUNT'
        ? (promotion.amountCents ?? 0)
        : Math.round(amountCents * ((promotion.percentDiscount ?? 0) / 100));

    return Math.min(amountCents, Math.max(largestDiscount, discount));
  }, 0);
}

/**
 * Calculate cart subtotals, promotion discounts, and totals.
 *
 * Active promotions do not stack: when multiple promotions are present, the
 * largest discount is used. Shipping is not included.
 */
export function calculateCartTotals(
  cart: Pick<
    FirmhouseCart,
    | 'amountForStartingSubscriptionCents'
    | 'monthlyAmountCents'
    | 'appliedPromotions'
  >,
): FirmhouseCartTotals {
  const payNowSubtotalCents = cart.amountForStartingSubscriptionCents ?? 0;
  const monthlySubtotalCents = cart.monthlyAmountCents ?? 0;
  const appliedPromotions = cart.appliedPromotions ?? [];
  const payNowDiscountCents = promotionDiscountCents(
    payNowSubtotalCents,
    appliedPromotions,
  );
  const monthlyDiscountCents = promotionDiscountCents(
    monthlySubtotalCents,
    appliedPromotions,
  );

  return {
    payNowSubtotalCents,
    payNowDiscountCents,
    payNowTotalCents: Math.max(0, payNowSubtotalCents - payNowDiscountCents),
    monthlySubtotalCents,
    monthlyDiscountCents,
    monthlyTotalCents: Math.max(0, monthlySubtotalCents - monthlyDiscountCents),
  };
}
