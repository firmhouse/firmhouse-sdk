import Link from 'next/link';
import { getSSCSubscriptionToken } from '../../../../../lib/actions/subscription';
import { writeAccessFirmhouseClient } from '../../../../../lib/firmhouse-write';
import { Pill, formatShortDate } from '@firmhouse/ui-components';
import Image from 'next/image';

export default async function Subscription() {
  const token = await getSSCSubscriptionToken();

  const firmhouseClient = await writeAccessFirmhouseClient();
  const subscription = await firmhouseClient.subscriptions.getWith(token, {
    orders: { includeRelations: { orderLines: true } },
  });
  const orders = subscription.ordersV2?.nodes ?? [];
  return (
    <>
      <div className="bg-gray-900 text-center items-center text-white text-xs">
        <div className="container mx-auto max-w-2xl pt-16 pb-8 -mb-8">
          <div className="mb-5 mt-12">
            <h1 className="text-2xl font-semibold">Orders</h1>
            <p className="text-sm opacity-75">An overview of all your orders</p>
          </div>
        </div>
      </div>

      <div className="container max-w-2xl mx-auto p-4">
        {orders.map((order) => (
          <Link
            key={`order-${order?.id}`}
            className="flex justify-between flex-wrap items-center z-10 bg-white border p-4 mb-4 rounded-md shadow-md cursor-pointer text-gray-900 no-underline relative hover:border-gray-300 hover:shadow-lg hover:text-gray-900 focus:bg-gray-200 focus:border-gray-400 focus:shadow-none focus:no-underline"
            href={`/self-service-center/orders/${order?.id}`}
          >
            <div>
              <p className="text-xs">
                {order?.createdAt &&
                  `${formatShortDate(order?.createdAt)} | Order #${order.id}`}
              </p>
              {order?.orderLines?.map((orderLine) => (
                <div
                  key={`order-${order?.id}-${orderLine.productSku}`}
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
                  <span className="ml-2">{`${orderLine.quantity} x ${orderLine.productTitle}`}</span>
                </div>
              ))}
            </div>
            <div className="ml-auto flex items-center">
              {order?.status && (
                <Pill text={order?.status.toLowerCase()} color="green" />
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                className="h-7 text-gray"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
