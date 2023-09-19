'use client';

import { SubscriptionType, ValidationError } from '@firmhouse/firmhouse-sdk';
import { Input, Select } from '@firmhouse/ui-components';
import { useState } from 'react';
import { updateCheckoutDetails } from '../lib/actions/subscription';

export interface CheckoutFormProps {
  subscription: SubscriptionType;
}

export function CheckoutForm({ subscription }: CheckoutFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(formData: FormData) {
    setErrors({});

    const err = await updateCheckoutDetails(formData);
    if (err !== undefined) {
      setErrors((prev) => ({ ...prev, ...err }));
    }
  }

  return (
    <form action={onSubmit} className="w-4/6 py-4 px-8 checkout">
      <p className="px-4 text-red-500 text-ellipsis w-full h-6 overflow-hidden">
        {errors.error ?? ''}
      </p>
      <Input
        name="email"
        label="Email address"
        placeholder="Email address"
        defaultValue={subscription.email ?? ''}
        type="email"
        error={errors.email}
        required
      />
      <div className="flex">
        <Input
          name="name"
          label="First name"
          placeholder="First name"
          defaultValue={subscription.name ?? ''}
          error={errors.name}
          required
        />
        <Input
          name="lastName"
          label="Last name"
          placeholder="Last name"
          defaultValue={subscription.lastName ?? ''}
          error={errors.lastName}
          required
        />
      </div>
      <Input
        name="phoneNumber"
        label="Phone number"
        placeholder="Phone number"
        defaultValue={subscription.phoneNumber ?? ''}
        error={errors.phoneNumber}
      />
      <Input
        name="dateOfBirth"
        label="Birthday"
        defaultValue={subscription.dateOfBirth ?? ''}
        type="text"
        placeholder="yyyy-mm-dd"
        pattern="^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$"
        error={errors.dateOfBirth}
        required
      />
      <div className="flex">
        <Input
          name="address"
          label="Street"
          placeholder="Street"
          defaultValue={subscription.address ?? ''}
          error={errors.address}
        />
        <div className="w-1/2">
          <Input
            name="houseNumber"
            label="House number"
            placeholder="House number"
            defaultValue={subscription.houseNumber ?? ''}
            error={errors.houseNumber}
          />
        </div>
      </div>
      <div className="flex flex-nowrap">
        <Input
          name="zipcode"
          label="Postcode"
          placeholder="Postcode"
          defaultValue={subscription.zipcode ?? ''}
          error={errors.zipcode}
        />
        <Input
          name="city"
          label="City"
          placeholder="City"
          defaultValue={subscription.city ?? ''}
          error={errors.city}
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
          error={errors.country}
          required
        />
      </div>
      <div className="mt-4">
        <Input
          name="termsAccepted "
          label="Accept the rental terms & conditions"
          type="checkbox"
          defaultChecked={subscription.termsAccepted}
          error={errors.termsAccepted}
        />
      </div>
      <div className="flex px-3">
        <button className="w-full bg-gray-900 text-gray-50 rounded-md p-2 my-4 font-semibold">
          Continue to payment
        </button>
      </div>
    </form>
  );
}
