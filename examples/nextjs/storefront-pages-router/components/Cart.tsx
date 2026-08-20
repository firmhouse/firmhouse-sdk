import {
  FirmhouseCart,
  OrderedProductIntervalUnitOfMeasure,
} from '@firmhouse/firmhouse-sdk';
import { CartProduct, formatCentsWithCurrency } from '@firmhouse/ui-components';

export interface CartProps {
  subscription: FirmhouseCart;
  onRemove: (orderedProductId: string) => void;
  onUpdateQuantity: (orderedProductId: string, quantity: number) => void;
  onApplyDiscountCode: (discountCode: string) => void;
  onRemoveDiscountCode: () => void;
  onUpdateInterval?: (
    orderedProductId: string,
    interval: number,
    type: OrderedProductIntervalUnitOfMeasure,
  ) => void;
}

function billingCycleDiscountCents(subscription: FirmhouseCart) {
  const amountCents = subscription.amountForStartingSubscriptionCents ?? 0;
  const promotion = subscription.appliedPromotions?.find(
    (appliedPromotion) =>
      appliedPromotion.active &&
      appliedPromotion.promotion.__typename === 'BillingCyclePromotion',
  )?.promotion;

  if (!promotion) return 0;
  if (promotion.discountType === 'FIXED_AMOUNT') {
    return Math.min(amountCents, promotion.amountCents ?? 0);
  }

  return Math.round(amountCents * ((promotion.percentDiscount ?? 0) / 100));
}

export default function Cart({
  subscription,
  onRemove,
  onUpdateQuantity,
  onApplyDiscountCode,
  onRemoveDiscountCode,
  onUpdateInterval,
}: CartProps) {
  const {
    orderedProducts,
    amountForStartingSubscriptionCents,
    orderCalculation,
  } = subscription;
  const discountCents = Math.max(
    orderCalculation?.discountInclTaxCents ?? 0,
    billingCycleDiscountCents(subscription),
  );
  const totalCents = Math.max(
    0,
    (amountForStartingSubscriptionCents ?? 0) - discountCents,
  );
  const appliedDiscountCode = subscription.appliedPromotions?.find(
    (appliedPromotion) =>
      appliedPromotion.active && appliedPromotion.discountCode,
  )?.discountCode;
  return (
    <div className="flex h-full w-full align-middle flex-col p-8">
      <div className="max-h-auto overflow-y-auto">
        <h2 className="font-bold text-xl">Cart</h2>
        {orderedProducts?.length === 0 && (
          <p className="text-gray-500 p-4">No products in cart</p>
        )}
        {orderedProducts?.map((orderedProduct) => (
          <CartProduct
            key={orderedProduct.id}
            {...orderedProduct}
            onRemove={() => onRemove(orderedProduct.id)}
            onUpdateQuantity={(quantity) =>
              onUpdateQuantity(orderedProduct.id, quantity)
            }
            onUpdateInterval={(interval, type) =>
              onUpdateInterval &&
              onUpdateInterval(orderedProduct.id, interval, type)
            }
          />
        ))}
      </div>
      <div className="mt-auto py-4">
        {appliedDiscountCode ? (
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="text-sm">{appliedDiscountCode.code}</span>
            <button
              className="text-sm underline"
              onClick={onRemoveDiscountCode}
              type="button"
            >
              Remove
            </button>
          </div>
        ) : (
          <form
            className="flex gap-2 mb-4"
            onSubmit={(event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const discountCode = new FormData(form).get('discountCode');
              if (typeof discountCode === 'string' && discountCode.length > 0) {
                onApplyDiscountCode(discountCode);
                form.reset();
              }
            }}
          >
            <input
              className="border border-gray-300 rounded-md p-2 min-w-0"
              name="discountCode"
              placeholder="Discount code"
              required
            />
            <button
              className="bg-gray-900 text-gray-50 rounded-md px-3 font-semibold"
              type="submit"
            >
              Apply
            </button>
          </form>
        )}
        <div className="flex flex-row justify-between border-t-gray-100 border-t pt-8">
          <p className="font-light text-sm">Subtotal (pay now)</p>
          <p className="font-light text-sm">
            {formatCentsWithCurrency(
              amountForStartingSubscriptionCents ?? 0,
              'EUR',
            )}
          </p>
        </div>
        {discountCents > 0 && (
          <div className="flex flex-row justify-between text-green-700">
            <p className="font-light text-sm">Discount</p>
            <p className="font-light text-sm">
              -{formatCentsWithCurrency(discountCents, 'EUR')}
            </p>
          </div>
        )}
        <div className="flex flex-row justify-between border-t-gray-100 mb-4">
          <p className="font-semibold text-sm">Shipping</p>
          <p className="font-light text-sm">Calculated at next step</p>
        </div>
        <div className="flex flex-row justify-between">
          <p className="font-light">Total</p>
          <p className="font-light">
            {formatCentsWithCurrency(totalCents, 'EUR')} + Shipping
          </p>
        </div>
        {subscription.checkoutUrl && (
          <a
            className="block text-center w-full bg-gray-900 text-gray-50 rounded-md p-2 my-4 font-semibold"
            href={subscription.checkoutUrl}
          >
            Checkout
          </a>
        )}
      </div>
    </div>
  );
}
