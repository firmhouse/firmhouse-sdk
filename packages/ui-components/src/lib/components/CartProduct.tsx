import Image from 'next/image';
import { formatCentsToEuros, getOrderedProductInfo } from '../utils/price';
import { NumberInput } from './NumberInput';
import { OrderedProductType } from '@firmhouse/firmhouse-sdk';
export interface CartProductProps extends OrderedProductType {
  onRemove?: () => void;
  onUpdateQuantity?: (quantity: number) => void;
}

export function CartProduct({
  onRemove,
  onUpdateQuantity,
  ...orderedProduct
}: CartProductProps) {
  const { title, product, quantity } = orderedProduct;
  const orderedProductInfo = getOrderedProductInfo(orderedProduct);
  const { billingAndShipping, totalPrice } = orderedProductInfo;
  return (
    <div className="flex flex-row items-center my-2">
      <Image
        className="px-2 h-12 w-16 rounded-2xl object-cover"
        src={product.imageUrl ?? ''}
        width={64}
        height={64}
        alt={title ?? ''}
      />
      <div className="flex-col justify-between px-2">
        <p className="font-semibold">
          {title} x {quantity}
        </p>
        {billingAndShipping && (
          <p className="text-sm font-light text-gray-500">
            {billingAndShipping}
          </p>
        )}
        {totalPrice && <p className="text-sm font-light">{totalPrice}</p>}
        <div className="flex items-center">
          {onUpdateQuantity && (
            <NumberInput value={quantity ?? 1} onChange={onUpdateQuantity} />
          )}
          <button
            className="text-sm font-light underline mx-2"
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
