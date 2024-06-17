import { getSSCSubscriptionToken } from '../../../lib/actions/subscription';
import { writeAccessFirmhouseClient } from '../../../lib/firmhouse-write';
import Order from '../../../components/Order';
import { Header } from '../Header';

export default async function Orders() {
  const token = await getSSCSubscriptionToken();

  const firmhouseClient = await writeAccessFirmhouseClient();
  const subscription = await firmhouseClient.subscriptions.get(token, {
    orders: { includeRelations: { orderLines: true } },
  });
  const orders = subscription.ordersV2?.results ?? [];
  return (
    <>
      <Header title="Orders" byline="An overview of all your orders" />

      <div className="container max-w-2xl mx-auto p-4">
        {orders.map((order) => (
          <Order key={`order-${order?.id}`} order={order} />
        ))}
      </div>
    </>
  );
}
