'use client';
import {
  CheckoutForm,
  type CheckoutFormProps,
  FirmhouseCartProvider,
  OrderSummary,
  OrderedProductsList,
  defaultCheckoutFields,
  useFirmhouseCart,
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
] satisfies NonNullable<CheckoutFormProps['fields']>;

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
                { count: op.product.interval ?? 0 },
              ) ?? ''
            }
          />

          <DiscountCode />
          <OrderSummary />
        </div>
      </div>
    </FirmhouseCartProvider>
  );
}

function DiscountCode() {
  const {
    cart,
    applyDiscountCode,
    removeDiscountCode,
    actionInProgress,
    errors,
  } = useFirmhouseCart();
  const appliedDiscountCode = cart?.appliedPromotions?.find(
    (appliedPromotion) =>
      appliedPromotion.active && appliedPromotion.discountCode,
  )?.discountCode;

  if (appliedDiscountCode) {
    return (
      <div className="flex items-center justify-between gap-2 my-4">
        <span className="text-sm">Discount: {appliedDiscountCode.code}</span>
        <button
          className="text-sm underline disabled:opacity-50"
          disabled={actionInProgress}
          onClick={() => removeDiscountCode?.()}
          type="button"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-2 my-4"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const discountCode = new FormData(form).get('discountCode');
        if (typeof discountCode === 'string' && discountCode.length > 0) {
          applyDiscountCode?.(discountCode).then(() => form.reset());
        }
      }}
    >
      <div className="flex gap-2">
        <input
          className="border border-gray-300 rounded-md p-2 min-w-0"
          disabled={actionInProgress}
          name="discountCode"
          placeholder="Discount code"
          required
        />
        <button
          className="bg-gray-900 text-gray-50 rounded-md px-3 font-semibold disabled:opacity-50"
          disabled={actionInProgress}
          type="submit"
        >
          Apply
        </button>
      </div>
      {errors && (
        <p className="text-sm text-red-700">{Object.values(errors)[0]}</p>
      )}
    </form>
  );
}
