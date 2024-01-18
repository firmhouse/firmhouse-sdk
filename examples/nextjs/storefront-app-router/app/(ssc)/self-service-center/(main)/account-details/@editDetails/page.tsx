import { Input } from '@firmhouse/ui-components';
import {
  getSSCSubscriptionToken,
  updateSubscription,
} from '../../../../../../lib/actions/subscription';
import { writeAccessFirmhouseClient } from '../../../../../../lib/firmhouse-write';

export default async function EditDetailsForm() {
  const token = await getSSCSubscriptionToken();

  const firmhouseClient = await writeAccessFirmhouseClient();
  const subscription = await firmhouseClient.subscriptions.get(token);
  return (
    <div className="border rounded-md shadow-xl bg-white p-4 [&>.w-full]:px-0">
      <span className="text-base font-bold">Personal details</span>
      <form action={updateSubscription}>
        <input
          type="hidden"
          name="path"
          value="(ssc)/self-service-center/account-details/@editDetails"
        />
        <Input
          name="name"
          label="First name"
          placeholder="First name"
          defaultValue={subscription.name ?? ''}
          required
        />

        <Input
          name="lastName"
          label="Last name"
          placeholder="Last name"
          defaultValue={subscription.lastName ?? ''}
          required
        />

        <Input
          name="phoneNumber"
          label="Phone number"
          placeholder="Phone number"
          defaultValue={subscription.phoneNumber ?? ''}
        />

        <div className="flex flex-row-reverse mt-2">
          <button className="bg-gray-900 text-gray-50 rounded-md p-2 my-4 font-medium">
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
