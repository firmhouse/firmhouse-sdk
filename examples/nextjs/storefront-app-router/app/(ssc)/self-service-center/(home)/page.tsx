import { redirect } from 'next/navigation';
import { getSSCSubscriptionToken } from '../../../../lib/actions/subscription';
import { writeAccessFirmhouseClient } from '../../../../lib/firmhouse-write';

export default async function Home() {
  const token = await getSSCSubscriptionToken();
  if (token === '') {
    return redirect('/self-service-center/login');
  }

  const firmhouseClient = await writeAccessFirmhouseClient();
  const subscription = await firmhouseClient.subscriptions.get(token);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-6 lg:px-8">
      {subscription.activatedAt}

      {subscription.paymentMethodSummary}
      {subscription.paymentMethodTranslated}
    </div>
  );
}
