import {
  FirmhouseCart,
  OrderedProductIntervalUnitOfMeasure,
} from '@firmhouse/firmhouse-sdk';
import { CartProduct, formatCentsWithCurrency } from '@firmhouse/ui-components';

export interface CartProps {
  subscription: FirmhouseCart;
  onRemove: (orderedProductId: string) => void;
  onUpdateQuantity: (orderedProductId: string, quantity: number) => void;
  onUpdateInterval?: (
    orderedProductId: string,
    interval: number,
    type: OrderedProductIntervalUnitOfMeasure
  ) => void;
}

export default function Cart({
  subscription,
  onRemove,
  onUpdateQuantity,
  onUpdateInterval,
}: CartProps) {
  const { orderedProducts, amountForStartingSubscriptionCents } = subscription;
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
        <div className="flex flex-row justify-between border-t-gray-100 border-t pt-8">
          <p className="font-semibold text-sm">Subtotal (pay now)</p>
          <p className="font-light text-sm">
            {formatCentsWithCurrency(
              amountForStartingSubscriptionCents ?? 0,
              'EUR'
            )}
          </p>
        </div>
        <div className="flex flex-row justify-between border-t-gray-100 mb-4">
          <p className="font-semibold text-sm">Shipping</p>
          <p className="font-light text-sm">Calculated at next step</p>
        </div>
        <div className="flex flex-row justify-between">
          <p className="font-light">Total</p>
          <p className="font-light">
            {formatCentsWithCurrency(
              amountForStartingSubscriptionCents ?? 0,
              'EUR'
            )}{' '}
            + Shipping
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
