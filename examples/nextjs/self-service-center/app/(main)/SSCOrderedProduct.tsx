import {
  OrderedProductType,
  SubscriptionStatus,
  SubscriptionType,
} from '@firmhouse/firmhouse-sdk';
import {
  LinkButton,
  Pill,
  ShoppingCartIcon,
  formatCentsWithCurrency,
  formatLongDate,
  getOrderedProductInfo,
} from '@firmhouse/ui-components';
import dayjs from 'dayjs';
import Image from 'next/image';
import { calculateExpectedDeliveryDate } from '../../lib/projects';

export interface SSCOrderedProductProps {
  orderedProduct: OrderedProductType;
  subscription: SubscriptionType;
  isPlanBasedProject?: boolean;
}

export function SSCOrderedProduct({
  orderedProduct,
  subscription,
  isPlanBasedProject,
}: SSCOrderedProductProps) {
  const {
    title,
    product,
    quantity,
    minimumCommitmentEndsAt,
    plan,
    shipmentDate,
  } = orderedProduct;
  const { totalPrice, frequency } = getOrderedProductInfo(orderedProduct);
  const partOfPlan = !!plan;
  const notShipped =
    shipmentDate !== null && !dayjs(shipmentDate).isBefore(dayjs(), 'day');
  if (partOfPlan) {
    return (
      <div className="flex">
        {product.imageUrl && (
          <Image
            className="self-start rounded w-12 md:w-20"
            src={product.imageUrl ?? ''}
            width={96}
            height={96}
            alt={title ?? ''}
          />
        )}
        <div className="text-sm ml-4 leading-snug w-2/3">
          <p className="text-base font-bold">{`${quantity}x ${title}`}</p>
          <div className="text-gray-900">
            <p>
              <span>
                {totalPrice} {frequency}
              </span>
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
          {minimumCommitmentEndsAt && (
            <span className="block text-sm mt-4">
              {`Minimum contract duration until ${formatLongDate(
                minimumCommitmentEndsAt
              )}`}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`pt-4 w-full ${
        isPlanBasedProject
          ? ''
          : 'pb-4 border-b border-gray-400 last:border-b-0'
      }`}
    >
      <div className="flex">
        <div className="flex md:items-center w-full">
          {product.imageUrl && (
            <Image
              className="self-start rounded w-12 md:w-20"
              src={product.imageUrl ?? ''}
              width={96}
              height={96}
              alt={title ?? ''}
            />
          )}
          <div className="md:text-xl ml-4 leading-snug md:w-2/3">
            <p className="text-lg font-semibold">{`${quantity}x ${title}`}</p>
            <div className="leading-snug text-base">
              <p>
                <span>{`${totalPrice}${
                  frequency ? ` / ${frequency}` : ''
                }`}</span>
                {(quantity ?? 0) > 1 && (
                  <span className="text-sm text-gray-600">
                    {`${formatCentsWithCurrency(
                      product.priceCents ?? 0,
                      'EUR',
                      null,
                      0
                    )} each`}
                  </span>
                )}
              </p>
              {isPlanBasedProject && (
                <div className="text-sm md:text-sm mt-1">
                  <p>Ships {}</p>

                  {shipmentDate !== null && notShipped && (
                    <p>Next shipment on {formatLongDate(shipmentDate)}</p>
                  )}

                  {minimumCommitmentEndsAt && (
                    <span className="block text-sm mt-4">
                      {`Minimum contract duration until ${formatLongDate(
                        minimumCommitmentEndsAt
                      )}`}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {!isPlanBasedProject && (
        <div className="md:flex justify-between items-center mt-2">
          {!orderedProduct.followsPlanSchedule() && (
            <div className="text-sm md:text-sm">
              <p>{`Bills & ships ${
                frequency ? `every ${frequency}` : 'once'
              }`}</p>
              {notShipped && (
                <>
                  <p>
                    {`Next shipment on ${formatLongDate(
                      calculateExpectedDeliveryDate(shipmentDate)
                    )}`}
                  </p>
                  {subscription.status === SubscriptionStatus.Paused &&
                    shipmentDate && (
                      <Pill
                        color="indigo"
                        text={`Resume your subscription before ${formatLongDate(
                          shipmentDate
                        )} to receive this order`}
                      />
                    )}
                </>
              )}
            </div>
          )}
          <div className="mt-3 md:mt-auto ml-auto">
            <LinkButton
              href={`/ordered-products/${orderedProduct.id}`}
              className="w-full md:ml-1 whitespace-nowrap"
            >
              Adjust order
            </LinkButton>
          </div>
        </div>
      )}
    </div>
  );
}
