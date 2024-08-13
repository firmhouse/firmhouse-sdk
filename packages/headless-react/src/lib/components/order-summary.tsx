import { useFirmhouseCart } from '../hooks';
import { formatCentsWithCurrency, getOrderCalculations } from '../utils';
import { OrderSummaryUI, OrderSummaryUIProps } from './order-summary-ui';

export interface OrderSummaryProps {
  className?: string;
  children?: React.ReactNode;
  OrderSummaryUIComponent?: React.ComponentType<OrderSummaryUIProps>;
}

export function OrderSummary({
  className,
  OrderSummaryUIComponent,
  children,
}: OrderSummaryProps) {
  const { cart, t } = useFirmhouseCart();
  const { totalTax, currency, totalIncludingTax } = getOrderCalculations(cart);
  const Component = OrderSummaryUIComponent ?? OrderSummaryUI;
  return (
    <Component
      className={className}
      children={children}
      cart={cart}
      t={t}
      totalAmount={totalIncludingTax ?? 0}
      totalAmountWithCurrency={formatCentsWithCurrency(
        totalIncludingTax ?? 0,
        currency ?? 'EUR',
        cart?.locale
      )}
      totalTaxAmount={totalTax}
      totalTaxAmountWithCurrency={formatCentsWithCurrency(
        totalTax,
        currency ?? 'EUR',
        cart?.locale
      )}
      currency={currency ?? 'EUR'}
    />
  );
}
