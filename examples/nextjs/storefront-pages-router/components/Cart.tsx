import { SubscriptionType } from '@firmhouse/firmhouse-sdk';
import { CartProduct, formatCentsToEuros } from '@firmhouse/ui-components';

export interface CartProps {
  subscription: SubscriptionType;
  onRemove: (orderedProductId: string) => void;
  onUpdateQuantity: (orderedProductId: string, quantity: number) => void;
}

export default function Cart({
  subscription,
  onRemove,
  onUpdateQuantity,
}: CartProps) {
  const {
    orderedProducts,
    amountForStartingSubscriptionCents,
    monthlyAmountCents,
  } = subscription;
  return (
    <div className="flex h-full w-full align-middle flex-col p-8">
      <div>
        <h2 className="font-bold text-xl">Cart</h2>
        {orderedProducts?.length === 0 && (
          <p className="text-gray-500 p-4">No products in cart</p>
        )}
        {orderedProducts?.map((orderedProduct) => (
          <CartProduct
            key={orderedProduct.id}
            title={orderedProduct.product.title}
            quantity={orderedProduct.quantity}
            isRecurring={orderedProduct.recurring}
            imageUrl={orderedProduct.product.imageUrl}
            price={orderedProduct.totalAmountIncludingTaxCents}
            onRemove={() => onRemove(orderedProduct.id)}
            onUpdateQuantity={(quantity) =>
              onUpdateQuantity(orderedProduct.id, quantity)
            }
          />
        ))}
      </div>
      <div className='mt-auto py-4'>
        <div className="flex flex-row justify-between border-t-gray-100 border-t my-4 pt-8">
          <p className="font-semibold">Subtotal (pay now)</p>
          <p className="font-light">
            {formatCentsToEuros(amountForStartingSubscriptionCents ?? 0)}
          </p>
        </div>
        <div className="flex flex-row justify-between">
          <p className="font-light">Total per month</p>
          <p className="font-light">
            {formatCentsToEuros(monthlyAmountCents ?? 0)}
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
