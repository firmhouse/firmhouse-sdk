import { getSSCSubscriptionToken } from '../../../../lib/actions/subscription';
import { writeAccessFirmhouseClient } from '../../../../lib/firmhouse-write';
import {
  formatCentsWithCurrency,
  formatShortDate,
} from '@firmhouse/ui-components';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '../../Header';

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
      <Header
        title={`Order #${order.id}`}
        byline={
          order.createdAt
            ? `Shipped on ${formatShortDate(order.createdAt)}`
            : undefined
        }
      />

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
