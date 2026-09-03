import { _GraphQLClient as GraphQLClient } from '@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient';
import { PaymentsResource } from '@firmhouse/firmhouse-sdk/lib/resources/payments';
import {
  CreateAdyenPaymentSessionDocument,
  GetCheckoutPaymentStatusDocument,
} from '@firmhouse/firmhouse-sdk/lib/resources/payments/payments.generated';
import {
  ServerError,
  ValidationError,
} from '@firmhouse/firmhouse-sdk/lib/helpers/errors';
jest.mock('@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient');

const subscriptionToken = 'subscription-token';
const paymentToken = 'payment-token';

const session = {
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
  cardConfiguration: { hasHolderName: true, holderNameRequired: false },
  googlePayConfiguration: null,
  paypalConfiguration: { vault: true },
};

describe('lib/resources/payments/index.ts', () => {
  it('should initialize the PaymentsResource correctly', () => {
    const graphQLClient = new GraphQLClient('test', 'http://test.com');
    const testResource = new PaymentsResource(graphQLClient);
    expect(testResource).toBeInstanceOf(PaymentsResource);
  });

  describe('createAdyenSession', () => {
    it('should call the correct mutation with the subscription token header', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest.fn().mockResolvedValue({
        createAdyenPaymentSession: { session, errors: [] },
      });
      const testResource = new PaymentsResource(graphQLClient);

      const result = await testResource.createAdyenSession(
        subscriptionToken,
        paymentToken,
      );

      expect(graphQLClient.request).toHaveBeenCalledWith(
        CreateAdyenPaymentSessionDocument,
        { paymentToken },
        { 'X-Subscription-Token': subscriptionToken },
      );
      expect(result).toEqual(session);
    });

    it('should throw a ValidationError when the session could not be created', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest.fn().mockResolvedValue({
        createAdyenPaymentSession: {
          session: null,
          errors: [{ attribute: 'base', message: 'Payment has been settled.' }],
        },
      });
      const testResource = new PaymentsResource(graphQLClient);

      await expect(
        testResource.createAdyenSession(subscriptionToken, paymentToken),
      ).rejects.toThrow(ValidationError);
    });

    it('should throw a ServerError when the payload is missing', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest
        .fn()
        .mockResolvedValue({ createAdyenPaymentSession: null });
      const testResource = new PaymentsResource(graphQLClient);

      await expect(
        testResource.createAdyenSession(subscriptionToken, paymentToken),
      ).rejects.toThrow(ServerError);
    });
  });

  describe('getCheckoutStatus', () => {
    it('should call the correct query with the subscription token header', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest.fn().mockResolvedValue({
        getCheckoutPaymentStatus: {
          paymentStatus: 'PAID',
          failureReason: null,
          subscriptionStatus: 'ACTIVATED',
          successUrl: 'https://example.com/thanks',
        },
      });
      const testResource = new PaymentsResource(graphQLClient);

      const result = await testResource.getCheckoutStatus(
        subscriptionToken,
        paymentToken,
      );

      expect(graphQLClient.request).toHaveBeenCalledWith(
        GetCheckoutPaymentStatusDocument,
        { paymentToken },
        { 'X-Subscription-Token': subscriptionToken },
      );
      expect(result.paymentStatus).toBe('PAID');
    });

    it('should throw a ServerError when the status is missing', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest
        .fn()
        .mockResolvedValue({ getCheckoutPaymentStatus: null });
      const testResource = new PaymentsResource(graphQLClient);

      await expect(
        testResource.getCheckoutStatus(subscriptionToken, paymentToken),
      ).rejects.toThrow(ServerError);
    });
  });

  describe('waitForCheckoutStatus', () => {
    it('should keep polling while the payment is open', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest
        .fn()
        .mockResolvedValueOnce({
          getCheckoutPaymentStatus: {
            paymentStatus: 'OPEN',
            failureReason: null,
            subscriptionStatus: 'DRAFT',
            successUrl: null,
          },
        })
        .mockResolvedValueOnce({
          getCheckoutPaymentStatus: {
            paymentStatus: 'PAID',
            failureReason: null,
            subscriptionStatus: 'ACTIVATED',
            successUrl: 'https://example.com/thanks',
          },
        });
      const testResource = new PaymentsResource(graphQLClient);

      const result = await testResource.waitForCheckoutStatus(
        subscriptionToken,
        paymentToken,
        { intervalMs: 1, timeoutMs: 1000 },
      );

      expect(graphQLClient.request).toHaveBeenCalledTimes(2);
      expect(result.paymentStatus).toBe('PAID');
    });

    it('should return the last status when the payment stays open until the timeout', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest.fn().mockResolvedValue({
        getCheckoutPaymentStatus: {
          paymentStatus: 'OPEN',
          failureReason: null,
          subscriptionStatus: 'DRAFT',
          successUrl: null,
        },
      });
      const testResource = new PaymentsResource(graphQLClient);

      const result = await testResource.waitForCheckoutStatus(
        subscriptionToken,
        paymentToken,
        { intervalMs: 5, timeoutMs: 20 },
      );

      expect(result.paymentStatus).toBe('OPEN');
    });

    it('should stop polling when the signal is aborted', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest.fn().mockResolvedValue({
        getCheckoutPaymentStatus: {
          paymentStatus: 'OPEN',
          failureReason: null,
          subscriptionStatus: 'DRAFT',
          successUrl: null,
        },
      });
      const testResource = new PaymentsResource(graphQLClient);
      const controller = new AbortController();

      const pending = testResource.waitForCheckoutStatus(
        subscriptionToken,
        paymentToken,
        { intervalMs: 1000, timeoutMs: 10000, signal: controller.signal },
      );
      await new Promise((resolve) => setTimeout(resolve, 10));
      controller.abort();

      await expect(pending).rejects.toMatchObject({ name: 'AbortError' });
      expect(graphQLClient.request).toHaveBeenCalledTimes(1);
    });

    it('should not poll when the signal is already aborted', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest.fn();
      const testResource = new PaymentsResource(graphQLClient);
      const controller = new AbortController();
      controller.abort();

      await expect(
        testResource.waitForCheckoutStatus(subscriptionToken, paymentToken, {
          signal: controller.signal,
        }),
      ).rejects.toMatchObject({ name: 'AbortError' });
      expect(graphQLClient.request).not.toHaveBeenCalled();
    });
  });
});
