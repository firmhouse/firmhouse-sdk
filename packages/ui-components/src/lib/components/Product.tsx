import Image from 'next/image';
import { formatCentsToEuros } from '../utils/price';
export interface ProductProps {
  title: string;
  imageUrl?: string | null;
  onAddToCart?: () => void;
  price?: number | null;
  isRecurring?: boolean;
}

export function Product({ title, imageUrl, price, onAddToCart, isRecurring }: ProductProps) {
  return (
    <div className="p-4 m-2 rounded-2xl bg-white">
      <Image
        className="rounded-2xl"
        src={imageUrl ?? ''}
        width={300}
        height={300}
        alt={title}
      />
      <div className="flex justify-between my-2 px-2">
        <div>
          <span className="font-semibold text-lg">{title}</span>
          {price && (
            <span className="px-2 text-sm font-light">
              {formatCentsToEuros(price, 2)}
              {isRecurring && ' / month'}
            </span>
          )}
        </div>
        {
          <button
            onClick={onAddToCart}
            className="px-2 py-1 bg-black text-white rounded-2xl"
          >
            Add to Cart
          </button>
        }
      </div>
    </div>
  );
}
