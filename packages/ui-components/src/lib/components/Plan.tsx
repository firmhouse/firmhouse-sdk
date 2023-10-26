import { formatCentsWithCurrency } from '../utils/price';
import { PlanType } from '@firmhouse/firmhouse-sdk';
export interface PlanProps extends PlanType {
  children?: React.ReactNode;
  locale?: string | null;
  isActive?: boolean;
  className?: string;
}

export function Plan({
  children,
  locale,
  isActive,
  className,
  ...plan
}: PlanProps) {
  return (
    <div
      className={`flex flex-col justify-between flex-shrink-0 p-4 m-2 rounded-2xl w-48 ${
        isActive
          ? 'bg-black text-white scale-105 transition-transform'
          : 'bg-white'
      } ${className ?? ''}`}
    >
      <div className="flex flex-col">
        <div className="font-semibold  whitespace-nowrap">{plan.name}</div>
        {(plan.initialAmountIncludingTaxCents ?? 1) !== 0 && (
          <div className="text-sm font-light">
            {formatCentsWithCurrency(
              plan.initialAmountIncludingTaxCents ?? 0,
              plan.currency ?? 'EUR',
              locale
            )}{' '}
            to start
          </div>
        )}
        {(plan.monthlyAmountCents ?? 0) !== 0 && (
          <div className="text-sm font-light">
            {`${formatCentsWithCurrency(
              plan.monthlyAmountCents ?? 0,
              plan.currency ?? 'EUR',
              locale
            )} / month`}
          </div>
        )}
      </div>
      <div className="p-2 justify-end">{children}</div>
    </div>
  );
}
