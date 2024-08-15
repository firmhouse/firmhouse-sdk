import { formatCentsWithCurrency } from '../utils';
import styles from './order-summary-ui.module.css';
import { FirmhouseCart } from '@firmhouse/firmhouse-sdk';
import { TranslationFunction } from '../hooks/cart';

export interface OrderSummaryUIProps {
  className?: string;
  totalAmount: number;
  totalAmountWithCurrency: string;
  totalTaxAmount?: number;
  totalTaxAmountWithCurrency?: string;
  totalDiscountAmount?: number;
  totalDiscountAmountWithCurrency?: string;
  currency: string;
  cart: FirmhouseCart | null;
  children?: React.ReactNode;
  t?: TranslationFunction;
  locale?: string;
}

export function OrderSummaryUI({
  className,
  totalAmountWithCurrency,
  totalTaxAmount,
  cart,
  children,
  currency,
  t,
  locale,
}: OrderSummaryUIProps) {
  return (
    <div className={className}>
      <p className={`${styles.total} orderSummaryTotal`}>
        {`${t?.('checkout.orderSummary.total')}: `}
        <span>{totalAmountWithCurrency}</span>
      </p>
      {totalAmountWithCurrency && (
        <p className={`${styles.tax} orderSummaryTax`}>
          {t?.('checkout.orderSummary.tax', {
            amount: formatCentsWithCurrency(
              totalTaxAmount ?? 0,
              currency,
              locale ?? cart?.locale
            ),
          })}
        </p>
      )}
      {children}
    </div>
  );
}
