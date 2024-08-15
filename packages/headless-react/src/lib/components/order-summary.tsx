import { useFirmhouseCart } from '../hooks';
import { formatCentsWithCurrency, getOrderCalculations } from '../utils';
import { OrderSummaryUI, OrderSummaryUIProps } from './order-summary-ui';

export interface OrderSummaryProps {
  className?: string;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
  OrderSummaryUIComponent?: React.ComponentType<OrderSummaryUIProps>;
}

export function OrderSummary({
  className,
  OrderSummaryUIComponent,
  children,
  fallback,
}: OrderSummaryProps) {
  const { cart, t, loading, locale } = useFirmhouseCart();
  const { totalTax, currency, totalIncludingTax } = getOrderCalculations(cart);
  const Component = OrderSummaryUIComponent ?? OrderSummaryUI;
  if (!cart || !t || loading) {
    return fallback || null;
  }
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
        locale ?? cart?.locale
      )}
      totalTaxAmount={totalTax}
      totalTaxAmountWithCurrency={formatCentsWithCurrency(
        totalTax,
        currency ?? 'EUR',
        locale ?? cart?.locale
      )}
      currency={currency ?? 'EUR'}
    />
  );
}
