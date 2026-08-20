import { redirect } from 'next/navigation';
import {
  getSubscriptionToken,
  isInitialized,
  applyDiscount,
  deactivatePromotion,
} from '../../lib/actions/subscription';
import { firmhouseClient } from '../../lib/firmhouse';
import { CheckoutForm } from '../../components/CheckoutForm';
import { CartProduct } from '@firmhouse/ui-components/server';
import { Input, Plan, formatCentsToEuros } from '@firmhouse/ui-components';

function billingCycleDiscountCents(
  amountCents: number,
  appliedPromotions: NonNullable<
    Awaited<ReturnType<typeof firmhouseClient.carts.get>>['appliedPromotions']
  >
) {
  const promotion = appliedPromotions.find(
    (appliedPromotion) =>
      appliedPromotion.active &&
      appliedPromotion.promotion.__typename === 'BillingCyclePromotion'
  )?.promotion;

  if (!promotion) return 0;
  if (promotion.discountType === 'FIXED_AMOUNT') {
    return Math.min(amountCents, promotion.amountCents ?? 0);
  }

  return Math.round(amountCents * ((promotion.percentDiscount ?? 0) / 100));
}

export default async function Index() {
  let subscription = null;
  if (await isInitialized()) {
    subscription = await firmhouseClient.carts.get(
      await getSubscriptionToken(),
      {
        appliedPromotions: {
          includeRelations: {
            promotion: true,
            discountCode: true,
          },
        },
      }
    );
  } else {
    redirect('/');
  }
  const {
    orderedProducts,
    monthlyAmountCents,
    amountForStartingSubscriptionCents,
    appliedPromotions,
    orderCalculation,
  } = subscription;
  const activePromotions = (appliedPromotions ?? []).filter((ap) => ap.active);
  const checkoutAmountCents = amountForStartingSubscriptionCents ?? 0;
  const monthlyAmount = monthlyAmountCents ?? 0;
  const orderDiscountCents = orderCalculation?.discountInclTaxCents ?? 0;
  const checkoutDiscountCents = Math.max(
    orderDiscountCents,
    billingCycleDiscountCents(checkoutAmountCents, activePromotions)
  );
  const monthlyDiscountCents = Math.max(
    orderDiscountCents,
    billingCycleDiscountCents(monthlyAmount, activePromotions)
  );
  const checkoutTotalCents = Math.max(
    0,
    checkoutAmountCents - checkoutDiscountCents
  );
  const monthlyTotalCents = Math.max(0, monthlyAmount - monthlyDiscountCents);
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <div className="flex flex-row w-11/12 max-w-5xl bg-white shadow-sm border rounded-md border-gray-100 flex-nowrap m-16">
        <CheckoutForm subscription={subscription} />
        <div className="flex-auto p-6 shadow-[-3px_0_12px_0_rgb(0,0,0,0.1)] ">
          <div>
            {subscription.activePlan && (
              <>
                <div className="flex flex-col align-middle relative">
                  <h3 className="text-xs font-bold px-1 m-0 py-0 text-gray-500 absolute top-2 right-0">
                    Active plan
                  </h3>
                  <Plan
                    className="!p-1 !m-0 w-auto"
                    {...subscription.activePlan}
                  >
                    <div className="-mx-2 -mt-2">
                      {subscription.activePlan.minimumCommitmentEnabled && (
                        <p>
                          <span className="text-xs">Min commitment: </span>
                          <span className="text-xs font-light">
                            {subscription.activePlan.minimumCommitmentPeriod}{' '}
                            {subscription.activePlan.minimumCommitmentUnit.toLowerCase()}
                          </span>
                        </p>
                      )}
                      {subscription.activePlan.maximumCommitmentEnabled && (
                        <p>
                          <span className="text-xs">Max commitment: </span>
                          <span className="text-xs font-light">
                            {subscription.activePlan.maximumCommitmentPeriod}{' '}
                            {subscription.activePlan.maximumCommitmentUnit?.toLowerCase()}
                          </span>
                        </p>
                      )}
                    </div>
                  </Plan>
                </div>
                <hr className="border-gray-100 border-t mb-4" />
              </>
            )}

            {orderedProducts?.map((orderedProduct) => (
              <CartProduct key={orderedProduct.id} {...orderedProduct} />
            ))}
          </div>
          <div className="-mx-6">
            {activePromotions.length > 0 && (
              <div className="flex flex-col w-full bg-gray-300 px-6 py-2">
                <h3 className="text-sm font-bold m-0 py-2">
                  Applied promotions
                </h3>
                <ul className="list-disc list-inside">
                  {subscription.appliedPromotions?.map((ap) => (
                    <li
                      className="flex justify-between items-center"
                      key={ap.id}
                    >
                      <span>{ap?.promotion.publicName}</span>
                      <form action={deactivatePromotion.bind(null, ap.id)}>
                        <button
                          type="submit"
                          className="text-lg p-2 font-light"
                        >
                          x
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activePromotions.length === 0 && (
              <form className="flex items-end px-2" action={applyDiscount}>
                <Input
                  name="discountCode"
                  placeholder="Code"
                  label="Discount Code"
                />
                <button
                  className="p-2 my-1 bg-black font-semibold text-white rounded-md"
                  type="submit"
                >
                  Apply
                </button>
              </form>
            )}
          </div>
          <div className="flex flex-row justify-between border-t-gray-100 border-t my-4 pt-8">
            <p className="font-light">Subtotal (pay now)</p>
            <p className="font-light">
              {formatCentsToEuros(amountForStartingSubscriptionCents ?? 0)}
            </p>
          </div>
          {checkoutDiscountCents > 0 && (
            <div className="flex flex-row justify-between text-green-700">
              <p className="font-light">Discount</p>
              <p className="font-light">
                -{formatCentsToEuros(checkoutDiscountCents)}
              </p>
            </div>
          )}
          <div className="flex flex-row justify-between">
            <p className="font-semibold">Total (pay now)</p>
            <p className="font-semibold">
              {formatCentsToEuros(checkoutTotalCents)}
            </p>
          </div>
          <div className="flex flex-row justify-between">
            <p className="font-light">Total per month</p>
            <p className="font-light">
              {formatCentsToEuros(monthlyTotalCents)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
