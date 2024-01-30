import { writeAccessFirmhouseClient } from '../../../lib/firmhouse-write';
import {
  cancelSubscription,
  getSSCSubscriptionToken,
} from '../../../lib/actions/subscription';
import { Header } from '../Header';
import {
  formatCentsWithCurrency,
  formatLongDate,
  isPastDate,
} from '@firmhouse/ui-components';
import { SSCOrderedProduct } from '../SSCOrderedProduct';
import Link from 'next/link';

export default async function Cancellation() {
  const token = await getSSCSubscriptionToken();
  const firmhouseClient = await writeAccessFirmhouseClient();
  const subscription = await firmhouseClient.subscriptions.get(token);
  const notAllowedToCancelProducts =
    subscription.orderedProducts?.filter(
      (orderedProduct) =>
        orderedProduct.minimumCommitmentEndsAt &&
        isPastDate(orderedProduct.minimumCommitmentEndsAt)
    ) ?? [];
  return (
    <>
      <Header title="Cancel subscription" />

      <div className="container max-w-2xl mx-auto p-4">
        <div className="border rounded-md my-4 shadow-xl bg-white -mt-20 p-4">
          {subscription.subscribedPlan?.inMinimumCommitment && (
            <p className="mb-0">
              You will be able to cancel your subscription as soon as the
              minimum contract duration has expired.
            </p>
          )}
          {!subscription.subscribedPlan?.allowedToCancel &&
            subscription.subscribedPlan?.inMinimumCommitment &&
            subscription.subscribedPlan?.minimumCommitmentEndsAt && (
              <div className="bg-gray-100 p-4 rounded mt-4">
                <p className="font-semibold">
                  {subscription.subscribedPlan?.name}
                </p>
                <span className="text-lg">
                  {`${formatCentsWithCurrency(
                    subscription.activePlan?.monthlyAmountIncludingTaxCents ??
                      0,
                    'EUR',
                    undefined,
                    0
                  )} / month`}
                </span>
                <span className="block text-sm mt-4">
                  <p>{`Minimum contract duration until ${formatLongDate(
                    subscription.subscribedPlan?.minimumCommitmentEndsAt
                  )}`}</p>
                </span>
              </div>
            )}

          {notAllowedToCancelProducts.map((orderedProduct) => (
            <SSCOrderedProduct
              key={orderedProduct.id}
              orderedProduct={orderedProduct}
            />
          ))}
          {subscription.subscribedPlan?.allowedToCancel && (
            <>
              <div>
                <p className="text-base">
                  Are you sure you want to cancel your subscription?
                </p>
              </div>
              <form action={cancelSubscription}>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border px-4 py-2 text-sm leading-6 font-medium w-full cursor-pointer mt-6 shadow-sm border-red-200 bg-red-200 text-red-700 hover:border-red-300 hover:bg-red-300 hover:text-red-900 focus:border-red-400 active:bg-red-200"
                >
                  Yes, cancel subscription
                </button>
              </form>
              <Link
                href="/"
                className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-6 font-medium text-gray-700 shadow-sm cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:border-gray-600 focus:outline-none focus:no-underline active:bg-white w-full mt-3 "
              >
                No, go back to subscription overview
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
