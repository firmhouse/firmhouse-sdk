import { FirmhouseCart } from '@firmhouse/firmhouse-sdk';
import { getOrderCalculations } from './price';

describe('getOrderCalculations', () => {
  it('uses the active promotion when calculating the pay-now total', () => {
    const cart = {
      amountForStartingSubscriptionCents: 2500,
      monthlyAmountCents: 2500,
      orderedProducts: null,
      currency: 'EUR',
      appliedPromotions: [
        {
          active: true,
          promotion: {
            discountType: 'PERCENTAGE',
            percentDiscount: 20,
          },
        },
      ],
    } as FirmhouseCart;

    expect(getOrderCalculations(cart)).toEqual({
      totalIncludingTax: 2000,
      totalDiscount: 500,
      totalTax: 0,
      currency: 'EUR',
    });
  });
});
