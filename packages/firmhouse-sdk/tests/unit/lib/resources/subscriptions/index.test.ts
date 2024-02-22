import {
  SubscriptionsResource,
  CancelSubscriptionInput,
  PauseSubscriptionInput,
  ResumeSubscriptionInput,
} from '@firmhouse/firmhouse-sdk/lib/resources/subscriptions';
import {
  GetSubscriptionBySelfServiceCenterLoginTokenDocument,
  GetSubscriptionDocument,
  UpdateOrderedProductDocument,
  CancelSubcscriptionDocument,
  PauseSubscriptionDocument,
  ResumeSubscriptionDocument,
} from '@firmhouse/firmhouse-sdk/lib/resources/subscriptions/subscriptions.generated';

import { _GraphQLClient } from '@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient';

import { SubscriptionStatus } from '@firmhouse/firmhouse-sdk/lib/graphql/generated';

jest.mock('@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient');

const subscription = {
  token: 'test',
  startDate: '',
  status: SubscriptionStatus.Activated,
  termsAccepted: false,
  extraFields: [],
  orderedProducts: [],
  createdAt: null,
  id: null,
  metadata: undefined,
  updatedAt: null,
  address: null,
  amountForStartingSubscriptionCents: null,
  billToAddress: null,
  billToCity: null,
  billToCompanyName: null,
  billToCountry: null,
  billToDistrict: null,
  billToFullAddress: null,
  billToFullName: null,
  billToHouseNumber: null,
  billToLastName: null,
  billToName: null,
  billToPhoneNumber: null,
  billToSalutation: null,
  billToState: null,
  billToZipcode: null,
  chargeDayOfTheMonth: null,
  checkoutUrl: null,
  city: null,
  companyName: null,
  country: null,
  currency: null,
  customerId: null,
  customerReference: null,
  dateOfBirth: null,
  differentBillingAddress: null,
  district: null,
  email: null,
  fullAddress: null,
  fullName: null,
  houseNumber: null,
  identityVerificationUrl: null,
  lastName: null,
  locale: null,
  marketingOptIn: null,
  monthlyAmountCents: null,
  name: null,
  phoneNumber: null,
  salutation: null,
  state: null,
  termsAcceptedOn: null,
  trialPeriodMonths: null,
  vatNumber: null,
  zipcode: null,
  activePlan: null,
  subscribedPlan: null,
  collectionCases: undefined,
  invoices: undefined,
  ordersV2: undefined,
};

export const subscriptionWithUtils = {
  ...subscription,
  getClosestUpcomingOrderDate: expect.any(Function),
  getClosestUpcomingOrderOrderedProducts: expect.any(Function),
};
describe('lib/resources/subscriptions/index.ts', () => {
  let mockGraphQLClient: _GraphQLClient;

  beforeEach(() => {
    mockGraphQLClient = new _GraphQLClient('test', 'http://test.com');
  });
  it('should initialize the SubscriptionsResource correctly', () => {
    const testResource = new SubscriptionsResource(mockGraphQLClient);
    expect(testResource).toBeInstanceOf(SubscriptionsResource);
  });

  describe('get', () => {
    it('should call the correct query', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        getSubscription: { ...subscription, token: 'test' },
      });
      const token = 'testToken';
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      await testResource.get(token, {
        collectionCases: true,
        verifiedIdentity: true,
        orders: {
          after: 'x',
          before: 'y',
          first: 10,
          last: 10,
          includeRelations: {
            orderLines: true,
            payment: true,
            invoice: true,
          },
        },
        invoices: {
          includeRelations: {
            collectionCase: true,
            invoiceReminders: true,
            invoiceLineItems: true,
            payment: true,
            originalInvoice: true,
          },
        },
      });
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        GetSubscriptionDocument,
        {
          token,
          includeCollectionCases: true,
          includeVerifiedIdentity: true,
          includeOrders: true,
          ordersIncludeOrderLines: true,
          ordersIncludeInvoice: true,
          ordersIncludePayment: true,
          includeInvoices: true,
          ordersAfter: 'x',
          ordersBefore: 'y',
          ordersFirst: 10,
          ordersLast: 10,
          invoicesIncludeInvoiceLineItems: true,
          invoicesIncludePayment: true,
          invoicesIncludeOriginalInvoice: true,
          invoicesIncludeInvoiceReminders: true,
          invoicesIncludeCollectionCase: true,
        },
        { 'X-Subscription-Token': token }
      );
    });

    it('should return subscription with given token', async () => {
      const token = 'testToken';
      const activeSubscription = { ...subscription, id: 'test', token };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ getSubscription: activeSubscription });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(testResource.get(token)).resolves.toMatchObject(
        activeSubscription
      );
    });

    it('should throw error if no subscription found matching the given token', async () => {
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ getSubscription: null });
      const token = 'testToken';
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(testResource.get(token)).rejects.toThrow('Subscription not found');
    });
  });

  describe('updateOrderedProduct', () => {
    it('should call the correct mutation', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        updateOrderedProduct: {
          orderedProduct: {
            subscription: { token: 'testToken', orderedProducts: [] },
          },
        },
      });
      const input = { shipmentDate: '20-01-2024' };
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      await testResource.updateOrderedProduct('testToken', input);
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        UpdateOrderedProductDocument,
        { input },
        { 'X-Subscription-Token': 'testToken' }
      );
    });

    it('should return updated product', async () => {
      const input = {
        id: 'test',
        shipmentDate: '20-01-2024',
      };
      const response = {
        orderedProduct: { ...input, subscription },
      };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ updateOrderedProduct: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.updateOrderedProduct('testToken', input)
      ).resolves.toMatchObject({
        orderedProduct: input,
        subscription,
      });
    });

    it('should throw an error if response is null', async () => {
      const input = {
        id: 'test',
        shipmentDate: '20-01-2024',
      };
      const response = null;
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ updateOrderedProduct: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.updateOrderedProduct('testToken', input)
      ).rejects.toThrow('Could not update ordered product');
    });

    it('should throw an error if returned ordered product is null', async () => {
      const input = {
        id: 'test',
        shipmentDate: '20-01-2024',
      };
      const response = {
        orderedProduct: null,
      };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ updateOrderedProduct: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.updateOrderedProduct('testToken', input)
      ).rejects.toThrow('Could not update ordered product');
    });
  });

  describe('getBySelfServiceCenterLoginToken', () => {
    it('should call the correct query', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        getSubscriptionBySelfServiceCenterLoginToken: {
          ...subscription,
          token: 'test',
        },
      });
      const token = 'testToken';
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      await testResource.getBySelfServiceCenterLoginToken(token);
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        GetSubscriptionBySelfServiceCenterLoginTokenDocument,
        { token },
        { 'X-Subscription-Token': token }
      );
    });

    it('should return subscription with given self service center login token', async () => {
      const token = 'testToken';
      const activeSubscription = { ...subscription, id: 'test', token };
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        getSubscriptionBySelfServiceCenterLoginToken: activeSubscription,
      });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.getBySelfServiceCenterLoginToken(token)
      ).resolves.toMatchObject(activeSubscription);
    });

    it('should throw error if no subscription found matching the given token', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        getSubscriptionBySelfServiceCenterLoginToken: null,
      });
      const token = 'testToken';
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.getBySelfServiceCenterLoginToken(token)
      ).rejects.toThrow('Subscription not found');
    });
  });

  describe('cancel', () => {
    let testResource: SubscriptionsResource;
    let input: CancelSubscriptionInput;
    const subscriptionId = '1';

    beforeEach(() => {
      testResource = new SubscriptionsResource(mockGraphQLClient);
      input = { cancellationNotes: 'note' };
    });

    it('should call the correct mutation', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        cancelSubscription: { subscription },
      });
      await testResource.cancel(subscriptionId, input);
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        CancelSubcscriptionDocument,
        {
          input: {
            ...input,
            id: subscriptionId,
          },
        }
      );
    });

    it('should return cancelled subscription', async () => {
      const response = { subscription };
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        cancelSubscription: response,
      });
      expect(testResource.cancel(subscriptionId, input)).resolves.toMatchObject(
        subscriptionWithUtils
      );
    });

    it('should throw validation error if an error is returned', async () => {
      const response = {
        errors: [{ messsage: 'Subscription is already cancelled' }],
      };
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        cancelSubscription: response,
      });
      expect(testResource.cancel(subscriptionId, input)).rejects.toThrow(
        'Validation error'
      );
    });

    it('should throw server error if the response is null', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        cancelSubscription: null,
      });
      expect(testResource.cancel(subscriptionId, input)).rejects.toThrow(
        'Could not cancel subscription'
      );
    });

    it('should throw server error if the subscription is null', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        cancelSubscription: {
          subscription: null,
        },
      });
      expect(testResource.cancel(subscriptionId, input)).rejects.toThrow(
        'Could not cancel subscription'
      );
    });
  });

  describe('pause', () => {
    let testResource: SubscriptionsResource;
    let input: PauseSubscriptionInput;
    const subscriptionId = '1';

    beforeEach(() => {
      testResource = new SubscriptionsResource(mockGraphQLClient);
      input = { pauseUntil: '2025-01-01' };
    });

    it('should call the correct mutation', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        pauseSubscription: { subscription },
      });
      await testResource.pause(subscriptionId, input);
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        PauseSubscriptionDocument,
        { input: { ...input, id: subscriptionId } }
      );
    });

    it('should return paused subscription', async () => {
      const response = { subscription };
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        pauseSubscription: response,
      });
      expect(testResource.pause(subscriptionId, input)).resolves.toMatchObject(
        subscriptionWithUtils
      );
    });

    it('should throw validation error if an error is returned', async () => {
      const response = {
        errors: [{ messsage: 'Subscription is already paused' }],
      };
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        pauseSubscription: response,
      });
      expect(testResource.pause(subscriptionId, input)).rejects.toThrow(
        'Validation error'
      );
    });

    it('should throw server error if the response is null', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        pauseSubscription: null,
      });
      expect(testResource.pause(subscriptionId, input)).rejects.toThrow(
        'Could not pause subscription'
      );
    });

    it('should throw server error if the subscription is null', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        pauseSubscription: {
          subscription: null,
        },
      });
      expect(testResource.pause(subscriptionId, input)).rejects.toThrow(
        'Could not pause subscription'
      );
    });
  });
  describe('resume', () => {
    let testResource: SubscriptionsResource;
    let input: ResumeSubscriptionInput;
    const subscriptionId = '1';
    beforeEach(() => {
      testResource = new SubscriptionsResource(mockGraphQLClient);
      input = { resumeFrom: '2025-01-01' };
    });

    it('should call the correct mutation', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        resumeSubscription: { subscription },
      });
      await testResource.resume(subscriptionId, input);
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        ResumeSubscriptionDocument,
        { input: { ...input, id: subscriptionId } }
      );
    });

    it('should return resumed subscription', async () => {
      const response = { subscription };
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        resumeSubscription: response,
      });
      expect(testResource.resume(subscriptionId, input)).resolves.toMatchObject(
        subscriptionWithUtils
      );
    });

    it('should throw validation error if an error is returned', async () => {
      const response = {
        errors: [{ messsage: 'Subscription is already resumed' }],
      };
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        resumeSubscription: response,
      });
      expect(testResource.resume(subscriptionId, input)).rejects.toThrow(
        'Validation error'
      );
    });

    it('should throw server error if the response is null', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        resumeSubscription: null,
      });
      expect(testResource.resume(subscriptionId, input)).rejects.toThrow(
        'Could not resume subscription'
      );
    });

    it('should throw server error if the subscription is null', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        resumeSubscription: {
          subscription: null,
        },
      });
      expect(testResource.resume(subscriptionId, input)).rejects.toThrow(
        'Could not resume subscription'
      );
    });
  });
});
