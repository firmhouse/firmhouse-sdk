import { getSSCSubscriptionToken } from '../../../../../../lib/actions/subscription';
import { writeAccessFirmhouseClient } from '../../../../../../lib/firmhouse-write';
import { SubscriptionStatus } from '@firmhouse/firmhouse-sdk';
import { LinkButton, formatCentsWithCurrency } from '@firmhouse/ui-components';
import { CartProduct } from '@firmhouse/ui-components/server';

export default async function OrderedProduct({
  params,
}: {
  params: { id: string };
}) {
  const token = await getSSCSubscriptionToken();

  const firmhouseClient = await writeAccessFirmhouseClient();
  const subscription = await firmhouseClient.subscriptions.get(token);
  const orderedProducts = subscription.orderedProducts ?? [];
  const orderedProduct = orderedProducts.find((op) => op.id === params.id);
  return (
    <>
      <div className="bg-gray-900 text-center items-center text-white text-xs">
        <div className="container mx-auto max-w-2xl pb-24 pt-16">
          <div className="mb-5 mt-12 px-4 lg:px-0">
            <h1 className="text-2xl font-semibold">Adjust your order</h1>
          </div>
        </div>
      </div>
    </>
  );
}
