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
  const { orderedProducts, amountForStartingSubscriptionCents } = subscription;
  return (
    <div className="flex h-full w-full align-middle flex-col p-8">
      <div className="h-full">
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

      <div className="flex flex-row justify-between border-t-gray-100 border-t my-4 py-8">
        <p className="font-semibold">Total</p>
        <p className="font-semibold">
          {formatCentsToEuros(amountForStartingSubscriptionCents ?? 0)}
        </p>
      </div>
    </div>
  );
}
