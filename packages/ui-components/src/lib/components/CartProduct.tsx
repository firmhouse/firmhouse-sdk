import Image from 'next/image';
import { getOrderedProductInfo } from '../utils/price';
import { NumberInput } from './NumberInput';
import {
  OrderedProductIntervalUnitOfMeasure,
  OrderedProductType,
} from '@firmhouse/firmhouse-sdk';
export interface CartProductProps extends OrderedProductType {
  onRemove?: () => void;
  onUpdateQuantity?: (quantity: number) => void;
  onUpdateInterval?: (
    interval: number,
    type: OrderedProductIntervalUnitOfMeasure
  ) => void;
}

export function CartProduct({
  onRemove,
  onUpdateQuantity,
  onUpdateInterval,
  ...orderedProduct
}: CartProductProps) {
  const { title, product, quantity, intervalUnitOfMeasureType } =
    orderedProduct;
  const orderedProductInfo = getOrderedProductInfo(orderedProduct);
  const { billingAndShipping, totalPrice } = orderedProductInfo;
  const intervalOptionParams = [
    {
      label: 'Weekly',
      interval: 1,
      unit: OrderedProductIntervalUnitOfMeasure.Weeks,
    },
    {
      label: 'Biweekly',
      interval: 2,
      unit: OrderedProductIntervalUnitOfMeasure.Weeks,
    },
    {
      label: 'Monthly',
      interval: 1,
      unit: OrderedProductIntervalUnitOfMeasure.Months,
    },
    {
      label: 'Once',
      interval: 0,
      unit: OrderedProductIntervalUnitOfMeasure.Default,
    },
  ];
  const selectedInterval =
    intervalUnitOfMeasureType === OrderedProductIntervalUnitOfMeasure.Default
      ? 3
      : intervalOptionParams.findIndex(
          ({ interval, unit }) =>
            interval === orderedProduct.interval &&
            unit === orderedProduct.intervalUnitOfMeasureType
        );
  const intervalOptions = intervalOptionParams.map(
    ({ label, interval, unit }, index) => (
      <option
        key={`${orderedProduct.id}-${label}`}
        value={index}
        selected={index === selectedInterval}
        onSelect={() => onUpdateInterval && onUpdateInterval(interval, unit)}
      >
        {label}
      </option>
    )
  );

  const onIntervalSelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const { interval, unit } = intervalOptionParams[parseInt(value)];
    onUpdateInterval && onUpdateInterval(interval, unit);
  };

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
        <div className="py-1">
          {onUpdateInterval &&
            orderedProduct.product.intervalUnitOfMeasure === 'only_once' && (
              <div className="flex flex-row items-center">
                <select
                  className="text-sm font-light mx-2 bg-white"
                  onChange={onIntervalSelected}
                >
                  {intervalOptions}
                </select>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
