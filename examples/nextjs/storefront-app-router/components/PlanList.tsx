'use client';
import { FirmhousePlan } from '@firmhouse/firmhouse-sdk';
import { updatePlan } from '../lib/actions/subscription';
import { Button, Plan } from '@firmhouse/ui-components';

export interface PlanListProps {
  plans: FirmhousePlan[];
  locale?: string | null;
  activePlanSlug?: string;
}

export default function PlanList({
  plans,
  locale,
  activePlanSlug,
}: PlanListProps) {
  return (
    <div className="flex justify-start align-middle flex-nowrap mx-auto [&>div:first-child]:ml-auto [&>div:last-child]:mr-auto">
      {plans?.map((plan) => (
        <Plan
          key={`plan-${plan.id}`}
          locale={locale}
          isActive={activePlanSlug === plan.slug}
          {...plan}
        >
          <form action={updatePlan}>
            <input type="hidden" name="planSlug" value={plan.slug} readOnly />
            {activePlanSlug !== plan.slug && <Button text="Activate plan" />}
            {activePlanSlug === plan.slug && <span>Active</span>}
          </form>
        </Plan>
      ))}
    </div>
  );
}
