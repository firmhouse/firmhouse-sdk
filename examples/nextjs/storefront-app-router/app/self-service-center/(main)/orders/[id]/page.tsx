import { getSSCSubscriptionToken } from '../../../../../lib/actions/subscription';
import { writeAccessFirmhouseClient } from '../../../../../lib/firmhouse-write';
import {
  formatCentsWithCurrency,
  formatShortDate,
} from '@firmhouse/ui-components';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function Order({ params }: { params: { id: string } }) {
  const token = await getSSCSubscriptionToken();

  const firmhouseClient = await writeAccessFirmhouseClient();
  const subscription = await firmhouseClient.subscriptions.getWith(token, {
    orders: { includeRelations: { orderLines: true } },
  });
  const orders = subscription.ordersV2?.nodes ?? [];
  const order = orders.find((order) => order?.id === params.id);
  if (!order) {
    return notFound();
  }
  const orderLines = order.orderLines ?? [];

  return (
    <>
      <div className="bg-gray-900 text-center items-center text-white text-xs">
        <div className="container mx-auto max-w-2xl pt-16 pb-13 -mb-12">
          <div className="mb-5 mt-12">
            <h1 className="text-2xl font-semibold">{`Order #${order.id}`}</h1>
            {order.createdAt && (
              <p className="text-sm opacity-75">{`Shipped on ${formatShortDate(
                order.createdAt
              )}`}</p>
            )}
          </div>
        </div>
      </div>

      <div className="container max-w-2xl mx-auto p-4">
        <div className="border rounded-md my-4 shadow-xl bg-white p-4">
          <p className="text-xs text-gray-600">Ordered items</p>
          {orderLines.map((orderLine) => (
            <div
              key={`ol-${orderLine.productSku}`}
              className="flex items-center mt-3"
            >
              {orderLine.product?.imageUrl && (
                <Image
                  alt="image"
                  src={orderLine.product?.imageUrl}
                  width={48}
                  height={48}
                  className="self-start rounded w-12"
                />
              )}
              <div className="ml-2 text-sm">
                <span className="font-bold block">{`${orderLine.quantity} x ${orderLine.productTitle}`}</span>
                {order.amountCents > 0 &&
                  orderLine.totalAmountExcludingTaxCents && (
                    <span>
                      {formatCentsWithCurrency(
                        orderLine.totalAmountExcludingTaxCents,
                        'EUR'
                      )}
                    </span>
                  )}
              </div>
            </div>
          ))}
        </div>
        {order.amountCents > 0 && (
          <div className="border rounded-md my-4 shadow-xl bg-white p-4">
            <p className="text-xs text-gray-600 mb-3">Order breakdown</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>Subtotal</p>
              <p className="text-right">
                {formatCentsWithCurrency(
                  order.amountCents - order.totalTaxCents,
                  'EUR'
                )}
              </p>
              <p>Tax</p>
              <p className="text-right">
                {order.totalTaxCents
                  ? formatCentsWithCurrency(order.totalTaxCents, 'EUR')
                  : '-'}
              </p>
              <p>Discount</p>
              <p className="text-right">
                {formatCentsWithCurrency(
                  order.discountExclTaxCents ?? 0,
                  'EUR'
                )}
              </p>
              <p className="font-bold">Total</p>
              <p className="text-right font-bold">
                {formatCentsWithCurrency(order.amountCents, 'EUR')}
              </p>
            </div>
          </div>
        )}

        <div className="border rounded-md my-4 shadow-xl bg-white p-4">
          <p className="text-xs text-gray-600 mb-3">Shipped to</p>
          <div>
            {subscription.fullName}
            <br />
            {subscription.address}
          </div>
        </div>
      </div>
    </>
  );
}
