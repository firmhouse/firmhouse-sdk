'use client';
import { FirmhouseCart } from '@firmhouse/firmhouse-sdk';
import { CheckoutTranslations } from '../config/translations';
import { FirmhouseCartContext, useCart } from '../hooks/cart';
const defaultCountries = ['NL', 'DE', 'BE', 'LU', 'AT', 'CH'];
export interface CartProviderProps {
  children?: React.ReactNode;
  apiToken: string;
  paymentPageUrl?: string;
  paymentSuccessPageUrl?: string;
  availableCountries?: string[];
  translations?: Partial<CheckoutTranslations>;
  initialFirmhouseCart?: FirmhouseCart | null;
  cartToken?: string;
}
export function FirmhouseCartProvider(props: CartProviderProps) {
  const {
    children,
    paymentPageUrl,
    paymentSuccessPageUrl,
    availableCountries,
    translations,
    initialFirmhouseCart,
    cartToken,
  } = props;
  const cartAndActions = useCart(
    props.apiToken,
    paymentPageUrl ?? '',
    paymentSuccessPageUrl ?? '',
    cartToken,
    initialFirmhouseCart,
    translations ?? {},
    availableCountries ?? defaultCountries
  );

  return (
    <FirmhouseCartContext.Provider value={cartAndActions}>
      {children}
    </FirmhouseCartContext.Provider>
  );
}
