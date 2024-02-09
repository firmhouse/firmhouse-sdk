import { SubscriptionType, SubscriptionStatus } from '@firmhouse/firmhouse-sdk';
import { GraphQLClient } from '@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient';
import {
  ServerError,
  ValidationError,
} from '@firmhouse/firmhouse-sdk/lib/helpers/errors';
import {
  BaseSubscriptionType,
  SubscriptionsResource,
} from '@firmhouse/firmhouse-sdk/lib/resources/subscriptions';
import {
  CreateCartDocument,
  GetSubscriptionDocument,
  AddToCartDocument,
  RemoveFromCartDocument,
  UpdateOrderedProductQuantityDocument,
  UpdateOrderedProductDocument,
  UpdateAddressDetailsDocument,
  CreateSubscriptionFromCartDocument,
  UpdatePlanDocument,
} from '@firmhouse/firmhouse-sdk/lib/resources/subscriptions/subscriptions.generated';
jest.mock('@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient');

const subscription: SubscriptionType<BaseSubscriptionType> = {
  token: 'test',
  startDate: '',
  status: SubscriptionStatus.Draft,
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
};

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
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        createCart: { subscription: { ...subscription, token: 'test' } },
      });
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

    it('should throw error if undefined response is return from API', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({});
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(testResource.createCart()).rejects.toThrow(
        'Could not create subscription'
      );
    });

    it('should return subscription token', async () => {
      const token = 'test';
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        createCart: { subscription: { ...subscription, token } },
      });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      const { subscription: draftSubscription } =
        await testResource.createCart();
      expect(draftSubscription?.token).toBe(token);
    });
  });

  describe('createSubscriptionToken', () => {
    it('should call createCart method', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        createCart: { subscription: { ...subscription, token: 'test' } },
      });
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
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        getSubscription: { ...subscription, token: 'test' },
      });
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
      const draftSubscription = { ...subscription, id: 'test', token };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ getSubscription: draftSubscription });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(testResource.get(token)).resolves.toMatchObject(draftSubscription);
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
      const draftSubscription = {
        ...subscription,
        status: SubscriptionStatus.Draft,
        token: 'testToken',
        orderedProducts: [],
      };
      testResource.get = jest.fn().mockResolvedValue(draftSubscription);
      expect(
        testResource.getOrCreateDraftSubscription('testToken')
      ).resolves.toMatchObject(draftSubscription);
    });

    it('should create a new subscription if the subscription matching the given token is not a draft subscription ', async () => {
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      const activeSubscription = { status: 'Active', token: 'token' };
      testResource.get = jest.fn().mockResolvedValue(activeSubscription);
      const draftSubscription = {
        ...subscription,
        status: SubscriptionStatus.Draft,
        token: 'token',
        orderedProducts: [],
      };
      testResource.createCart = jest
        .fn()
        .mockResolvedValue({ subscription: draftSubscription });
      expect(
        testResource.getOrCreateDraftSubscription('testToken')
      ).resolves.toStrictEqual(draftSubscription);
    });

    it('should create a new subscription if no subscription matches given token', async () => {
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      testResource.get = jest
        .fn()
        .mockRejectedValue(new Error('Subscription not found'));
      const draftSubscription = {
        ...subscription,
        status: SubscriptionStatus.Draft,
        token: 'testToken',
      };
      testResource.createCart = jest
        .fn()
        .mockResolvedValue({ subscription: draftSubscription });
      expect(
        testResource.getOrCreateDraftSubscription('testToken')
      ).resolves.toStrictEqual(draftSubscription);
    });

    it('should throw an error if returned subscription does not have a token', async () => {
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      testResource.get = jest
        .fn()
        .mockRejectedValue(new Error('Subscription not found'));
      testResource.createCart = jest
        .fn()
        .mockRejectedValue(new ServerError('No token returned from API'));
      expect(
        testResource.getOrCreateDraftSubscription('testToken')
      ).rejects.toThrow('No token returned from API');
    });
  });

  describe('addToCart', () => {
    it('should call the correct mutation', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        createOrderedProduct: {
          subscription,
          orderedProduct: {},
        },
      });
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
        subscription,
      };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ createOrderedProduct: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      const input = { productId: 'test', quantity: 1 };
      expect(testResource.addToCart(input, 'testToken')).resolves.toMatchObject(
        response
      );
    });

    it('should throw an error if response is null', async () => {
      const response = null;
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ createOrderedProduct: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      const input = { productId: 'test', quantity: 1 };
      expect(testResource.addToCart(input, 'testToken')).rejects.toThrow(
        'Could not add product to cart'
      );
    });

    it('should throw an error if returned ordered product is null', async () => {
      const response = {
        orderedProduct: null,
        subscription,
      };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ createOrderedProduct: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      const input = { productId: 'test', quantity: 1 };
      expect(testResource.addToCart(input, 'testToken')).rejects.toThrow(
        'Could not add product to cart'
      );
    });
    it('should throw an error if returned subscription is null', async () => {
      const response = {
        orderedProduct: {
          id: 'test',
          quantity: 1,
        },
        subscription: null,
      };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ createOrderedProduct: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      const input = { productId: 'test', quantity: 1 };
      expect(testResource.addToCart(input, 'testToken')).rejects.toThrow(
        'Could not add product to cart'
      );
    });
  });

  describe('removeFromCart', () => {
    it('should call the correct mutation', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        destroyOrderedProduct: {
          subscription,
          orderedProduct: {},
        },
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
        subscription,
      };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ destroyOrderedProduct: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.removeFromCart(response.orderedProduct.id, 'testToken')
      ).resolves.toMatchObject(response);
    });
    it('should throw an error if response is null', async () => {
      const response = null;
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ destroyOrderedProduct: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(testResource.removeFromCart('test', 'testToken')).rejects.toThrow(
        'Could not remove product from cart'
      );
    });

    it('should throw an error if returned ordered product is null', async () => {
      const response = {
        orderedProduct: null,
        subscription: {
          id: 'test',
          token: 'test',
        },
      };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ destroyOrderedProduct: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(testResource.removeFromCart('test', 'testToken')).rejects.toThrow(
        'Could not remove product from cart'
      );
    });

    it('should throw an error if returned subscription is null', async () => {
      const response = {
        orderedProduct: {
          id: 'test',
          quantity: 1,
        },
        subscription: null,
      };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ destroyOrderedProduct: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(testResource.removeFromCart('test', 'testToken')).rejects.toThrow(
        'Could not remove product from cart'
      );
    });
  });

  describe('updateOrderedProductQuantity', () => {
    it('should call the correct mutation', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        updateOrderedProductQuantity: {
          subscription: { ...subscription, id: 'test', token: 'test' },
          orderedProduct: {},
        },
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
        { id: testId, quantity: testQuantity },
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
          ...subscription,
          id: 'test',
          token: 'test',
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
      ).resolves.toMatchObject(response);
    });
    it('should throw an error if response is null', async () => {
      const response = null;
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ updateOrderedProductQuantity: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.updateOrderedProductQuantity('test', 1, 'testToken')
      ).rejects.toThrow('Could not update ordered product quantity');
    });

    it('should throw an error if returned ordered product is null', async () => {
      const response = {
        orderedProduct: null,
        subscription: {
          id: 'test',
          token: 'test',
        },
      };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ updateOrderedProductQuantity: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.updateOrderedProductQuantity('test', 1, 'testToken')
      ).rejects.toThrow('Could not update ordered product quantity');
    });

    it('should throw an error if returned subscription is null', async () => {
      const response = {
        orderedProduct: {
          id: 'test',
          quantity: 1,
        },
        subscription: null,
      };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ updateOrderedProductQuantity: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.updateOrderedProductQuantity('test', 1, 'testToken')
      ).rejects.toThrow('Could not update ordered product quantity');
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
      const input = { id: 'test', shipmentDate: '20-01-2024' };
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      await testResource.updateOrderedProduct(input, 'testToken');
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        UpdateOrderedProductDocument,
        input,
        { 'X-Subscription-Token': 'testToken' }
      );
    });

    it('should return updated product', async () => {
      const input = {
        id: 'test',
        shipmentDate: '20-01-2024',
      };
      const response = {
        orderedProduct: {
          ...input,
          subscription: { ...subscription, orderedProducts: [] },
        },
      };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ updateOrderedProduct: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.updateOrderedProduct(input, 'testToken')
      ).resolves.toMatchObject({
        orderedProduct: input,
        subscription: response.orderedProduct.subscription,
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
        testResource.updateOrderedProduct(input, 'testToken')
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
        testResource.updateOrderedProduct(input, 'testToken')
      ).rejects.toThrow('Could not update ordered product');
    });
  });

  describe('updateAddressDetails', () => {
    it('should call the correct mutation', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        updateAddressDetails: {
          subscription: { ...subscription, id: 'test', token: 'token' },
        },
      });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      const input = { address: 'test' };
      await testResource.updateAddressDetails(input, 'testToken');
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        UpdateAddressDetailsDocument,
        input,
        { 'X-Subscription-Token': 'testToken' }
      );
    });

    it('should return updated subscription', async () => {
      const input = { address: 'test', name: 'test name' };
      const response = {
        subscription: {
          ...subscription,
          id: 'test',
          token: 'test',
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
      ).resolves.toMatchObject({ subscription: response.subscription });
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
      ).rejects.toThrow('Could not update address details');
    });

    it('should throw an error if returned subscription is null', async () => {
      const input = { address: 'test', name: 'test name' };
      const response = {
        subscription: null,
        errors: null,
      };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ updateAddressDetails: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.updateAddressDetails(input, 'testToken')
      ).rejects.toThrow('Could not update address details');
    });

    it('should throw validation errors with correctly formated attribute names', async () => {
      const input = { address: 'test', name: 'test name' };
      const response = {
        subscription: {
          id: 'test',
          token: 'test',
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
        createSubscriptionFromCart: {
          subscription: { ...subscription, id: 'test', token: 'test' },
        },
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
      const paymentUrl = 'test';
      const returnUrl = 'test';
      const response = {
        subscription: {
          ...subscription,
          id: 'test',
          token: 'test',
        },
        paymentUrl,
        returnUrl: returnUrl,
        errors: null,
      };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ createSubscriptionFromCart: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.createSubscriptionFromCart(
          paymentUrl,
          returnUrl,
          'testToken'
        )
      ).resolves.toMatchObject({
        subscription: response.subscription,
        paymentUrl,
        returnUrl,
      });
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
      ).rejects.toThrow('Could not create subscription');
    });

    it('should throw an error if returned subscription is null', async () => {
      const paymentUrl = 'test';
      const returnUrl = 'test';
      const response = {
        subscription: null,
        paymentUrl,
        returnUrl: returnUrl,
        errors: null,
      };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ createSubscriptionFromCart: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(
        testResource.createSubscriptionFromCart(
          paymentUrl,
          returnUrl,
          'testToken'
        )
      ).rejects.toThrow('Could not create subscription');
    });

    it('should throw validation errors with correctly formated attribute names', async () => {
      const paymentPageUrl = 'test';
      const returnUrl = 'test';
      const response = {
        subscription: {
          ...subscription,
          id: 'test',
          token: 'test',
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
        updatePlan: {
          subscription: { ...subscription, id: 'test', token: 'test' },
        },
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
          ...subscription,
          id: 'test',
          token: 'test',
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
      ).resolves.toMatchObject({ subscription: response.subscription });
    });

    it('should throw an error if response is null', async () => {
      const input = 'new-plan';
      const response = null;
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ updatePlan: response });
      const testResource = new SubscriptionsResource(mockGraphQLClient);
      expect(testResource.updatePlan(input, 'testToken')).rejects.toThrow(
        'Could not update plan'
      );
    });
  });
});
