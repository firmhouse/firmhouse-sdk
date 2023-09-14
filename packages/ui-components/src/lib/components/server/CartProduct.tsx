import Image from 'next/image';
import { formatCentsToEuros } from '../../utils/price';
import { QuantityInput } from './QuantityInput';
export interface CartProductProps {
  title: string;
  id: string;
  imageUrl?: string | null;
  price?: number | null;
  isRecurring?: boolean;
  quantity?: number;
  onRemove: (data: FormData) => void;
  onUpdateQuantity: (data: FormData) => void;
}

export async function CartProduct({
  id,
  title,
  imageUrl,
  price,
  isRecurring,
  onRemove,
  onUpdateQuantity,
  quantity = 1,
}: CartProductProps) {
  return (
    <div className="flex flex-row items-center my-2">
      <Image
        className="px-2"
        src={imageUrl ?? ''}
        width={75}
        height={75}
        alt={title}
      />
      <div className="flex-col justify-between px-2">
        <p className="font-semibold">
          {title} x {quantity}
        </p>
        {price && (
          <p className="text-sm font-light">
            {formatCentsToEuros(price, 2)}
            {isRecurring && ' / month'}
          </p>
        )}
        <div className="flex items-center">
          <QuantityInput
            id={id}
            onUpdateQuantity={onUpdateQuantity}
            quantity={quantity}
          />
          <form action={onRemove}>
            <input type="hidden" name="orderedProductId" value={id} readOnly />
            <button className="text-sm font-light underline mx-2">
              Remove
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
