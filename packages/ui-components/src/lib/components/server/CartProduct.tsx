import Image from 'next/image';
import { formatCentsToEuros } from '../../utils/price';
import { QuantityInput } from './QuantityInput';
import { OrderedProductType } from '@firmhouse/firmhouse-sdk';
export interface CartProductProps extends OrderedProductType {
  onRemove?: (data: FormData) => void;
  onUpdateQuantity?: (data: FormData) => void;
}

export async function CartProduct({
  id,
  title,
  product,
  priceIncludingTaxCents: price,
  recurring,
  plan,
  onRemove,
  onUpdateQuantity,
  quantity,
}: CartProductProps) {
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
        {(price && plan === null) && (
          <p className="text-sm font-light">
            {formatCentsToEuros(price, 2)}
            {recurring && ' / month'}
          </p>
        )}
        {(plan !== null) && (
          <p className="text-sm font-light">
            Included in plan
          </p>
        )}
        <div className="flex items-center">
          {onUpdateQuantity && (
            <QuantityInput
              id={id}
              onUpdateQuantity={onUpdateQuantity}
              quantity={quantity ?? 1}
            />
          )}
          {onRemove && (
            <form action={onRemove}>
              <input
                type="hidden"
                name="orderedProductId"
                value={id}
                readOnly
              />
              <button className="text-sm font-light underline mx-2">
                Remove
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
