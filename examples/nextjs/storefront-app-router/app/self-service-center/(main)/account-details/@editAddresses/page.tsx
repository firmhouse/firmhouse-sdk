import { Input, Select } from '@firmhouse/ui-components';
import {
  getSSCSubscriptionToken,
  updateSubscription,
} from '../../../../../lib/actions/subscription';
import { writeAccessFirmhouseClient } from '../../../../../lib/firmhouse-write';

export default async function EditAddressesForm() {
  const token = await getSSCSubscriptionToken();
  const updateAction = updateSubscription.bind(
    null,
    '(ssc)/self-service-center'
  );
  const firmhouseClient = await writeAccessFirmhouseClient();
  const subscription = await firmhouseClient.subscriptions.get(token);
  return (
    <div className="border rounded-md shadow-xl bg-white p-4 [&>.w-full]:px-0">
      <span className="text-base font-bold">Address </span>
      <form action={updateAction}>
        <Input
          name="address"
          label="Street"
          placeholder="street"
          defaultValue={subscription.address ?? ''}
          required
        />

        <Input
          name="houseNumber"
          label="House number"
          placeholder="House number"
          defaultValue={subscription.houseNumber ?? ''}
          required
        />

        <Input
          name="zipcode"
          label="Postal code / ZIP code"
          placeholder="Postal code / ZIP code"
          defaultValue={subscription.zipcode ?? ''}
          required
        />

        <Input
          name="city"
          label="City"
          placeholder="City"
          defaultValue={subscription.city ?? ''}
          required
        />

        <Select
          name="country"
          options={[
            { label: 'Netherlands', value: 'NL' },
            { label: 'Germany', value: 'DE' },
          ]}
          label="Country"
          placeholder="Country"
          defaultValue={subscription.country ?? undefined}
          required
        />

        <div className="flex flex-row-reverse mt-2">
          <button
            type="submit"
            className="bg-gray-900 text-gray-50 rounded-md p-2 my-4 font-medium"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
