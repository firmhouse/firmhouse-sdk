import { SubscriptionsResource } from '@firmhouse/firmhouse-sdk/lib/resources/subscriptions';
import {
  GetSubscriptionBySelfServiceCenterLoginTokenDocument,
  GetSubscriptionDocument,
  UpdateOrderedProductDocument,
  CancelSubscriptionDocument,
  PauseSubscriptionDocument,
  ResumeSubscriptionDocument,
  ApplyPromotionDocument,
  GetPromotionAndSubscriptionIdDocument,
  UpdateAppliedPromotionDocument,
  DeactivateAppliedPromotionDocument,
} from '@firmhouse/firmhouse-sdk/lib/resources/subscriptions/subscriptions.generated';

import { _GraphQLClient } from '@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient';

import { SubscriptionStatus } from '@firmhouse/firmhouse-sdk/lib/graphql/generated';
import { ValidationError } from '@firmhouse/firmhouse-sdk';

jest.mock('@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient');

const subscription = {
  token: 'test',
  startDate: '',
  status: SubscriptionStatus.Activated,
  termsAccepted: false,
  extraFields: [],
  orderedProducts: [],
  createdAt: null,
  id: '1',
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

const appliedPromotion = {
  active: true,
  id: 'testId',
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
        discountCodes: {
          includeRelations: {
            autoSelectPlan: true,
            promotion: true,
          },
        },
        appliedPromotions: true,
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
          includeDiscountCodes: true,
          includeDiscountCodesAutoSelectPlan: true,
          includeDiscountCodesPromotion: true,
          includeAppliedPromotions: true,
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
    const input = { cancellationNotes: 'note' };
    const subscriptionId = '1';

    beforeEach(() => {
      testResource = new SubscriptionsResource(mockGraphQLClient);
    });

    it('should call the correct mutation', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        cancelSubscription: { subscription },
      });
      await testResource.cancel(subscriptionId, input);
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        CancelSubscriptionDocument,
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
        subscription
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
    const input = { pauseUntil: '2025-01-01' };
    const subscriptionId = '1';

    beforeEach(() => {
      testResource = new SubscriptionsResource(mockGraphQLClient);
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
        subscription
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
    const input = { resumeFrom: '2025-01-01' };
    const subscriptionId = '1';
    beforeEach(() => {
      testResource = new SubscriptionsResource(mockGraphQLClient);
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
        subscription
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

  describe('applyPromotion', () => {
    it('should call the correct mutation', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        applyPromotionToSubscription: { appliedPromotion },
      });
      const promotionId = '1';
      const subscriptionId = '12';
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      await testResource.applyPromotion(subscriptionId, promotionId);
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        ApplyPromotionDocument,
        { input: { promotionId, subscriptionId } }
      );
    });

    it('should return subscription with applied promotion', async () => {
      const promotionId = '1';
      const subscriptionId = '12';
      const response = { appliedPromotion };
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        applyPromotionToSubscription: response,
      });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.applyPromotion(subscriptionId, promotionId)
      ).resolves.toMatchObject(appliedPromotion);
    });

    it('should throw an error if response is null', async () => {
      const promotionId = '1';
      const subscriptionId = '12';
      const response = null;
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        applyPromotionToSubscription: response,
      });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.applyPromotion(subscriptionId, promotionId)
      ).rejects.toThrow('Could not apply promotion');
    });

    it('should throw Validation error if the response contains errors', async () => {
      const promotionId = '1';
      const subscriptionId = '12';
      const response = {
        errors: [{ message: 'Invalid promotion' }],
      };
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        applyPromotionToSubscription: response,
      });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.applyPromotion(subscriptionId, promotionId)
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('applyPromotionWithDiscountCode', () => {
    it('should call the correct mutation', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        getSubscription: subscription,
        getDiscountCode: { promotionId: '123' },
      });
      const code = 'test';
      const subscriptionToken = 'test-token';
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      testResource.applyPromotion = jest.fn().mockResolvedValue({
        appliedPromotion,
      });
      await testResource.applyPromotionWithDiscountCode(
        subscriptionToken,
        code
      );
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        GetPromotionAndSubscriptionIdDocument,
        { code, subscriptionToken }
      );
      expect(testResource.applyPromotion).toHaveBeenCalledWith(
        subscription.id,
        '123'
      );
    });

    it('should throw an error if no discount code found matching the given code', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        getDiscountCode: null,
        getSubscription: subscription,
      });
      const code = 'test';
      const subscriptionToken = 'test-token';
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.applyPromotionWithDiscountCode(subscriptionToken, code)
      ).rejects.toThrow('Promotion not found');
    });

    it('should throw an error if no subscription found matching the given token', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        getDiscountCode: { promotionId: '123' },
        getSubscription: null,
      });
      const code = 'test';
      const subscriptionToken = 'test-token';
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.applyPromotionWithDiscountCode(subscriptionToken, code)
      ).rejects.toThrow('Subscription not found');
    });

    it('should throw an error if the promotion attached to discount code is already active', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        getDiscountCode: { promotionId: '123' },
        getSubscription: {
          ...subscription,
          appliedPromotions: [{ promotion: { id: '123' }, active: true }],
        },
      });
      const code = 'test';
      const subscriptionToken = 'test-token';
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.applyPromotionWithDiscountCode(subscriptionToken, code)
      ).rejects.toThrow(ValidationError);
    });

    it('should call updateAppliedPromotion if the promotion attached to discount code is already applied before and deactivated', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        getDiscountCode: { promotionId: '123' },
        getSubscription: {
          ...subscription,
          appliedPromotions: [
            { id: '10', promotion: { id: '123' }, active: false },
          ],
        },
      });
      const code = 'test';
      const subscriptionToken = 'test-token';
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      testResource.updateAppliedPromotion = jest
        .fn()
        .mockResolvedValue(appliedPromotion);
      const result = await testResource.applyPromotionWithDiscountCode(
        subscriptionToken,
        code
      );
      expect(result).toMatchObject(appliedPromotion);
      expect(testResource.updateAppliedPromotion).toHaveBeenCalledWith({
        id: '10',
        active: true,
      });
    });
  });

  describe('updateAppliedPromotion', () => {
    it('should call the correct mutation', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        updateAppliedPromotion: { appliedPromotion },
      });
      const input = { id: '1', active: true };
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(testResource.updateAppliedPromotion(input)).resolves.toMatchObject(
        appliedPromotion
      );
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        UpdateAppliedPromotionDocument,
        { input }
      );
    });

    it('should throw an error if response is null', async () => {
      const input = { id: '1', active: true };
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        updateAppliedPromotion: null,
      });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(testResource.updateAppliedPromotion(input)).rejects.toThrow(
        'Could not update applied promotion'
      );
    });

    it('should throw ValidationError if the response contains errors', async () => {
      const input = { id: '1', active: true };
      const response = {
        updateAppliedPromotion: {
          appliedPromotion,
          errors: [{ message: 'Promotion cannot be applied' }],
        },
      };
      mockGraphQLClient.request = jest.fn().mockResolvedValue(response);
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(testResource.updateAppliedPromotion(input)).rejects.toThrow(
        ValidationError
      );
    });
  });

  describe('deactivateAppliedPromotion', () => {
    it('should call the correct mutation', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        deactivateAppliedPromotion: { appliedPromotion },
      });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.deactivateAppliedPromotion('123')
      ).resolves.toMatchObject(appliedPromotion);
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        DeactivateAppliedPromotionDocument,
        { input: { id: '123' } }
      );
    });

    it('should throw an error if response is null', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        deactivateAppliedPromotion: null,
      });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(testResource.deactivateAppliedPromotion('123')).rejects.toThrow(
        'Could not deactivate applied promotion'
      );
    });
  });
});
