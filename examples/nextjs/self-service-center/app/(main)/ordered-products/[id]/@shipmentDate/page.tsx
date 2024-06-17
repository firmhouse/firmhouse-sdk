import { writeAccessFirmhouseClient } from '../../../../../lib/firmhouse-write';
import {
  getSSCSubscriptionToken,
  updateShipmentDate,
} from '../../../../../lib/actions/subscription';
import { notFound } from 'next/navigation';
import ShipmentDateForm from './Form';

export default async function ShipmentDate({
  params,
}: {
  params: { id: string };
}) {
  const token = await getSSCSubscriptionToken();
  const firmhouseClient = await writeAccessFirmhouseClient();
  const subscription = await firmhouseClient.subscriptions.get(token);
  const updateShipment = updateShipmentDate.bind(null, token, params.id);
  const orderedProduct = subscription.orderedProducts?.find(
    (orderedProduct) => orderedProduct.id === params.id
  );
  if (!orderedProduct) {
    return notFound();
  }

  return (
    <div className="border rounded-md shadow-xl bg-white p-4">
      <span className="text-base font-bold">Adjust date of next shipment</span>

      <p className="text-sm">
        The date on which you will get the next order delivered to you.
      </p>

      <ShipmentDateForm
        updateShipment={updateShipment}
        shipmentDate={orderedProduct.shipmentDate}
      />
    </div>
  );
}
