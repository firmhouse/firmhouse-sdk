import Image from 'next/image';
import { formatCentsToEuros } from '../utils/price';
import { NumberInput } from './NumberInput';
export interface CartProductProps {
  title: string;
  imageUrl?: string | null;
  price?: number | null;
  isRecurring?: boolean;
  quantity?: number | null;
  onRemove?: () => void;
  onUpdateQuantity?: (quantity: number) => void;
}

export function CartProduct({
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
        className='px-2 h-16 w-16 rounded-2xl'
        src={imageUrl ?? ''}
        width={64}
        height={64}
        objectFit='cover'
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
          <div className='flex items-center'>
             {onUpdateQuantity && <NumberInput value={quantity ?? 1} onChange={onUpdateQuantity} />}
             <button className="text-sm font-light underline mx-2" onClick={onRemove}>Remove</button>
          </div>
      </div>
    </div>
  );
}
