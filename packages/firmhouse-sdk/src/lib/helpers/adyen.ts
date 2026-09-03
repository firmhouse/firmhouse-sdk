import type { FirmhouseAdyenPaymentSession } from './types';

/**
 * @public
 * How a checkout page was entered.
 * @remarks
 * A checkout page is either mounted fresh, or re-entered because a payment method took
 * the customer to another page and Adyen sent them back with a result to submit.
 */
export type AdyenCheckoutEntry =
  | {
      mode: 'new';
    }
  | {
      mode: 'redirect';
      /**
       * The session the customer was redirected away from.
       */
      sessionId: string;
      /**
       * The result to hand back to Adyen with `checkout.submitDetails`.
       */
      redirectResult: string;
    };

/**
 * @public
 * Query parameters of the checkout page, as a `URLSearchParams` or a plain object.
 */
export type AdyenCheckoutQueryParams =
  URLSearchParams | Record<string, string | string[] | undefined>;

/**
 * @public
 * The Adyen client environment of the payment provider account.
 */
export type AdyenEnvironment = 'test' | 'live';

/**
 * @public
 * Options for `AdyenCheckout` from `@adyen/adyen-web`.
 */
export interface AdyenCheckoutOptions {
  /**
   * The Adyen client key of the payment provider account.
   */
  clientKey: string;
  /**
   * The Adyen client environment of the payment provider account.
   */
  environment: AdyenEnvironment;
  /**
   * The session to initialise Drop-in with. `sessionData` is left out when a redirect
   * result is handed back to Adyen.
   */
  session: { id: string; sessionData?: string };
  /**
   * The amount to pay, in minor units of the currency.
   */
  amount: { value: number; currency: string };
  /**
   * The locale to render Drop-in in, when the session has one.
   */
  locale?: string;
  /**
   * The country code (ISO 3166) of the shopper, when the session has one.
   */
  countryCode?: string;
}

/**
 * @public
 * Google Pay merchant details, as `@adyen/adyen-web` expects them.
 */
export interface AdyenGooglePayConfiguration {
  /**
   * The Adyen merchant account that receives the Google Pay payment.
   */
  gatewayMerchantId: string;
  /**
   * The Google Pay merchant identifier.
   */
  merchantId?: string;
  /**
   * The merchant name shown in the Google Pay payment sheet.
   */
  merchantName?: string;
  /**
   * The origin of the storefront that renders the Google Pay button.
   */
  merchantOrigin?: string;
  /**
   * Signed JWT that authorises Google Pay on the storefront domain.
   */
  authJwt?: string;
}

/**
 * @public
 * Options for the `Dropin` component from `@adyen/adyen-web`.
 */
export interface AdyenDropinOptions {
  /**
   * Per payment method settings that mirror the checkout settings of the project.
   */
  paymentMethodsConfiguration: {
    /**
     * Card settings of the project.
     */
    card: { hasHolderName: boolean; holderNameRequired: boolean };
    /**
     * Google Pay merchant details, when the payment provider account has them.
     */
    googlepay?: { configuration: AdyenGooglePayConfiguration };
  };
}

function readParam(
  params: AdyenCheckoutQueryParams,
  name: string,
): string | undefined {
  const value =
    params instanceof URLSearchParams ? params.get(name) : params[name];

  if (Array.isArray(value)) {
    return value[0];
  }
  return value ?? undefined;
}

/**
 * @public
 * Determines how the checkout page was entered.
 * @remarks
 * Adyen returns the customer to the `returnUrl` of the checkout with a `sessionId` and a
 * `redirectResult` after payment methods such as iDEAL, Bancontact or a 3D Secure
 * challenge. Re-initialise Drop-in with the returned session id and submit the result
 * instead of creating a new session, otherwise the customer starts paying all over again.
 * On a redirect return the payment is already with Adyen, so read the outcome before
 * doing anything else. A session cannot be created for a payment that has been paid,
 * and the webhook that pays it often lands before the customer is back.
 * @param params - Query parameters of the checkout page
 * @returns Whether the page was mounted fresh or entered from a redirect
 * @example
 * ```typescript
 * const entry = resolveAdyenCheckoutEntry(new URLSearchParams(window.location.search));
 * // The token of the payment returned by `client.carts.createSubscription`, stored
 * // before Drop-in was mounted so that it survives the redirect.
 * let paymentToken = sessionStorage.getItem('paymentToken');
 *
 * if (entry.mode === 'redirect' && paymentToken) {
 *   const status = await client.payments.waitForCheckoutStatus(subscriptionToken, paymentToken);
 *   if (status.paymentStatus === 'PAID' && status.successUrl) {
 *     window.location.assign(status.successUrl);
 *     return;
 *   }
 * }
 *
 * if (!paymentToken) {
 *   const { payment } = await client.carts.createSubscription(subscriptionToken, checkoutUrl, returnUrl);
 *   if (!payment) return;
 *   paymentToken = payment.token;
 *   sessionStorage.setItem('paymentToken', paymentToken);
 * }
 *
 * // A fresh checkout, or a retry after the customer came back from a refused payment.
 * const session = await client.payments.createAdyenSession(subscriptionToken, paymentToken);
 * const checkout = await AdyenCheckout(buildAdyenCheckoutOptions(session));
 * new Dropin(checkout, buildAdyenDropinOptions(session)).mount('#dropin-container');
 * ```
 */
export function resolveAdyenCheckoutEntry(
  params: AdyenCheckoutQueryParams,
): AdyenCheckoutEntry {
  const sessionId = readParam(params, 'sessionId');
  const redirectResult = readParam(params, 'redirectResult');

  if (!sessionId || !redirectResult) {
    return { mode: 'new' };
  }

  return { mode: 'redirect', sessionId, redirectResult };
}

/**
 * @public
 * Builds the options to pass to `AdyenCheckout` for a Firmhouse payment session.
 * @remarks
 * Leave `entry` out to mount Drop-in, including when re-mounting it after the customer
 * came back from a refused payment, because that needs the session that was just created.
 *
 * Pass the redirect entry only to hand the result back to Adyen with
 * `checkout.submitDetails`, which reports the outcome to the browser sooner than the
 * webhook does. The session id then comes from the query parameters and the session data
 * is left out, which is what Adyen expects for a redirect result. Only do this while the
 * payment is still open; Firmhouse confirms the payment either way.
 * @param session - Session returned by `client.payments.createAdyenSession`
 * @param entry - How the checkout page was entered. Defaults to a fresh mount
 * @returns Options for `AdyenCheckout`
 */
export function buildAdyenCheckoutOptions(
  session: FirmhouseAdyenPaymentSession,
  entry: AdyenCheckoutEntry = { mode: 'new' },
): AdyenCheckoutOptions {
  return {
    clientKey: session.clientKey,
    environment: session.environment,
    session:
      entry.mode === 'redirect'
        ? { id: entry.sessionId }
        : { id: session.sessionId, sessionData: session.sessionData },
    amount: { value: session.amountCents, currency: session.currency },
    ...(session.locale ? { locale: session.locale } : {}),
    ...(session.countryCode ? { countryCode: session.countryCode } : {}),
  };
}

function googlePayConfiguration(
  session: FirmhouseAdyenPaymentSession,
): AdyenGooglePayConfiguration | undefined {
  const configuration = session.googlePayConfiguration;
  if (!configuration?.gatewayMerchantId) {
    return undefined;
  }

  return {
    gatewayMerchantId: configuration.gatewayMerchantId,
    ...(configuration.merchantId
      ? { merchantId: configuration.merchantId }
      : {}),
    ...(configuration.merchantName
      ? { merchantName: configuration.merchantName }
      : {}),
    ...(configuration.merchantOrigin
      ? { merchantOrigin: configuration.merchantOrigin }
      : {}),
    ...(configuration.authJwt ? { authJwt: configuration.authJwt } : {}),
  };
}

/**
 * @public
 * Builds the Drop-in options that mirror the checkout settings of the project.
 * @remarks
 * Merge your own presentational options into the result to style Drop-in. The Google Pay
 * configuration is only present when the payment provider account has Google Pay merchant
 * details, which Adyen needs to render the Google Pay button with your own merchant.
 * @param session - Session returned by `client.payments.createAdyenSession`
 * @returns Options for the `Dropin` component
 */
export function buildAdyenDropinOptions(
  session: FirmhouseAdyenPaymentSession,
): AdyenDropinOptions {
  const googlepay = googlePayConfiguration(session);

  return {
    paymentMethodsConfiguration: {
      card: {
        hasHolderName: session.cardConfiguration.hasHolderName,
        holderNameRequired: session.cardConfiguration.holderNameRequired,
      },
      ...(googlepay ? { googlepay: { configuration: googlepay } } : {}),
    },
  };
}
