import {
  buildAdyenCheckoutOptions,
  buildAdyenDropinOptions,
  resolveAdyenCheckoutEntry,
} from '@firmhouse/firmhouse-sdk/lib/helpers/adyen';
import type { FirmhouseAdyenPaymentSession } from '@firmhouse/firmhouse-sdk/lib/helpers/types';

const session: FirmhouseAdyenPaymentSession = {
  sessionId: 'CS123',
  sessionData: 'session-data',
  expiresAt: '2026-09-03T10:00:00Z',
  clientKey: 'test_CLIENT_KEY',
  environment: 'test',
  locale: 'nl-NL',
  countryCode: 'NL',
  amountCents: 1000,
  currency: 'EUR',
  successUrl: 'https://example.com/thanks',
  cardConfiguration: { hasHolderName: true, holderNameRequired: true },
  googlePayConfiguration: null,
  paypalConfiguration: { vault: true },
};

describe('helpers/adyen.ts', () => {
  describe('resolveAdyenCheckoutEntry', () => {
    it('should return a new entry when there are no redirect parameters', () => {
      expect(resolveAdyenCheckoutEntry(new URLSearchParams())).toEqual({
        mode: 'new',
      });
    });

    it('should return a new entry when only one redirect parameter is present', () => {
      expect(
        resolveAdyenCheckoutEntry(new URLSearchParams({ sessionId: 'CS123' })),
      ).toEqual({ mode: 'new' });
    });

    it('should return a redirect entry from URLSearchParams', () => {
      expect(
        resolveAdyenCheckoutEntry(
          new URLSearchParams({
            sessionId: 'CS123',
            redirectResult: 'result',
          }),
        ),
      ).toEqual({
        mode: 'redirect',
        sessionId: 'CS123',
        redirectResult: 'result',
      });
    });

    it('should return a redirect entry from a plain object', () => {
      expect(
        resolveAdyenCheckoutEntry({
          sessionId: 'CS123',
          redirectResult: ['result'],
        }),
      ).toEqual({
        mode: 'redirect',
        sessionId: 'CS123',
        redirectResult: 'result',
      });
    });
  });

  describe('buildAdyenCheckoutOptions', () => {
    it('should include the session data for a fresh mount', () => {
      expect(buildAdyenCheckoutOptions(session)).toEqual({
        clientKey: 'test_CLIENT_KEY',
        environment: 'test',
        session: { id: 'CS123', sessionData: 'session-data' },
        amount: { value: 1000, currency: 'EUR' },
        locale: 'nl-NL',
        countryCode: 'NL',
      });
    });

    it('should use the redirected session id without session data', () => {
      const options = buildAdyenCheckoutOptions(session, {
        mode: 'redirect',
        sessionId: 'CS456',
        redirectResult: 'result',
      });

      expect(options.session).toEqual({ id: 'CS456' });
    });

    it('should leave out locale and country code when they are not set', () => {
      const options = buildAdyenCheckoutOptions({
        ...session,
        locale: null,
        countryCode: null,
      });

      expect(options).not.toHaveProperty('locale');
      expect(options).not.toHaveProperty('countryCode');
    });
  });

  describe('buildAdyenDropinOptions', () => {
    it('should mirror the card and PayPal configuration', () => {
      expect(buildAdyenDropinOptions(session)).toEqual({
        paymentMethodsConfiguration: {
          card: { hasHolderName: true, holderNameRequired: true },
          paypal: { vault: true },
        },
      });
    });

    it('should pass a disabled PayPal vault through to Drop-in', () => {
      const options = buildAdyenDropinOptions({
        ...session,
        paypalConfiguration: { vault: false },
      });

      expect(options.paymentMethodsConfiguration.paypal).toEqual({
        vault: false,
      });
    });

    it('should include the Google Pay configuration without null values', () => {
      const options = buildAdyenDropinOptions({
        ...session,
        googlePayConfiguration: {
          authJwt: null,
          merchantOrigin: null,
          merchantName: 'Firmhouse',
          merchantId: 'merchant-id',
          gatewayMerchantId: 'gateway-merchant-id',
        },
      });

      expect(options.paymentMethodsConfiguration.googlepay).toEqual({
        configuration: {
          merchantName: 'Firmhouse',
          merchantId: 'merchant-id',
          gatewayMerchantId: 'gateway-merchant-id',
        },
      });
    });

    it('should pass the multi domain JWT through to Drop-in', () => {
      const options = buildAdyenDropinOptions({
        ...session,
        googlePayConfiguration: {
          authJwt: 'signed-jwt',
          merchantOrigin: 'https://myshop.com',
          merchantName: 'Firmhouse',
          merchantId: 'merchant-id',
          gatewayMerchantId: 'gateway-merchant-id',
        },
      });

      expect(
        options.paymentMethodsConfiguration.googlepay?.configuration,
      ).toEqual({
        authJwt: 'signed-jwt',
        merchantOrigin: 'https://myshop.com',
        merchantName: 'Firmhouse',
        merchantId: 'merchant-id',
        gatewayMerchantId: 'gateway-merchant-id',
      });
    });

    it('should leave out Google Pay when there is no gateway merchant id', () => {
      const options = buildAdyenDropinOptions({
        ...session,
        googlePayConfiguration: {
          authJwt: 'signed-jwt',
          merchantOrigin: 'https://myshop.com',
          merchantName: null,
          merchantId: null,
          gatewayMerchantId: null,
        },
      });

      expect(options.paymentMethodsConfiguration.googlepay).toBeUndefined();
    });
  });
});
