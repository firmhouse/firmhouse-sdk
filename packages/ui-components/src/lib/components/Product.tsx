import Image from 'next/image';
import { formatCentsToEuros } from '../utils/price';
export interface ProductProps {
  title: string;
  imageUrl?: string | null;
  price?: number | null;
  isRecurring?: boolean;
  children?: React.ReactNode;
}

export function Product({ title, imageUrl, price, children, isRecurring }: ProductProps) {
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
        { children }
      </div>
    </div>
  );
}
