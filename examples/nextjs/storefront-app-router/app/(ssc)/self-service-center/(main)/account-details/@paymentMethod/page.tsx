import { PaymentMethodIcon } from '@firmhouse/ui-components';
import { getSSCSubscriptionToken } from '../../../../../../lib/actions/subscription';
import { writeAccessFirmhouseClient } from '../../../../../../lib/firmhouse-write';

export default async function PaymentMethod() {
  const token = await getSSCSubscriptionToken();
  const firmhouseClient = await writeAccessFirmhouseClient();
  const subscription = await firmhouseClient.subscriptions.get(token);
  return (
    <div className="border rounded-md shadow-xl bg-white p-4 mt-4">
      <p className="text-base font-bold">Payment method</p>

      <div className="flex items-center justify-between border p-2 my-4 rounded-md border-gray-400">
        <div className="flex items-center">
          {subscription.paymentMethod && (
            <div className="h-8 mr-2">
              <PaymentMethodIcon paymentMethod={subscription.paymentMethod} />
            </div>
          )}
          <span className="text-sm">
            {subscription.paymentMethodTranslated}
            {subscription.paymentMethodSummary && (
              <span> ****#{subscription.paymentMethodSummary}</span>
            )}
          </span>
        </div>
        {subscription.updatePaymentMethodUrl && (
          <a
            href={subscription.updatePaymentMethodUrl}
            className="text-sm text-blue-500 underline"
            target="_blank"
          >
            Change
          </a>
        )}
      </div>
      <p className="text-gray-700 text-sm">
        In order to update your payment method, we ask you to make a
        verification payment of €0.50. This payment is required to verify your
        new payment method for monthly charges.
      </p>
    </div>
  );
}
