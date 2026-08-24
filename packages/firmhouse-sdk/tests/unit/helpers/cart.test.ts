import { calculateCartTotals } from '../../../src/lib/helpers/cart';
import { PromotionDiscountTypeEnum } from '../../../src/lib/graphql/generated';
import {
  FirmhouseAppliedPromotion,
  FirmhouseCart,
  FirmhousePromotion,
} from '../../../src/lib/helpers/types';

function appliedPromotion(
  promotion: Partial<FirmhousePromotion>,
  active = true,
): FirmhouseAppliedPromotion {
  return {
    active,
    promotion: {
      discountType: PromotionDiscountTypeEnum.Percentage,
      percentDiscount: 0,
      amountCents: null,
      ...promotion,
    } as FirmhousePromotion,
  } as FirmhouseAppliedPromotion;
}

function cart(
  appliedPromotions: FirmhouseAppliedPromotion[] = [],
): Pick<
  FirmhouseCart,
  | 'amountForStartingSubscriptionCents'
  | 'monthlyAmountCents'
  | 'appliedPromotions'
> {
  return {
    amountForStartingSubscriptionCents: 5_000,
    monthlyAmountCents: 2_000,
    appliedPromotions,
  };
}

describe('calculateCartTotals', () => {
  it('returns API amounts unchanged without promotions', () => {
    expect(calculateCartTotals(cart())).toEqual({
      payNowSubtotalCents: 5_000,
      payNowDiscountCents: 0,
      payNowTotalCents: 5_000,
      monthlySubtotalCents: 2_000,
      monthlyDiscountCents: 0,
      monthlyTotalCents: 2_000,
    });
  });

  it('calculates fixed promotion discounts', () => {
    const totals = calculateCartTotals(
      cart([
        appliedPromotion({
          discountType: PromotionDiscountTypeEnum.FixedAmount,
          amountCents: 750,
        }),
      ]),
    );

    expect(totals.payNowDiscountCents).toBe(750);
    expect(totals.payNowTotalCents).toBe(4_250);
    expect(totals.monthlyTotalCents).toBe(1_250);
  });

  it('calculates and rounds percentage promotion discounts', () => {
    const totals = calculateCartTotals(
      cart([appliedPromotion({ percentDiscount: 12.5 })]),
    );

    expect(totals.payNowDiscountCents).toBe(625);
    expect(totals.monthlyDiscountCents).toBe(250);
  });

  it('ignores inactive promotions and uses the largest active discount', () => {
    const totals = calculateCartTotals(
      cart([
        appliedPromotion({ percentDiscount: 10 }),
        appliedPromotion({ percentDiscount: 20 }),
        appliedPromotion({ percentDiscount: 90 }, false),
      ]),
    );

    expect(totals.payNowDiscountCents).toBe(1_000);
    expect(totals.monthlyDiscountCents).toBe(400);
  });

  it('caps discounts at the subtotal', () => {
    const totals = calculateCartTotals(
      cart([
        appliedPromotion({
          discountType: PromotionDiscountTypeEnum.FixedAmount,
          amountCents: 10_000,
        }),
      ]),
    );

    expect(totals.payNowTotalCents).toBe(0);
    expect(totals.monthlyTotalCents).toBe(0);
  });
});
