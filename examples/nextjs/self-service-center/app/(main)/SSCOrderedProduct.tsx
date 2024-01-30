import { OrderedProductType } from '@firmhouse/firmhouse-sdk';
import {
  formatCentsWithCurrency,
  formatLongDate,
  getOrderedProductInfo,
} from '@firmhouse/ui-components';
import Image from 'next/image';
export function SSCOrderedProduct({
  orderedProduct,
}: {
  orderedProduct: OrderedProductType;
}) {
  const { title, product, quantity, minimumCommitmentEndsAt } = orderedProduct;
  const { totalPrice } = getOrderedProductInfo(orderedProduct);
  return (
    <div className="bg-gray-100 p-4 rounded mt-4">
      <div className="flex md:items-center w-full">
        {product.imageUrl && (
          <Image
            className="rounded w-12 md:w-24 self-start md:self-center"
            src={product.imageUrl ?? ''}
            width={96}
            height={96}
            alt={title ?? ''}
          />
        )}
        <div className="ml-4 leading-snug md:w-2/3">
          <p className="font-semibold">{`${quantity} x ${title}`}</p>
          <div className="leading-snug text-lg">
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
          {minimumCommitmentEndsAt && (
            <span className="block text-sm mt-4">
              {`Minimum contract duration until ${formatLongDate(
                minimumCommitmentEndsAt
              )}`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
