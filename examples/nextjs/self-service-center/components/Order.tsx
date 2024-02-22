import { FirmhouseOrder } from '@firmhouse/firmhouse-sdk';
import { Pill, formatShortDate, ChevronIcon } from '@firmhouse/ui-components';
import Image from 'next/image';
import Link from 'next/link';

export interface OrderProps {
  order: FirmhouseOrder;
  inline?: boolean;
}

export default function Order({ order, inline }: OrderProps) {
  return (
    <Link
      key={`order-${order?.id}`}
      className={`flex justify-between flex-wrap items-center z-10 bg-white border p-4 mb-4 rounded-md cursor-pointer text-gray-900 no-underline relative  hover:text-gray-900 focus:bg-gray-200 focus:border-gray-400 focus:shadow-none focus:no-underline ${
        inline
          ? 'hover:border-gray-500 my-2'
          : 'shadow-md hover:border-gray-300 hover:shadow-lg'
      }`}
      href={`/orders/${order?.id}`}
    >
      <div>
        <p className="text-xs">
          {order?.createdAt &&
            `${formatShortDate(order?.createdAt)} | Order #${order.id}`}
        </p>
        {order?.orderLines?.map((orderLine) => (
          <div
            key={`order-${order?.id}-${orderLine.productSku}`}
            className={`flex ${
              inline ? 'flex-col items-start mt-1' : 'items-center mt-3'
            }`}
          >
            {orderLine.product?.imageUrl && !inline && (
              <Image
                alt="image"
                src={orderLine.product?.imageUrl}
                width={48}
                height={48}
                className="self-start rounded w-12"
              />
            )}
            <span
              className={inline ? 'text-sm font-semibold' : 'ml-2 '}
            >{`${orderLine.quantity} x ${orderLine.productTitle}`}</span>
          </div>
        ))}
        {inline && order?.status && (
          <div className="mt-2">
            <Pill text={order?.status.toLowerCase()} color="green" />
          </div>
        )}
      </div>
      <div className="ml-auto flex items-center">
        {!inline && order?.status && (
          <Pill text={order?.status.toLowerCase()} color="green" />
        )}
        <ChevronIcon
          className={`h-7 ${inline ? 'text-gray-600' : 'text-gray'}`}
        />
      </div>
    </Link>
  );
}
