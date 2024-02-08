import { writeAccessFirmhouseClient } from '../../../../lib/firmhouse-write';
import {
  getSSCSubscriptionToken,
  removeOrderedProduct,
} from '../../../../lib/actions/subscription';
import { Header } from '../../Header';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  FHButton,
  CalendarIcon,
  TruckIcon,
  formatCentsWithCurrency,
  formatLongDate,
  getOrderedProductInfo,
} from '@firmhouse/ui-components';
import dayjs from 'dayjs';
import { calculateExpectedDeliveryDate } from '../../../../lib/projects';

export default async function OrderedProduct({
  params,
  shipmentDate,
  frequency,
}: {
  params: { id: string };
  shipmentDate: React.ReactNode;
  frequency: React.ReactNode;
}) {
  const token = await getSSCSubscriptionToken();
  const firmhouseClient = await writeAccessFirmhouseClient();
  const subscription = await firmhouseClient.subscriptions.get(token);
  const project = await firmhouseClient.projects.getCurrent();
  const isPlanBasedProject = project.projectType === 'plan_based';
  const orderedProduct = subscription.orderedProducts?.find(
    (orderedProduct) => orderedProduct.id === params.id
  );
  if (!orderedProduct) {
    return notFound();
  }
  const { title, product, quantity } = orderedProduct;
  const notShipped =
    orderedProduct.shipmentDate !== null &&
    !dayjs(orderedProduct.shipmentDate).isBefore(dayjs(), 'day');

  const { totalPrice, frequency: deliveryFrequency } =
    getOrderedProductInfo(orderedProduct);
  return (
    <>
      <Header title="Adjust your order" largePadding />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 container max-w-5xl mx-auto p-4 -mt-20">
        <div className="col-span-1 lg:col-span-4 border rounded-md shadow-xl bg-white p-4">
          <div className="lg:grid grid-cols-5 gap-4">
            <div className="col-span-3">
              <div className="lg:flex items-center">
                {product.imageUrl && (
                  <Image
                    className="self-start rounded w-24 lg:w-40 flex-shrink-0 mr-4"
                    src={product.imageUrl ?? ''}
                    width={160}
                    height={160}
                    alt={title ?? ''}
                  />
                )}
                <div className="text-xl my-2 lg:mt-0">
                  <p className="font-semibold leading-snug">{`${quantity}x ${title}`}</p>
                  <p>
                    <span>{totalPrice}</span>
                    {(quantity ?? 0) > 1 && (
                      <span className="text-sm text-gray-600">
                        {`${formatCentsWithCurrency(
                          orderedProduct.product.priceCents ?? 0,
                          'EUR',
                          null,
                          0
                        )} each`}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center col-span-2">
              <div className="text-sm">
                <p className="flex items-start">
                  <TruckIcon className="w-5 h-5 text-gray-700 mr-1" />
                  Bills & ships{' '}
                  {` ${
                    deliveryFrequency ? `every ${deliveryFrequency}` : 'once'
                  }`}
                </p>
                <p className="flex items-start my-2">
                  {notShipped && orderedProduct.shipmentDate && (
                    <>
                      <CalendarIcon className="w-5 h-5 text-gray-700 mr-1" />
                      {`Next shipment on ${formatLongDate(
                        orderedProduct.shipmentDate
                      )}`}
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {!isPlanBasedProject && <div className="mb-4">{shipmentDate}</div>}
        </div>

        <div className="lg:col-span-2">
          {!(isPlanBasedProject || orderedProduct.shipsOnlyOnce()) && (
            <div className="mb-4">{frequency}</div>
          )}
          <div id="remove_product">
            <div className="border rounded-md shadow-xl bg-white p-4">
              <p className="text-base font-bold">Remove product</p>
              <form action={removeOrderedProduct.bind(null, orderedProduct.id)}>
                <FHButton
                  type="submit"
                  className="w-full mt-2 border-red-200 !bg-red-200 text-red-700 hover:border-red-300 hover:!bg-red-300 hover:text-red-900 focus:border-red-400"
                >
                  Remove
                </FHButton>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
