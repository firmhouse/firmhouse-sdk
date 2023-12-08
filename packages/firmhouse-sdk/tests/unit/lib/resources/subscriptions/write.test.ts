import { SubscriptionType, SubscriptionStatus } from '@firmhouse/firmhouse-sdk';
import { GraphQLClient } from '@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient';

import { BaseSubscriptionType } from '@firmhouse/firmhouse-sdk/lib/resources/subscriptions';
import {
  GetCompleteSubscriptionDocument,
  GetSubscriptionWithDocument,
} from '@firmhouse/firmhouse-sdk/lib/resources/subscriptions/subscriptions.generated';
import { WriteAccessSubscriptionsResource } from '@firmhouse/firmhouse-sdk/lib/resources/subscriptions/write';
jest.mock('@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient');

const subscription: SubscriptionType<BaseSubscriptionType> = {
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
};

describe('lib/resources/subscriptions/write.ts', () => {
  let mockGraphQLClient: GraphQLClient;

  beforeEach(() => {
    mockGraphQLClient = new GraphQLClient('test', 'http://test.com');
  });
  it('should initialize the WriteAccessSubscriptionsResource correctly', () => {
    const testResource = new WriteAccessSubscriptionsResource(
      mockGraphQLClient
    );
    expect(testResource).toBeInstanceOf(WriteAccessSubscriptionsResource);
  });

  describe('get', () => {
    it('should call the correct query', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        getSubscription: { ...subscription, token: 'test' },
      });
      const token = 'testToken';
      const testResource = new WriteAccessSubscriptionsResource(
        mockGraphQLClient
      );
      await testResource.get(token);
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        GetCompleteSubscriptionDocument,
        { token },
        { 'X-Subscription-Token': token }
      );
    });

    it('should return subscription with given token', async () => {
      const token = 'testToken';
      const activeSubscription = { ...subscription, id: 'test', token };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ getSubscription: activeSubscription });
      const testResource = new WriteAccessSubscriptionsResource(
        mockGraphQLClient
      );
      expect(testResource.get(token)).resolves.toStrictEqual(
        activeSubscription
      );
    });

    it('should throw error if no subscription found matching the given token', async () => {
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ getSubscription: null });
      const token = 'testToken';
      const testResource = new WriteAccessSubscriptionsResource(
        mockGraphQLClient
      );
      expect(testResource.get(token)).rejects.toThrow('Subscription not found');
    });
  });

  describe('getWith', () => {
    it('should call the correct query', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        getSubscription: { ...subscription, token: 'test' },
      });
      const token = 'testToken';
      const testResource = new WriteAccessSubscriptionsResource(
        mockGraphQLClient
      );
      await testResource.getWith(token, {
        collectionCases: true,
        verifiedIdentity: true,
      });
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        GetSubscriptionWithDocument,
        { token, includeCollectionCases: true, includeVerifiedIdentity: true },
        { 'X-Subscription-Token': token }
      );
    });

    it('should return subscription with given token', async () => {
      const token = 'testToken';
      const activeSubscription = { ...subscription, id: 'test', token };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ getSubscription: activeSubscription });
      const testResource = new WriteAccessSubscriptionsResource(
        mockGraphQLClient
      );
      expect(testResource.get(token)).resolves.toStrictEqual(
        activeSubscription
      );
    });

    it('should throw error if no subscription found matching the given token', async () => {
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ getSubscription: null });
      const token = 'testToken';
      const testResource = new WriteAccessSubscriptionsResource(
        mockGraphQLClient
      );
      expect(testResource.get(token)).rejects.toThrow('Subscription not found');
    });
  });
});
