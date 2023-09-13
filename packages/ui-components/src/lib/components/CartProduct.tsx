import Image from 'next/image';
import { formatCentsToEuros } from '../utils/price';
export interface CartProductProps {
  title: string;
  imageUrl?: string | null;
  price?: number | null;
  isRecurring?: boolean;
  quantity?: number | null;
  onRemove?: () => void;
}

export function CartProduct({
  title,
  imageUrl,
  price,
  isRecurring,
  onRemove,
  quantity = 1,
}: CartProductProps) {
  return (
    <div className="flex flex-row items-center my-2">
      <Image
      className='px-2'
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
          <button className="text-sm font-light underline" onClick={onRemove}>Remove</button>
      </div>
    </div>
  );
}
