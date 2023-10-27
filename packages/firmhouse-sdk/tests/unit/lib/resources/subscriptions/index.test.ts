import {
  AddToCartDocument,
  CreateCartDocument,
  CreateSubscriptionFromCartDocument,
  GetSubscriptionDocument,
  RemoveFromCartDocument,
  SubscriptionStatus,
  UpdateAddressDetailsDocument,
  UpdateOrderedProductQuantityDocument,
  UpdatePlanDocument,
} from '@firmhouse/firmhouse-sdk/lib/graphql/generated';
import GraphQLClient from '@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient';
import { ValidationError } from '@firmhouse/firmhouse-sdk/lib/helpers/errors';
import { SubscriptionsResource } from '@firmhouse/firmhouse-sdk/lib/resources/subscriptions';
jest.mock('@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient');

describe('lib/resources/subscriptions/index.ts', () => {
  let mockGraphQLClient: GraphQLClient;

  beforeEach(() => {
    mockGraphQLClient = new GraphQLClient('test', 'http://test.com');
  });
  it('should initialize the SubscriptionResource correctly', () => {
    const testResource = new SubscriptionsResource(mockGraphQLClient);
    expect(testResource).toBeInstanceOf(SubscriptionsResource);
  });

  describe('createCart', () => {
    it('should call the correct query', async () => {
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ createCart: { subscription: { token: 'test' } } });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      await testResource.createCart();
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        CreateCartDocument,
        { input: {} }
      );
    });
    it('should throw error if null response is return from API', async () => {
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ createCart: null });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(testResource.createCart()).rejects.toThrow(
        'Could not create subscription'
      );
    });

    it('should throw error if undefinfed response is return from API', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({});
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(testResource.createCart()).rejects.toThrow(
        'Could not create subscription'
      );
    });

    it('should return subscription token', async () => {
      const token = 'test';
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ createCart: { subscription: { token } } });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      const {subscription} = await testResource.createCart();
      expect(subscription?.token).toBe(token);
    });
  });

  describe('createSubscriptionToken', () => {
    it('should call createCart method', async () => {
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ createCart: { subscription: { token: 'test' } } });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      testResource.createCart = jest
        .fn()
        .mockResolvedValue({ subscription: { token: 'test' } });
      await testResource.createSubscriptionToken();
      expect(testResource.createCart).toHaveBeenCalled();
    });

    it('should return subscription token', async () => {
      const token = 'test';
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      testResource.createCart = jest
        .fn()
        .mockResolvedValue({ subscription: { token } });
      expect(
        testResource.createSubscriptionToken('testMutationId')
      ).resolves.toStrictEqual(token);
    });

    it('should throw error if no token is returned', async () => {
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      testResource.createCart = jest
        .fn()
        .mockResolvedValue({ subscription: { token: null } });
      expect(
        testResource.createSubscriptionToken('testMutationId')
      ).rejects.toThrow('No token returned from API');
    });
  });

  describe('get', () => {
    it('should call the correct query', async () => {
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ getSubscription: { token: 'test' } });
      const token = 'testToken';
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      await testResource.get(token);
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        GetSubscriptionDocument,
        { token },
        { 'X-Subscription-Token': token }
      );
    });

    it('should return subscription with given token', async () => {
      const token = 'testToken';
      const subscription = { id: 'test', token, orderedProducts: [] };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ getSubscription: subscription });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(testResource.get(token)).resolves.toStrictEqual(subscription);
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

  describe('getOrCreateDraftSubscription', () => {
    it('should return subscription if a draft subscription matching the given token exists ', async () => {
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      const subscription = {
        status: SubscriptionStatus.Draft,
        token: 'testToken',
        orderedProducts: []
      };
      testResource.get = jest.fn().mockResolvedValue(subscription);
      expect(
        testResource.getOrCreateDraftSubscription('testToken')
      ).resolves.toStrictEqual(subscription);
    });

    it('should create a new subscription if the subscription matching the given token is not a draft subscription ', async () => {
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      const activeSubscription = { status: 'Active', token: 'token' };
      testResource.get = jest.fn().mockResolvedValue(activeSubscription);
      const subscription = { status: SubscriptionStatus.Draft, token: 'token', orderedProducts: [] };
      testResource.createCart = jest.fn().mockResolvedValue({ subscription });
      expect(
        testResource.getOrCreateDraftSubscription('testToken')
      ).resolves.toStrictEqual(subscription);
    });

    it('should create a new subscription if no subscription matches given token', async () => {
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      testResource.get = jest
        .fn()
        .mockRejectedValue(new Error('Subscription not found'));
      const subscription = { status: SubscriptionStatus.Draft, token: 'token' };
      testResource.createCart = jest.fn().mockResolvedValue({ subscription });
      expect(
        testResource.getOrCreateDraftSubscription('testToken')
      ).resolves.toStrictEqual(subscription);
    });

    it('should throw an error if returned subscription does not have a token', async () => {
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      testResource.get = jest
        .fn()
        .mockRejectedValue(new Error('Subscription not found'));
      const subscription = { status: SubscriptionStatus.Draft };
      testResource.createCart = jest.fn().mockResolvedValue({ subscription });
      expect(
        testResource.getOrCreateDraftSubscription('testToken')
      ).rejects.toThrow('No token returned from API');
    });
  });

  describe('addToCart', () => {
    it('should call the correct mutation', async () => {
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ addToCart: { subscription: { id: 'test' } } });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      const input = { productId: 'test', quantity: 1 };
      await testResource.addToCart(input, 'testToken');
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        AddToCartDocument,
        { input },
        { 'X-Subscription-Token': 'testToken' }
      );
    });

    it('should return ordered product with updated subscription', async () => {
      const response = {
        orderedProduct: {
          id: 'test',
          quantity: 1,
        },
        subscription: {
          id: 'test',
        },
      };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ createOrderedProduct: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      const input = { productId: 'test', quantity: 1 };
      expect(testResource.addToCart(input, 'testToken')).resolves.toStrictEqual(
        response
      );
    });
  });

  describe('removeFromCart', () => {
    it('should call the correct mutation', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        RemoveFromCartDocument: { subscription: { id: 'test' } },
      });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      const id = 'test';
      await testResource.removeFromCart(id, 'testToken');
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        RemoveFromCartDocument,
        { input: { id } },
        { 'X-Subscription-Token': 'testToken' }
      );
    });

    it('should return removed product with updated subscription', async () => {
      const response = {
        orderedProduct: {
          id: 'test',
          quantity: 1,
        },
        subscription: {
          id: 'test',
        },
      };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ destroyOrderedProduct: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.removeFromCart(response.orderedProduct.id, 'testToken')
      ).resolves.toStrictEqual(response);
    });
  });

  describe('updateOrderedProductQuantity', () => {
    it('should call the correct mutation', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        updateOrderedProductQuantity: { subscription: { id: 'test' } },
      });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      const testId = 'test';
      const testQuantity = 5;
      await testResource.updateOrderedProductQuantity(
        testId,
        testQuantity,
        'testToken'
      );
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        UpdateOrderedProductQuantityDocument,
        { input: { orderedProduct: { id: testId, quantity: testQuantity } } },
        { 'X-Subscription-Token': 'testToken' }
      );
    });

    it('should return updated product with updated subscription', async () => {
      const response = {
        orderedProduct: {
          id: 'test',
          quantity: 1,
        },
        subscription: {
          id: 'test',
        },
      };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ updateOrderedProductQuantity: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.updateOrderedProductQuantity(
          response.orderedProduct.id,
          response.orderedProduct.quantity,
          'testToken'
        )
      ).resolves.toStrictEqual(response);
    });
  });

  describe('updateAddressDetails', () => {
    it('should call the correct mutation', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        updateAddressDetails: { subscription: { id: 'test' } },
      });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      const input = { address: 'test' };
      await testResource.updateAddressDetails(input, 'testToken');
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        UpdateAddressDetailsDocument,
        { input },
        { 'X-Subscription-Token': 'testToken' }
      );
    });

    it('should return updated subscription', async () => {
      const input = { address: 'test', name: 'test name' };
      const response = {
        subscription: {
          id: 'test',
          ...input,
        },
        errors: null,
      };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ updateAddressDetails: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.updateAddressDetails(input, 'testToken')
      ).resolves.toStrictEqual({ subscription: response.subscription });
    });

    it('should handle empty response correctly', async () => {
      const input = { address: 'test', name: 'test name' };
      const response = null;
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ updateAddressDetails: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.updateAddressDetails(input, 'testToken')
      ).resolves.toStrictEqual({});
    });

    it('should throw validation errors with correctly formated attribute names', async () => {
      const input = { address: 'test', name: 'test name' };
      const response = {
        subscription: {
          id: 'test',
        },
        errors: [
          {
            attribute: 'date_of_birth',
            message: 'test',
          },
        ],
      };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ updateAddressDetails: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      let thrownError: ValidationError | undefined;
      try {
        await testResource.updateAddressDetails(input, 'testToken');
      } catch (error) {
        thrownError = error as ValidationError;
      }
      expect(thrownError?.message).toEqual('Validation error');
      expect(thrownError?.details).toEqual({
        dateOfBirth: 'test',
      });
    });
  });

  describe('finaliseSubscription', () => {
    it('should call the correct mutation', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        createSubscriptionFromCart: { subscription: { id: 'test' } },
      });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      const paymentPageUrl = 'test';
      const returnUrl = 'test';
      await testResource.createSubscriptionFromCart(
        paymentPageUrl,
        returnUrl,
        'testToken'
      );
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        CreateSubscriptionFromCartDocument,
        { input: { paymentPageUrl, returnUrl } },
        { 'X-Subscription-Token': 'testToken' }
      );
    });

    it('should return updated subscription', async () => {
      const paymentPageUrl = 'test';
      const returnUrl = 'test';
      const response = {
        subscription: {
          id: 'test',
        },
        errors: null,
      };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ createSubscriptionFromCart: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.createSubscriptionFromCart(
          paymentPageUrl,
          returnUrl,
          'testToken'
        )
      ).resolves.toStrictEqual({ subscription: response.subscription });
    });

    it('should handle empty response correctly', async () => {
      const paymentPageUrl = 'test';
      const returnUrl = 'test';
      const response = null;
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ createSubscriptionFromCart: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.createSubscriptionFromCart(
          paymentPageUrl,
          returnUrl,
          'testToken'
        )
      ).resolves.toStrictEqual({});
    });

    it('should throw validation errors with correctly formated attribute names', async () => {
      const paymentPageUrl = 'test';
      const returnUrl = 'test';
      const response = {
        subscription: {
          id: 'test',
        },
        errors: [
          {
            attribute: 'date_of_birth',
            message: 'test',
          },
        ],
      };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ createSubscriptionFromCart: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      let thrownError: ValidationError | undefined;
      try {
        await testResource.createSubscriptionFromCart(
          paymentPageUrl,
          returnUrl,
          'testToken'
        );
      } catch (error) {
        thrownError = error as ValidationError;
      }
      expect(thrownError?.message).toEqual('Validation error');
      expect(thrownError?.details).toEqual({
        dateOfBirth: 'test',
      });
    });
  });

  describe('updatePlan', () => {
    it('should call the correct mutation', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        updatePlan: { subscription: { id: 'test' } },
      });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      const planSlug = 'new-plan';
      await testResource.updatePlan(planSlug, 'testToken');
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        UpdatePlanDocument,
        { input: { planSlug: planSlug } },
        { 'X-Subscription-Token': 'testToken' }
      );
    });

    it('should return updated subscription', async () => {
      const input = 'new-plan';
      const response = {
        subscription: {
          id: 'test',
          activePlan: {
            slug: input,
          },
        },
      };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ updatePlan: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.updatePlan(input, 'testToken')
      ).resolves.toStrictEqual({ subscription: response.subscription });
    });
  });
});
