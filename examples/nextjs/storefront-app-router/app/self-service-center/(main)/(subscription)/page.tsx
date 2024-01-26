import { getSSCSubscriptionToken } from '../../../../lib/actions/subscription';
import { writeAccessFirmhouseClient } from '../../../../lib/firmhouse-write';
import { SubscriptionStatus } from '@firmhouse/firmhouse-sdk';
import { formatCentsWithCurrency, Chevron } from '@firmhouse/ui-components';
import { CartProduct } from '@firmhouse/ui-components/server';
import Link from 'next/link';
import Order from '../../../../components/Order';
import Invoice from '../../../../components/Invoice';

export default async function Subscription() {
  const token = await getSSCSubscriptionToken();

  const firmhouseClient = await writeAccessFirmhouseClient();
  const subscription = await firmhouseClient.subscriptions.getWith(token, {
    orders: { first: 3, includeRelations: { orderLines: true } },
  });
  const { results: invoices } = await firmhouseClient.invoices.fetchAll(
    {
      subscriptionId: subscription.id,
      first: 3,
    },
    {
      originalInvoice: true,
    }
  );
  const orderedProducts = subscription.orderedProducts ?? [];
  const planProducts = orderedProducts.filter((op) => op.plan !== null);
  const additionalProducts = orderedProducts.filter((op) => op.plan === null);
  const latestOrders = subscription.ordersV2?.nodes ?? [];

  return (
    <>
      <div className="bg-gray-900 text-center items-center text-white text-xs">
        <div className="container mx-auto max-w-2xl pb-24 pt-16">
          <div className="mb-5 mt-12 px-4 lg:px-0">
            <h1 className="text-2xl font-semibold">
              Hello {subscription.name}
            </h1>
            <p className="text-sm opacity-75">Manage your subscription</p>
          </div>
        </div>
      </div>
      <div className="lg:grid grid-cols-3 gap-4 container max-w-5xl mx-auto p-4 -mt-20">
        <div className="col-span-2">
          <p className="text-white text-sm font-semibold -mt-5 leading-5">
            Your subscription (#{subscription.id})
          </p>
          <div
            id="subscription-summary"
            className="border rounded-md mb-4 shadow-xl bg-white p-4"
          >
            {subscription.status === SubscriptionStatus.Stopped && (
              <div className="px-4 py-12 text-center">
                <h1 className="font-bold text-lg">No active subscription</h1>
                <p>You currently don&apos;t have an active subscription</p>
              </div>
            )}
            {subscription.status ===
              SubscriptionStatus.CancellationInProgress && (
              <div className="md:flex justify-between items-center -mt-2 p-2 mb-4 -mx-1 pb-1 bg-yellow-300 bg-opacity-25 rounded-md border border-yellow-400 border-opacity-25">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">Cancellation in progress.</span>
                  Your subscription will be cancelled as soon as the product
                  return is confirmed.
                </p>
              </div>
            )}
            {subscription.status === SubscriptionStatus.PendingCancellation && (
              <div className="md:flex justify-between items-center -mt-2 p-2 mb-4 -mx-1 pb-1 bg-yellow-300 bg-opacity-25 rounded-md border border-yellow-400 border-opacity-25">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">Pending cancellation.</span>
                </p>
              </div>
            )}
            <div className="border-b border-gray-400 last:border-b-0 pb-2 mb-2">
              <div className="flex items-center justify-between">
                <div className="w-2/3 text-sm leading-snug">
                  <p>Your plan</p>
                  <p className="font-semibold">
                    {subscription.subscribedPlan?.name}
                    {subscription.subscribedPlan?.minimumCommitmentEndsAt &&
                      subscription.subscribedPlan?.inMinimumCommitment &&
                      '*'}
                  </p>
                </div>
                <div className="text-right">
                  {subscription.activePlan?.monthlyAmountIncludingTaxCents &&
                    `${formatCentsWithCurrency(
                      subscription.activePlan?.monthlyAmountIncludingTaxCents,
                      subscription.activePlan?.currency || 'EUR',
                      undefined,
                      0
                    )} / month`}
                </div>
              </div>

              {planProducts.length > 0 && (
                <>
                  <p className="text-sm my-3">Includes:</p>
                  <div className="grid lg:grid-cols-2 gap-4 pb-2">
                    {planProducts.map((op) => (
                      <CartProduct
                        key={op.id}
                        {...op}
                        plan={null}
                        priceIncludingTaxCents={null}
                      />
                    ))}
                  </div>
                </>
              )}
              {subscription.subscribedPlan?.minimumCommitmentEndsAt &&
                subscription.subscribedPlan?.inMinimumCommitment && (
                  <span className="text-xs text-gray-600">
                    Minimum contract duration until{' '}
                    {Intl.DateTimeFormat('en-US', {
                      dateStyle: 'long',
                      timeStyle: 'short',
                      hour12: false,
                    }).format(
                      new Date(
                        subscription.subscribedPlan?.minimumCommitmentEndsAt
                      )
                    )}
                  </span>
                )}
            </div>

            {/* {subscription.status === SubscriptionStatus.Activated && (
              <div
                className="md:flex justify-between items-center mt-0 md:-mt-2 mb-4 pb-1 border-b border-gray-400"
                id="pause_subscription_section"
              >
                <p
                  className="text-sm text-gray-600"
                  id="pause_subscription_hint"
                >
                  Going on a vacation or need a break? You can pause your
                  subscription to temporarily stop receiving new orders.
                </p>
                <form></form>
              </div>
            )} */}

            {/* {subscription.status === SubscriptionStatus.Paused && (
              <div
                className="md:flex justify-between items-center mt-0 md:-mt-2 mb-4 pb-1 border-b border-gray-400"
                id="resume_subscription_section"
              >
                <p
                  id="resume_subscription_hint"
                  className="text-sm text-gray-600"
                >
                  Your subscription is paused. We will not charge or ship your
                  next order until you resume your subscription.
                </p>
                <form action={resume}></form>
              </div>
            )} */}
            {/* <div
              className="md:flex justify-between items-center mt-0 md:-mt-2 mb-4 pb-1 border-b border-gray-400"
              id="create_return_order_section"
            >
              <p
                className="text-sm text-gray-600"
                id="create_return_order_hint"
              >
                Want to exchange or return a product?
              </p>
              <Link href="/self-service-center/return-order">Create a new return</Link>
            </div> */}

            {additionalProducts.length > 0 && (
              <div className="text-sm">
                {planProducts.length === 0
                  ? 'Active Products'
                  : 'Additional Products'}
              </div>
            )}
            {additionalProducts.map((op) => (
              <div key={op.id} className="md:flex justify-between items-center">
                <CartProduct {...op} />
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-1">
          {latestOrders.length > 0 && (
            <div className="hidden lg:block border rounded-md mb-4 shadow-xl bg-white p-4">
              <div className="text-sm">
                <span>Latest order{latestOrders.length > 1 ? 's' : ''}</span>
              </div>
              {latestOrders.map((order) => (
                <Order key={`order-${order?.id}`} order={order} inline />
              ))}
              <Link
                href={`/self-service-center/orders`}
                className="flex items-center text-gray-600 text-sm"
              >
                <span>View all your orders</span>
                <Chevron className="w-4 h-4 ml-1" />
              </Link>
            </div>
          )}

          <div className="hidden lg:block border rounded-md mb-4 shadow-xl bg-white p-4">
            <div className="text-sm">
              <span>{`Latest invoice${invoices.length > 1 ? 's' : ''}`}</span>
            </div>
            {invoices.map((invoice) => (
              <Invoice
                key={`invoice-${invoice?.id}`}
                invoice={invoice}
                inline
              />
            ))}
            <Link
              href={`/self-service-center/invoices`}
              className="flex items-center text-gray-600 text-sm"
            >
              <span>View all your invoices</span>
              <Chevron className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
