import { useMemo, useState, Fragment, useEffect } from 'react';
import { useFirmhouseCart } from '../hooks';
import { CheckoutFieldsList, CheckoutField } from './checkout-fields-list';
import styles from './checkout-form.module.css';
import { getCheckoutDetailsFromForm } from '../utils/checkout';
import { TextInputProps } from './text-input';
import { CheckboxInputProps } from './checkbox-input';
import { DropdownInputProps } from './dropdown-input';
import { DateInputProps } from './date-input';
import { SubmitButtonProps } from './submit-button';
export interface CheckoutFormProps {
  className?: string;
  fields?: {
    title?: string;
    fields: CheckoutField[];
    type?: 'regular' | 'billing';
  }[];
  inputClassName?: string;
  fallback?: React.ReactNode;
  TextInputComponent?: React.ComponentType<TextInputProps>;
  CheckboxComponent?: React.ComponentType<CheckboxInputProps>;
  DropdownComponent?: React.ComponentType<DropdownInputProps>;
  EmailInputComponent?: React.ComponentType<TextInputProps>;
  PhoneNumberInputComponent?: React.ComponentType<TextInputProps>;
  DateInputComponent?: React.ComponentType<DateInputProps>;
  SubmitButtonComponent?: React.ComponentType<SubmitButtonProps>;
}

export const defaultCheckoutFields: NonNullable<CheckoutFormProps['fields']> = [
  {
    title: 'checkout.form.headers.generalInformation',
    fields: [
      { name: 'email', inputProps: { className: 'emailInput' } },
      { name: 'phoneNumber', inputProps: { className: 'emailInput' } },
    ],
  },
  {
    title: 'checkout.form.headers.shippingDetails',
    fields: [
      { name: 'name', inputProps: { className: 'nameInput' } },
      { name: 'lastName', inputProps: { className: 'lastNameInput' } },

      { name: 'address', inputProps: { className: 'addressInput' } },
      { name: 'houseNumber', inputProps: { className: 'houseNumberInput' } },
      { name: 'zipcode', inputProps: { className: 'zipcodeInput' } },
      { name: 'city', inputProps: { className: 'cityInput' } },
      {
        name: 'country',
        inputProps: { className: 'countryInput' },
      },
      {
        name: 'differentBillingAddress',
        inputProps: {
          className: 'differentBillingAddressInput',
        },
      },
    ],
  },
  {
    title: 'checkout.form.headers.billingDetails',
    type: 'billing',
    fields: [
      { name: 'billToName', inputProps: { className: 'nameInput' } },
      { name: 'billToLastName', inputProps: { className: 'lastNameInput' } },
      { name: 'billToAddress', inputProps: { className: 'addressInput' } },
      {
        name: 'billToHouseNumber',
        inputProps: { className: 'houseNumberInput' },
      },
      { name: 'billToZipcode', inputProps: { className: 'zipcodeInput' } },
      { name: 'billToCity', inputProps: { className: 'cityInput' } },
      { name: 'billToCountry', inputProps: { className: 'countryInput' } },
    ],
  },
  {
    fields: [{ name: 'submit', inputProps: { className: 'submitButton' } }],
  },
];

export function CheckoutForm({
  className,
  fields,
  fallback,
  TextInputComponent,
  CheckboxComponent,
  DateInputComponent,
  DropdownComponent,
  EmailInputComponent,
  PhoneNumberInputComponent,
  SubmitButtonComponent,
  inputClassName,
}: CheckoutFormProps) {
  const fieldGroups = fields ?? defaultCheckoutFields;
  const { updateAddressDetails, createSubscription, cart, t, loading } =
    useFirmhouseCart();
  const [differentBillingAddress, setDifferentBillingAddress] = useState(
    cart?.differentBillingAddress ?? false
  );
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const addressDetails = getCheckoutDetailsFromForm(
      event,
      cart,
      differentBillingAddress,
      fieldGroups
        .map((field) => field.fields)
        .flat()
        .map((f) => f.name)
    );
    updateAddressDetails?.(addressDetails, false)
      .then((success) => {
        if (success) {
          return createSubscription?.();
        }
        return Promise.resolve(null);
      })
      .then((paymentUrl) => {
        if (paymentUrl) {
          window.location.href = paymentUrl;
        }
      });
  };

  useEffect(() => {
    if (cart?.differentBillingAddress !== differentBillingAddress) {
      setDifferentBillingAddress(cart?.differentBillingAddress ?? false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart?.differentBillingAddress]);

  const checkoutFields = useMemo(
    () =>
      fieldGroups.map((field, index) => {
        const updatedFields = field.fields.map((f) => {
          if (f.name === 'differentBillingAddress') {
            f.inputProps = {
              ...(f.inputProps ?? {}),
              checked: differentBillingAddress,
              onChange: (
                e:
                  | React.ChangeEvent<HTMLInputElement>
                  | React.ChangeEvent<HTMLSelectElement>
              ) => {
                setDifferentBillingAddress(!differentBillingAddress);
              },
            };
          }
          if (f.name === 'country') {
            f.inputProps = {
              ...(f.inputProps ?? {}),
              onChange: (
                e:
                  | React.ChangeEvent<HTMLSelectElement>
                  | React.ChangeEvent<HTMLInputElement>
              ) => {
                updateAddressDetails?.({ country: e.target.value }, false);
              },
            };
          }
          return f;
        });
        return (field.type === 'billing' && differentBillingAddress) ||
          !field.type ||
          field.type === 'regular' ? (
          <Fragment key={`${field.title ?? ''}-${index}`}>
            {field.title && (
              <h2 className={styles.sectionHeading}>
                {field.title.startsWith('checkout.form.')
                  ? t?.(field.title)
                  : field.title}
              </h2>
            )}
            <CheckoutFieldsList
              fields={updatedFields}
              inputClassName={`${styles.input} ${inputClassName ?? ''}`}
              TextInputComponent={TextInputComponent}
              CheckboxComponent={CheckboxComponent}
              DateInputComponent={DateInputComponent}
              DropdownComponent={DropdownComponent}
              EmailInputComponent={EmailInputComponent}
              PhoneNumberInputComponent={PhoneNumberInputComponent}
              SubmitButtonComponent={SubmitButtonComponent}
            />
          </Fragment>
        ) : null;
      }),
    [
      fieldGroups,
      differentBillingAddress,
      setDifferentBillingAddress,
      updateAddressDetails,
      CheckboxComponent,
      DateInputComponent,
      DropdownComponent,
      EmailInputComponent,
      PhoneNumberInputComponent,
      SubmitButtonComponent,
      inputClassName,
      TextInputComponent,
      t,
    ]
  );
  if (!cart || !t || loading) {
    return fallback ?? null;
  }
  return (
    <form onSubmit={onSubmit} className={`${styles.form}  ${className ?? ''}`}>
      {checkoutFields}
    </form>
  );
}
