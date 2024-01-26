import { getSSCSubscriptionToken } from '../../../../../lib/actions/subscription';
import { writeAccessFirmhouseClient } from '../../../../../lib/firmhouse-write';
import Order from '../../../../../components/Order';

export default async function Orders() {
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
          <Order key={`order-${order?.id}`} order={order} />
        ))}
      </div>
    </>
  );
}
