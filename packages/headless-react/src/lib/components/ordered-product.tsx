import {
  FirmhouseCart,
  FirmhouseOrderedProduct,
  OrderedProductIntervalUnitOfMeasure,
} from '@firmhouse/firmhouse-sdk';
import { formatCentsWithCurrency } from '../utils';
import styles from './ordered-product.module.css';
import { TranslationFunction } from '../hooks/cart';

export interface OrderedProductProps {
  billingFrequency: string | null;
  shippingFrequency: string | null;
  billsOnce: boolean;
  shipsOnce: boolean;
  intervalUnitOfMeasure:
    | 'only_once'
    | OrderedProductIntervalUnitOfMeasure
    | null;
  interval: number | null;
  orderedProduct: FirmhouseOrderedProduct;
  cart: FirmhouseCart;
  className?: string;
  t?: TranslationFunction;
}

export function OrderedProduct({
  orderedProduct,
  cart,
  className,
  billingFrequency,
  shippingFrequency,
  billsOnce,
  shipsOnce,
  interval,
  intervalUnitOfMeasure,
  t,
}: OrderedProductProps) {
  const { product, quantity, title, plan, totalAmountIncludingTaxCents } =
    orderedProduct;

  const unit: string =
    intervalUnitOfMeasure?.toString().toLowerCase() ?? 'only_once';
  return (
    <div className={`${styles.product} ${className ?? ''}`}>
      <img
        src={product.imageUrl ?? ''}
        width={64}
        height={64}
        alt={title ?? ''}
      />
      <div>
        <p className="opTitle">
          <span className="opQuantity">{quantity} x </span>
          <span className="opName">{title}</span>
        </p>
        {totalAmountIncludingTaxCents && plan === null && (
          <p className="opPrice">
            {formatCentsWithCurrency(
              totalAmountIncludingTaxCents,
              cart.currency ?? 'EUR',
              cart.locale
            )}
            <span className="opFrequency">
              {orderedProduct.recurring && ` / ${billingFrequency}`}
            </span>
          </p>
        )}
        {!billsOnce && !shipsOnce && shippingFrequency === billingFrequency && (
          <p className="billingShipping">
            {t?.(`checkout.orderedProduct.billingShippingFrequency.${unit}`, {
              count: interval ?? 0,
            }) ?? ''}
          </p>
        )}
        {plan !== null && <p className="opIncluded">Included in plan</p>}
      </div>
    </div>
  );
}
