import { writeAccessFirmhouseClient } from '../../../../../lib/firmhouse-write';
import {
  getSSCSubscriptionToken,
  updateOrderedProductInterval,
} from '../../../../../lib/actions/subscription';
import { notFound } from 'next/navigation';
import { getFrequency } from '@firmhouse/ui-components';
import CustomFrequency from './CustomFrequency';

export default async function Frequency({
  params,
}: {
  params: { id: string };
}) {
  const token = await getSSCSubscriptionToken();
  const firmhouseClient = await writeAccessFirmhouseClient();
  const subscription = await firmhouseClient.subscriptions.get(token);
  const updateInterval = updateOrderedProductInterval.bind(
    null,
    token,
    params.id
  );
  const orderedProduct = subscription.orderedProducts?.find(
    (orderedProduct) => orderedProduct.id === params.id
  );
  if (!orderedProduct) {
    return notFound();
  }
  const product = orderedProduct.product;

  return (
    <>
      <div className="border rounded-md shadow-xl bg-white p-4">
        <span className="text-base font-bold">Adjust shipment frequency</span>

        <p className="text-sm">
          The frequency in which this product will be billed and shipped to you.
          The new frequency will apply after your next shipment.
        </p>

        <div className="mt-3 text-sm">
          <CustomFrequency
            frequency={getFrequency(
              product.intervalUnitOfMeasure,
              product.interval
            )}
            interval={orderedProduct.interval}
            unitOfMeasure={orderedProduct.intervalUnitOfMeasureType}
            updateInterval={updateInterval}
          />
        </div>
      </div>
    </>
  );
}
