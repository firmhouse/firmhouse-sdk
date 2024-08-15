'use client';
import {
  CheckoutForm,
  FirmhouseCartProvider,
  OrderSummary,
  OrderedProductsList,
  defaultCheckoutFields,
} from '@firmhouse/headless-react';

export interface CheckoutProps {
  apiToken: string;
}

const fields = [
  {
    ...defaultCheckoutFields[0],
    fields: [
      ...defaultCheckoutFields[0].fields,
      {
        id: '1568',
        name: '1568',
        type: 'dropdown',
        label: 'How did you find us?',
        inputProps: {
          options: [
            { label: 'Friends', value: 'Friends' },
            { label: 'Social Media', value: 'Social Media' },
            { label: 'Email', value: 'Email' },
            { label: 'Search Engine', value: 'Search Engine' },
            { label: 'Ads', value: 'Ads' },
          ],
        },
      },
    ],
  },
  ...defaultCheckoutFields.slice(1, defaultCheckoutFields.length - 2),
  {
    fields: [
      {
        name: 'marketingOptIn',
        type: 'checkbox',
        label: 'I want to receive marketing emails',
      },
      {
        name: 'termsAccepted',
        type: 'checkbox',
        label: 'I accept the terms and conditions',
      },
    ],
  },
  ...defaultCheckoutFields.slice(defaultCheckoutFields.length - 2),
];

export default function Checkout({ apiToken }: CheckoutProps) {
  return (
    <FirmhouseCartProvider
      apiToken={apiToken}
      locale="en"
      translations={{
        en: {
          opGroups: {
            months_one: 'Every month',
            months_other: 'Every {{count}} months',
            weeks_one: 'Every week',
            weeks_other: 'Every {{count}} weeks',
            days_one: 'Every day',
            days_other: 'Every {{count}} days',
          },
        },
      }}
    >
      <div className="flex lg:flex-row w-full md:flex-col p-4">
        <div className="w-full lg:w-3/4">
          <CheckoutForm fields={fields} />
        </div>
        <div className="lg:min-w-1/4">
          <h2 className="text-xl font-bold mb-8">Your order</h2>
          <OrderedProductsList onlyOneTimeProducts />
          <OrderedProductsList
            onlyRecurringProducts
            groupBy={(op, t) =>
              t?.(
                `opGroups.${op.product.intervalUnitOfMeasure?.toLocaleLowerCase()}`,
                { count: op.product.interval ?? 0 }
              ) ?? ''
            }
          />

          <OrderSummary />
        </div>
      </div>
    </FirmhouseCartProvider>
  );
}
