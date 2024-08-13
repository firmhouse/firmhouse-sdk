import { useContext, useEffect, useState, createContext, useMemo } from 'react';
import {
  CartsResource,
  FirmhouseCart,
  FirmhouseClient,
  ValidationError,
} from '@firmhouse/firmhouse-sdk';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import {
  CheckoutTranslations,
  SupportedLanguages,
  defaultTranslations,
} from '../config/translations';

i18n.use(initReactI18next).init({
  resources: defaultTranslations,
  fallbackLng: 'en',
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

const SUBSCRIPTION_TOKEN_KEY = 'Firmhouse.cartToken';

export type TranslationFunction = ReturnType<typeof useTranslation>[0] | null;

export const FirmhouseCartContext = createContext<{
  cart: FirmhouseCart | null;
  setCart?: (cart: FirmhouseCart) => void;
  firmhouseClient?: FirmhouseClient;
  setErrors?: (errors: Record<string, string> | null) => void;
  errors: Record<string, string> | null;
  setLoading?: (loading: boolean) => void;
  loading: boolean;
  setConfig?: (config: Record<string, string>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any>;
  t: TranslationFunction | null;
}>({ cart: null, errors: null, loading: true, config: {}, t: null });
export const useFirmhouseCart = () => {
  const {
    cart,
    firmhouseClient,
    setCart,
    setErrors,
    errors,
    setLoading,
    loading,
    config,
    t,
  } = useContext(FirmhouseCartContext);
  return {
    cart,
    errors,
    loading,
    config,
    ...actions(config, firmhouseClient, cart, setCart, setErrors, setLoading),
    t,
  };
};

function actions(
  config: Record<string, string>,
  firmhouseClient?: FirmhouseClient,
  cart?: FirmhouseCart | null,
  setCart?: (cart: FirmhouseCart) => void,
  setErrors?: (errors: Record<string, string> | null) => void,
  setLoading?: (loading: boolean) => void
) {
  if (!cart || !firmhouseClient || !setCart) {
    return {};
  }

  return {
    loadCart: async (cartToken: string) => {
      try {
        setLoading?.(true);
        const response = await firmhouseClient.carts.getOrCreate(cartToken);
        setCart({
          ...response,
        });
      } catch (error) {
        setErrors?.({
          error: error instanceof Error ? error.message : 'An error occurred',
        });
      }
      setLoading?.(false);
    },
    updateAddressDetails: async (
      addressDetails: (typeof CartsResource.prototype.updateAddressDetails.arguments)[1],
      doNotUpdateErrors = true
    ) => {
      let success = true;
      try {
        setErrors?.(null);
        setLoading?.(true);
        const response = await firmhouseClient.carts.updateAddressDetails(
          cart.token,
          addressDetails
        );
        setCart({
          ...response,
        });
      } catch (error) {
        if (doNotUpdateErrors) {
          success = false;
        } else if (error instanceof ValidationError) {
          success = false;
          setErrors?.(error.details);
        } else {
          success = false;
          setErrors?.({
            error: error instanceof Error ? error.message : 'An error occurred',
          });
        }
      }
      setLoading?.(false);
      return success;
    },
    createSubscription: async () => {
      try {
        setLoading?.(true);
        const response = await firmhouseClient.carts.createSubscription(
          cart.token,
          config?.paymentPageUrl ?? '',
          config?.returnUrl ?? ''
        );
        setCart({
          ...response.subscription,
        });
        return response.paymentUrl;
      } catch (error) {
        if (error instanceof ValidationError) {
          setErrors?.(error.details);
        } else {
          setErrors?.({
            error: error instanceof Error ? error.message : 'An error occurred',
          });
        }
      }
      setLoading?.(false);
    },
  };
}

export function useCart(
  firmhouseAccessToken: string,
  paymentPageUrl: string,
  returnUrl: string,
  cartToken?: string,
  initialCart?: FirmhouseCart | null,
  translations?: Partial<CheckoutTranslations>,
  availableCountries?: string[]
) {
  const firmhouseClient = useMemo(
    () =>
      new FirmhouseClient({
        apiToken: firmhouseAccessToken,
      }),
    [firmhouseAccessToken]
  );
  const { t, i18n } = useTranslation();
  const [cart, setCart] = useState(
    (initialCart ?? null) as FirmhouseCart | null
  );
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token =
      cartToken ??
      cart?.token ??
      localStorage.getItem(SUBSCRIPTION_TOKEN_KEY) ??
      undefined;
    const initialize = async (token?: string) => {
      const response = await firmhouseClient.carts.getOrCreate(token);
      setCart(response);
      localStorage.setItem(SUBSCRIPTION_TOKEN_KEY, response.token);
    };
    if (cart === null) {
      setLoading(true);
      initialize(token)
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (localStorage.getItem(SUBSCRIPTION_TOKEN_KEY) !== cart.token) {
      localStorage.setItem(SUBSCRIPTION_TOKEN_KEY, cart.token);
    }
  }, [cart, cartToken, firmhouseClient]);

  useEffect(() => {
    if (cart?.locale) {
      i18n.changeLanguage(cart.locale);
    }
  }, [cart?.locale, i18n]);

  useEffect(() => {
    Object.keys(translations ?? {}).forEach((key) => {
      i18n.addResourceBundle(
        key,
        'translation',
        translations?.[key as SupportedLanguages] ?? {},
        true
      );
    });
  }, [translations, i18n]);
  return {
    cart,
    setCart,
    firmhouseClient,
    setErrors,
    errors,
    setLoading,
    loading: loading,
    config: { paymentPageUrl, returnUrl, availableCountries },
    t,
  };
}
