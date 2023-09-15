import { redirect } from 'next/navigation';
import {
  getSubscriptionToken,
  isInitialized,
} from '../../lib/actions/subscription';
import { firmhouseClient } from '../../lib/firmhouse';
import { CheckoutForm } from '../../components/CheckoutForm';
import { CartProduct } from '@firmhouse/ui-components/server';
import { formatCentsToEuros } from '@firmhouse/ui-components';

export default async function Index() {
  let subscription = null;
  if (await isInitialized()) {
    subscription = await firmhouseClient.subscriptions.get(
      await getSubscriptionToken(),
      true
    );
  } else {
    redirect('/');
  }
  const { orderedProducts, monthlyAmountCents, amountForStartingSubscriptionCents } = subscription;
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <div className="flex flex-row w-11/12 max-w-5xl bg-white shadow-sm border rounded-md border-gray-100 flex-nowrap m-16">
        <CheckoutForm subscription={subscription} />
        <div className="flex-auto p-6 shadow-[-3px_0_12px_0_rgb(0,0,0,0.1)] ">
          <div className="">
            <h2 className="font-bold text-xl px-2">Cart</h2>
            {orderedProducts?.map((orderedProduct) => (
              <CartProduct
                id={orderedProduct.id}
                key={orderedProduct.id}
                title={orderedProduct.product.title}
                quantity={orderedProduct.quantity ?? 1}
                isRecurring={orderedProduct.recurring}
                imageUrl={orderedProduct.product.imageUrl}
                price={orderedProduct.totalAmountIncludingTaxCents}
              />
            ))}
          </div>

          <div className="flex flex-row justify-between border-t-gray-100 border-t my-4 pt-8">
            <p className="font-semibold">Subtotal (pay now)</p>
            <p className="font-light">
              {formatCentsToEuros(amountForStartingSubscriptionCents ?? 0)}
            </p>
          </div>
          <div className="flex flex-row justify-between">
            <p className="font-light">Total per month</p>
            <p className="font-light">
              {formatCentsToEuros(monthlyAmountCents ?? 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
