import { redirect } from 'next/navigation';
import {
  getSubscriptionToken,
  isInitialized,
} from '../../lib/actions/subscription';
import { firmhouseClient } from '../../lib/firmhouse';
import { Button, Input } from '@firmhouse/ui-components';

export default async function Index() {
  const products = await firmhouseClient.products.fetchAll();
  let subscription = null;
  if (await isInitialized()) {
    subscription = await firmhouseClient.subscriptions.get(
      await getSubscriptionToken()
    );
  } else {
    redirect('/');
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <div className="flex flex-row w-11/12 max-w-5xl bg-white shadow-sm border rounded-md border-gray-100 flex-nowrap m-16">
          <form className="w-4/6 py-4 px-8 ">
            <Input label="Email address" placeholder="Email address" defaultValue={subscription.email ?? ''} type='email'/>
            <div className="flex">
              <Input name="name" label="First name" placeholder="First name" defaultValue={subscription.name ?? ''}/>
              <Input name="lastName" label="Last name" placeholder="Last name" defaultValue={subscription.lastName ?? ''}/>
            </div>
            <Input name="phoneNumber" label="Phone number" placeholder="Phone number" defaultValue={subscription.phoneNumber ?? ''}/>
            <Input name="dateOfBirth"  label="Birthday" placeholder="Birthday" defaultValue={subscription.dateOfBirth ?? ''} type='date'/>

            <div className='flex'>
              <Input name="address" label="Street" placeholder="Street" defaultValue={subscription.address ?? ''}/>
              <div className='w-1/2'><Input name="houseNumber" label="House number" placeholder="House number" defaultValue={subscription.houseNumber ?? ''}/></div>
            </div>
            <div className='flex flex-nowrap'>
                <Input name="zipcode" label="Postcode" placeholder="Postcode" defaultValue={subscription.zipcode ?? ''}/>
                <Input name="city" label="City" placeholder="City" defaultValue={subscription.city ?? ''}/>
                <Input name="country" label="Country" placeholder="Country" defaultValue={subscription.country ?? ''}/>            
            </div>
            <div className='mt-4'>
              <Input label='Accept the rental terms & conditions' type="checkbox" name="acceptTerms" defaultChecked={subscription.termsAccepted} />
            </div>
            <div className='flex px-3'>
              <button className='w-full bg-gray-900 text-gray-50 rounded-md p-2 my-4 font-semibold'>Continue to payment</button>
            </div>
          </form>
        <div className="flex-auto p-4 shadow-[-3px_0_12px_0_rgb(0,0,0,0.1)] ">
          <span>Monthly subscription</span>
        </div>
      </div>
    </div>
  );
}
