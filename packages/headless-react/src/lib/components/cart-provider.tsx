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
  locale?: string;
  fallback?: React.ReactNode;
}
export function FirmhouseCartProvider({
  children,
  apiToken,
  paymentPageUrl,
  paymentSuccessPageUrl,
  availableCountries,
  translations,
  initialFirmhouseCart,
  cartToken,
  locale,
  fallback,
}: CartProviderProps) {
  const cartAndActions = useCart(
    apiToken,
    paymentPageUrl ?? '',
    paymentSuccessPageUrl ?? '',
    cartToken,
    initialFirmhouseCart,
    translations ?? {},
    availableCountries ?? defaultCountries,
    locale
  );

  return (
    <FirmhouseCartContext.Provider value={cartAndActions}>
      {fallback &&
      (!cartAndActions.cart || !cartAndActions.t || cartAndActions.loading)
        ? fallback
        : children}
    </FirmhouseCartContext.Provider>
  );
}
