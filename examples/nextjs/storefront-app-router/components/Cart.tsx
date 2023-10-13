import { SubscriptionType } from '@firmhouse/firmhouse-sdk';
import { formatCentsToEuros } from '@firmhouse/ui-components';
import { CartProduct } from '@firmhouse/ui-components/server';
import Link from 'next/link';
export interface CartProps {
  subscription?: SubscriptionType | null;
  onRemove: (data: FormData) => void;
  onUpdateQuantity: (data: FormData) => void;
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
  } = subscription ?? { orderedProducts: [] };
  const isCheckoutEnabled = (subscription?.orderedProducts ?? []).length > 0;
  return (
    <div className="flex h-full w-full align-middle justify-between flex-col p-8">
      <div className="max-h-auto overflow-y-auto">
        <h2 className="font-bold text-xl">Cart</h2>
        {orderedProducts?.length === 0 && (
          <p className="text-gray-500 p-4">No products in cart</p>
        )}
        {orderedProducts?.map((orderedProduct) => (
          <CartProduct
            key={orderedProduct.id}
            {...orderedProduct}
            onRemove={onRemove}
            onUpdateQuantity={onUpdateQuantity}
          />
        ))}
      </div>
      {isCheckoutEnabled && (
        <div className="">
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

          <Link
            className="block text-center w-full bg-gray-900 text-gray-50 rounded-md p-2 my-4 font-semibold"
            href="/checkout"
          >
            Checkout
          </Link>
        </div>
      )}
    </div>
  );
}
