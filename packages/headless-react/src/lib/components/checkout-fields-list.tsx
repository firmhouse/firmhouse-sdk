import React, { useMemo } from 'react';
import { TextInput, TextInputProps } from './text-input';
import { DropdownInput, DropdownInputProps } from './dropdown-input';
import { CheckboxInput, CheckboxInputProps } from './checkbox-input';
import { getAvailableCountryOptions } from '../utils/countries';
import { FirmhouseCart } from '@firmhouse/firmhouse-sdk';
import styles from './checkout-fields-list.module.css';
import { TranslationFunction, useFirmhouseCart } from '../hooks/cart';
import { DateInput, DateInputProps } from './date-input';
import { SubmitButton, SubmitButtonProps } from './submit-button';

type PartialInputProps =
  | Partial<DropdownInputProps>
  | Partial<CheckboxInputProps>
  | Partial<TextInputProps>;

interface BaseCheckoutField {
  name: string;
  label?: string | React.ReactNode;
  type?: CheckoutFieldType;
  inputProps?:
    | Partial<DropdownInputProps>
    | Partial<CheckboxInputProps>
    | Partial<TextInputProps>;
}

type CheckoutFieldType =
  | 'text'
  | 'dropdown'
  | 'date'
  | 'checkbox'
  | 'email'
  | 'tel'
  | 'hidden'
  | 'submit'
  | 'break';

interface ExtraField extends BaseCheckoutField {
  id: string;
}
interface DefaultField extends BaseCheckoutField {
  name: keyof Pick<
    FirmhouseCart,
    | 'companyName'
    | 'vatNumber'
    | 'salutation'
    | 'name'
    | 'lastName'
    | 'address'
    | 'zipcode'
    | 'houseNumber'
    | 'city'
    | 'country'
    | 'state'
    | 'district'
    | 'phoneNumber'
    | 'billToCompanyName'
    | 'billToSalutation'
    | 'billToName'
    | 'billToLastName'
    | 'billToAddress'
    | 'billToZipcode'
    | 'billToHouseNumber'
    | 'billToCity'
    | 'billToCountry'
    | 'billToState'
    | 'billToDistrict'
    | 'billToPhoneNumber'
    | 'email'
    | 'differentBillingAddress'
    | 'termsAccepted'
    | 'marketingOptIn'
    | 'dateOfBirth'
  >;
}

interface BreakField extends BaseCheckoutField {
  name: 'break';
}

interface SubmitButton extends BaseCheckoutField {
  name: 'submit';
}

export type CheckoutField =
  | ExtraField
  | DefaultField
  | BreakField
  | SubmitButton;

export interface CheckoutFieldsListProps {
  fields: CheckoutField[];
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

const getDefaultProps = (
  name: string,
  tr: TranslationFunction,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: Record<string, any>,
  locale = 'en'
) => {
  const t = (key: string) => tr?.(`checkout.fields.${key}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getProps = (name: string, customProps: Record<string, any> = {}) => {
    return {
      label: t(`${name}.label`),
      placeholder: t(`${name}.placeholder`),
      ...customProps,
    };
  };

  // eslint-disable no-fallthrough
  switch (name) {
    case 'differentBillingAddress':
    case 'termsAccepted':
    case 'companyName':
    case 'vatNumber':
    case 'name':
    case 'lastName':
    case 'address':
    case 'zipcode':
    case 'houseNumber':
    case 'city':
    case 'state':
    case 'district':
    case 'billToCompanyName':
    case 'billToName':
    case 'billToLastName':
    case 'billToAddress':
    case 'billToZipcode':
    case 'billToHouseNumber':
    case 'billToCity':
    case 'billToState':
    case 'billToDistrict':
      return getProps(name);
    case 'dateOfBirth':
      return {
        label: t('dateOfBirth.label'),
        placeholder: t('dateOfBirth.placeholder'),
        type: 'date',
      };
    case 'billToSalutation':
      return {
        label: 'Salutation',
        placeholder: 'Salutation',
        options: [
          { label: t('billToSalutation.options.mr'), value: 'mr' },
          { label: t('billToSalutation.options.ms'), value: 'ms' },
          { label: t('billToSalutation.options.mx'), value: 'mx' },
        ],
      };
    case 'phoneNumber':
    case 'billToPhoneNumber':
      return getProps(name, {
        type: 'tel',
      });
    case 'salutation':
      return getProps(name, {
        type: 'dropdown',
        options: [
          { label: t('salutation.options.mr'), value: 'mr' },
          { label: t('salutation.options.ms'), value: 'ms' },
          { label: t('salutation.options.mx'), value: 'mx' },
        ],
      });
    case 'country':
      return getProps(name, {
        options: getAvailableCountryOptions(config?.availableCountries, locale),
      });
    case 'billToCountry':
      return getProps(name, {
        options: getAvailableCountryOptions(config?.availableCountries, locale),
      });
    case 'email':
      return getProps(name, {
        type: 'email',
      });
    case 'submit':
      return {
        type: 'submit',
        value: t('submit'),
      };
    default:
      return {};
  }
};

// eslint-enable no-fallthrough

function getProps<T extends PartialInputProps>(
  field: CheckoutField,
  t: TranslationFunction,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: Record<string, any>,
  cart?: FirmhouseCart | null,
  inputClassName?: string,
  locale?: string
): T {
  const { name, inputProps, label } = field;
  const isExtraField = (field as ExtraField).id !== undefined;
  const defaultProps = getDefaultProps(
    name,
    t,
    config,
    locale ?? cart?.locale ?? 'en'
  );
  const className = [inputClassName, inputProps?.className]
    .filter(Boolean)
    .join(' ');
  const p = {
    name: isExtraField ? (field as ExtraField).id : name,
    ...defaultProps,
    ...inputProps,
    label: label ?? defaultProps.label,
    className,
  } as T;

  if (!cart) {
    return p;
  }
  if (
    getFieldType(field) === 'checkbox' &&
    field.inputProps?.checked === undefined
  ) {
    p.defaultChecked = Boolean(cart?.[field.name as keyof FirmhouseCart]);
  } else {
    p.defaultValue = isExtraField
      ? cart?.extraFields.find((e) => e.extraFieldId === p.name)?.value ??
        undefined
      : (cart?.[field.name as keyof FirmhouseCart] as string);
  }
  return p;
}

function getFieldType(field: CheckoutField): CheckoutFieldType {
  if (field.type) {
    return field.type;
  }
  switch (field.name) {
    case 'companyName':
    case 'vatNumber':
    case 'name':
    case 'lastName':
    case 'address':
    case 'zipcode':
    case 'houseNumber':
    case 'city':
    case 'state':
    case 'district':
    case 'billToCompanyName':
    case 'billToName':
    case 'billToLastName':
    case 'billToAddress':
    case 'billToZipcode':
    case 'billToHouseNumber':
    case 'billToCity':
    case 'billToState':
    case 'billToDistrict':
      return 'text';
    case 'phoneNumber':
    case 'billToPhoneNumber':
      return 'tel';
    case 'email':
      return 'email';
    case 'billToCountry':
    case 'country':
    case 'salutation':
    case 'billToSalutation':
      return 'dropdown';
    case 'termsAccepted':
    case 'differentBillingAddress':
      return 'checkbox';
    case 'break':
      return 'break';
    case 'submit':
      return 'submit';
    default:
      return 'text';
  }
}

export function CheckoutFieldsList({
  fields,
  inputClassName,
  fallback,
  CheckboxComponent,
  TextInputComponent,
  DropdownComponent,
  EmailInputComponent,
  PhoneNumberInputComponent,
  DateInputComponent,
  SubmitButtonComponent,
}: CheckoutFieldsListProps) {
  const { errors, config, cart, t, loading, actionInProgress, locale } =
    useFirmhouseCart();

  const Checkbox = CheckboxComponent ?? CheckboxInput;
  const Text = TextInputComponent ?? TextInput;
  const Dropdown = DropdownComponent ?? DropdownInput;
  const Email = EmailInputComponent ?? TextInput;
  const PhoneNumber = PhoneNumberInputComponent ?? TextInput;
  const Date = DateInputComponent ?? DateInput;
  const Submit = SubmitButtonComponent ?? SubmitButton;

  const fieldComponents = useMemo(
    () => (
      <>
        {fields.map((field, index) => {
          return getFieldType(field) === 'break' ? (
            <div key={`${field}-${index}`} className={styles.break} />
          ) : (
            <React.Fragment key={`${field.name}-${index}`}>
              {getFieldType(field) === 'text' ? (
                <Text
                  {...getProps<TextInputProps>(
                    field,
                    t,
                    config,
                    cart,
                    inputClassName,
                    locale
                  )}
                  error={errors?.[field.name]}
                />
              ) : null}
              {getFieldType(field) === 'email' ? (
                <Email
                  type="email"
                  {...getProps<TextInputProps>(
                    field,
                    t,
                    config,
                    cart,
                    inputClassName,
                    locale
                  )}
                  error={errors?.[field.name]}
                />
              ) : null}
              {getFieldType(field) === 'tel' ? (
                <PhoneNumber
                  type="tel"
                  {...getProps<TextInputProps>(
                    field,
                    t,
                    config,
                    cart,
                    inputClassName,
                    locale
                  )}
                  error={errors?.[field.name]}
                />
              ) : null}
              {getFieldType(field) === 'dropdown' ? (
                <Dropdown
                  {...getProps<DropdownInputProps>(
                    field,
                    t,
                    config,
                    cart,
                    inputClassName,
                    locale
                  )}
                  error={errors?.[field.name]}
                />
              ) : null}
              {getFieldType(field) === 'checkbox' ? (
                <Checkbox
                  {...getProps<CheckboxInputProps>(
                    field,
                    t,
                    config,
                    cart,
                    inputClassName,
                    locale
                  )}
                  error={errors?.[field.name]}
                />
              ) : null}
              {getFieldType(field) === 'date' ? (
                <Date
                  {...getProps<DateInputProps>(
                    field,
                    t,
                    config,
                    cart,
                    inputClassName,
                    locale
                  )}
                  error={errors?.[field.name]}
                />
              ) : null}
              {getFieldType(field) === 'hidden' ? (
                <input
                  type="hidden"
                  {...getProps(field, t, config, cart, undefined, locale)}
                />
              ) : null}
              {getFieldType(field) === 'submit' ? (
                <Submit
                  disabled={actionInProgress}
                  {...getProps(field, t, config, cart, undefined, locale)}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </>
    ),

    [
      fields,
      cart,
      errors,
      inputClassName,
      config,
      t,
      Checkbox,
      Text,
      Dropdown,
      Email,
      PhoneNumber,
      Date,
      Submit,
      actionInProgress,
      locale,
    ]
  );

  if (!cart || !t || loading) {
    return fallback ?? null;
  }
  return fieldComponents;
}
