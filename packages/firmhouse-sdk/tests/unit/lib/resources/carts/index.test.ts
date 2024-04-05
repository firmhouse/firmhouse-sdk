import {
  ServerError,
  ValidationError,
} from '@firmhouse/firmhouse-sdk/lib/helpers/errors';
import {
  CreateCartDocument,
  GetCartDocument,
  AddToCartDocument,
  RemoveFromCartDocument,
  UpdateOrderedProductInCartDocument,
  UpdateAddressDetailsDocument,
  CreateSubscriptionFromCartDocument,
  UpdateCartPlanDocument,
  UpdateOrderedProductInCartQuantityDocument,
} from '../../../../../src/lib/resources/carts/carts.generated';
import { CartsResource } from '@firmhouse/firmhouse-sdk/lib/resources/carts';

import { SubscriptionStatus } from '@firmhouse/firmhouse-sdk/lib/graphql/generated';
import { _GraphQLClient } from '@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient';

jest.mock('@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient');

const subscription = {
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
  orderedProduct: null,
};

describe('lib/resources/carts/index.ts', () => {
  let mockGraphQLClient: _GraphQLClient;

  beforeEach(() => {
    mockGraphQLClient = new _GraphQLClient('test', 'http://test.com');
  });
  it('should initialize the CartsResource correctly', () => {
    const testResource = new CartsResource(mockGraphQLClient);
    expect(testResource).toBeInstanceOf(CartsResource);
  });

  describe('create', () => {
    it('should call the correct query', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        createCart: { subscription: { ...subscription, token: 'test' } },
      });
      const testResource = new CartsResource(mockGraphQLClient);
      await testResource.create({
        discountCodes: {
          includeRelations: {
            autoSelectPlan: true,
            promotion: true,
          },
        },
        appliedPromotions: true,
      });
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        CreateCartDocument,
        {
          input: {},
          includeAppliedPromotions: true,
          includeDiscountCodes: true,
          includeDiscountCodesAutoSelectPlan: true,
          includeDiscountCodesPromotion: true,
        }
      );
    });
    it('should throw error if null response is return from API', async () => {
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ createCart: null });
      const testResource = new CartsResource(mockGraphQLClient);
      expect(testResource.create()).rejects.toThrow(
        'Could not create subscription'
      );
    });

    it('should throw error if undefined response is return from API', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({});
      const testResource = new CartsResource(mockGraphQLClient);
      expect(testResource.create()).rejects.toThrow(
        'Could not create subscription'
      );
    });

    it('should return subscription token', async () => {
      const token = 'test';
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        createCart: { subscription: { ...subscription, token } },
      });
      const testResource = new CartsResource(mockGraphQLClient);
      const draftSubscription = await testResource.create();
      expect(draftSubscription?.token).toBe(token);
    });
  });

  describe('createCartToken', () => {
    it('should call createCart method', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        createCart: { subscription: { ...subscription, token: 'test' } },
      });
      const testResource = new CartsResource(mockGraphQLClient);
      testResource.create = jest.fn().mockResolvedValue({ token: 'test' });
      await testResource.createCartToken();
      expect(testResource.create).toHaveBeenCalled();
    });

    it('should return cart token', async () => {
      const token = 'test';
      const testResource = new CartsResource(mockGraphQLClient);
      testResource.create = jest.fn().mockResolvedValue({ token });
      expect(testResource.createCartToken()).resolves.toStrictEqual(token);
    });

    it('should throw error if no token is returned', async () => {
      const testResource = new CartsResource(mockGraphQLClient);
      testResource.create = jest
        .fn()
        .mockResolvedValue({ subscription: { token: null } });
      expect(testResource.createCartToken()).rejects.toThrow(
        'No token returned from API'
      );
    });
  });

  describe('get', () => {
    it('should call the correct query', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        getCart: { ...subscription, token: 'test' },
      });
      const token = 'testToken';
      const testResource = new CartsResource(mockGraphQLClient);
      await testResource.get(token);
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        GetCartDocument,
        {
          token,
          includeAppliedPromotions: false,
          includeDiscountCodes: false,
          includeDiscountCodesAutoSelectPlan: false,
          includeDiscountCodesPromotion: false,
        },
        { 'X-Subscription-Token': token }
      );
    });

    it('should return cart with given token', async () => {
      const token = 'testToken';
      const draftSubscription = { ...subscription, id: 'test', token };
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ getCart: draftSubscription });
      const testResource = new CartsResource(mockGraphQLClient);
      expect(testResource.get(token)).resolves.toMatchObject({});
    });

    it('should throw error if no subscription found matching the given token', async () => {
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ getCart: null });
      const token = 'testToken';
      const testResource = new CartsResource(mockGraphQLClient);
      expect(testResource.get(token)).rejects.toThrow('Cart not found');
    });
  });

  describe('getOrCreate', () => {
    it('should return subscription if a draft subscription matching the given token exists ', async () => {
      const testResource = new CartsResource(mockGraphQLClient);
      const draftSubscription = {
        ...subscription,
        status: SubscriptionStatus.Draft,
        token: 'testToken',
        orderedProducts: [],
      };
      testResource.get = jest.fn().mockResolvedValue(draftSubscription);
      expect(testResource.getOrCreate('testToken')).resolves.toMatchObject(
        draftSubscription
      );
    });

    it('should create a new subscription if the subscription matching the given token is not a draft subscription ', async () => {
      const testResource = new CartsResource(mockGraphQLClient);
      const activeSubscription = { status: 'Active', token: 'token' };
      testResource.get = jest.fn().mockResolvedValue(activeSubscription);
      const draftSubscription = {
        ...subscription,
        status: SubscriptionStatus.Draft,
        token: 'token',
        orderedProducts: [],
      };
      testResource.create = jest.fn().mockResolvedValue(draftSubscription);
      expect(testResource.getOrCreate('testToken')).resolves.toStrictEqual(
        draftSubscription
      );
    });

    it('should create a new subscription if no subscription matches given token', async () => {
      const testResource = new CartsResource(mockGraphQLClient);
      testResource.get = jest
        .fn()
        .mockRejectedValue(new Error('Subscription not found'));
      const draftSubscription = {
        ...subscription,
        status: SubscriptionStatus.Draft,
        token: 'testToken',
      };
      testResource.create = jest.fn().mockResolvedValue(draftSubscription);
      expect(testResource.getOrCreate('testToken')).resolves.toStrictEqual(
        draftSubscription
      );
    });

    it('should throw an error if returned subscription does not have a token', async () => {
      const testResource = new CartsResource(mockGraphQLClient);
      testResource.get = jest
        .fn()
        .mockRejectedValue(new Error('Subscription not found'));
      testResource.create = jest
        .fn()
        .mockRejectedValue(new ServerError('No token returned from API'));
      expect(testResource.getOrCreate('testToken')).rejects.toThrow(
        'No token returned from API'
      );
    });
  });

  describe('addProduct', () => {
    it('should call the correct mutation', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        addToCart: {
          subscription,
          orderedProduct: { id: 'x' },
        },
      });
      const testResource = new CartsResource(mockGraphQLClient);
      const input = { productId: 'test', quantity: 1 };
      await testResource.addProduct('testToken', input);
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        AddToCartDocument,
        { input },
        { 'X-Subscription-Token': 'testToken' }
      );
    });

    it('should return ordered product with updated subscription', async () => {
      const orderedProduct = {
        id: 'test',
        quantity: 1,
      };
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        addToCart: { orderedProduct: { ...orderedProduct }, subscription },
      });
      const testResource = new CartsResource(mockGraphQLClient);
      const input = { productId: 'test', quantity: 1 };
      expect(
        testResource.addProduct('testToken', input)
      ).resolves.toMatchObject({ orderedProduct, subscription });
    });

    it('should throw an error if response is null', async () => {
      const response = null;
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ createOrderedProduct: response });
      const testResource = new CartsResource(mockGraphQLClient);
      const input = { productId: 'test', quantity: 1 };
      expect(testResource.addProduct('testToken', input)).rejects.toThrow(
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
      const testResource = new CartsResource(mockGraphQLClient);
      const input = { productId: 'test', quantity: 1 };
      expect(testResource.addProduct('testToken', input)).rejects.toThrow(
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
      const testResource = new CartsResource(mockGraphQLClient);
      const input = { productId: 'test', quantity: 1 };
      expect(testResource.addProduct('testToken', input)).rejects.toThrow(
        'Could not add product to cart'
      );
    });
  });

  describe('removeFromCart', () => {
    it('should call the correct mutation', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        removeFromCart: {
          subscription,
          orderedProduct: {},
        },
      });
      const testResource = new CartsResource(mockGraphQLClient);
      const id = 'test';
      await testResource.removeProduct('testToken', id);
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
        .mockResolvedValue({ removeFromCart: response });
      const testResource = new CartsResource(mockGraphQLClient);
      expect(
        testResource.removeProduct('testToken', response.orderedProduct.id)
      ).resolves.toMatchObject(response);
    });
    it('should throw an error if response is null', async () => {
      const response = null;
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ removeProduct: response });
      const testResource = new CartsResource(mockGraphQLClient);
      expect(testResource.removeProduct('testToken', 'test')).rejects.toThrow(
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
        .mockResolvedValue({ removeFromCart: response });
      const testResource = new CartsResource(mockGraphQLClient);
      expect(testResource.removeProduct('testToken', 'test')).rejects.toThrow(
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
        .mockResolvedValue({ removeFromCart: response });
      const testResource = new CartsResource(mockGraphQLClient);
      expect(testResource.removeProduct('testToken', 'test')).rejects.toThrow(
        'Could not remove product from cart'
      );
    });
  });

  describe('updateOrderedProductQuantity', () => {
    it('should call the correct mutation', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        updateOrderedProductInCartQuantity: {
          subscription: { ...subscription, id: 'test', token: 'test' },
          orderedProduct: {},
        },
      });
      const testResource = new CartsResource(mockGraphQLClient);
      const testId = 'test';
      const testQuantity = 5;
      await testResource.updateOrderedProductQuantity(
        'testToken',
        testId,
        testQuantity
      );
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        UpdateOrderedProductInCartQuantityDocument,
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
        .mockResolvedValue({ updateOrderedProductInCartQuantity: response });
      const testResource = new CartsResource(mockGraphQLClient);
      expect(
        testResource.updateOrderedProductQuantity(
          'testToken',
          response.orderedProduct.id,
          response.orderedProduct.quantity
        )
      ).resolves.toMatchObject(response);
    });
    it('should throw an error if response is null', async () => {
      const response = null;
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ updateOrderedProductInCartQuantity: response });
      const testResource = new CartsResource(mockGraphQLClient);
      expect(
        testResource.updateOrderedProductQuantity('testToken', 'test', 1)
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
        .mockResolvedValue({ updateOrderedProductInCartQuantity: response });
      const testResource = new CartsResource(mockGraphQLClient);
      expect(
        testResource.updateOrderedProductQuantity('testToken', 'test', 1)
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
        .mockResolvedValue({ updateOrderedProductInCartQuantity: response });
      const testResource = new CartsResource(mockGraphQLClient);
      expect(
        testResource.updateOrderedProductQuantity('testToken', 'test', 1)
      ).rejects.toThrow('Could not update ordered product quantity');
    });
  });

  describe('updateOrderedProduct', () => {
    it('should call the correct mutation', async () => {
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        updateOrderedProductInCart: {
          orderedProduct: {
            subscription: { token: 'testToken', orderedProducts: [] },
          },
        },
      });
      const input = { id: 'test', shipmentDate: '20-01-2024' };
      const testResource = new CartsResource(mockGraphQLClient);
      await testResource.updateOrderedProduct('testToken', input);
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        UpdateOrderedProductInCartDocument,
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
        .mockResolvedValue({ updateOrderedProductInCart: response });
      const testResource = new CartsResource(mockGraphQLClient);
      expect(
        testResource.updateOrderedProduct('testToken', input)
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
        .mockResolvedValue({ updateOrderedProductInCart: response });
      const testResource = new CartsResource(mockGraphQLClient);
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
        .mockResolvedValue({ updateOrderedProductInCart: response });
      const testResource = new CartsResource(mockGraphQLClient);
      expect(
        testResource.updateOrderedProduct('testToken', input)
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
      const testResource = new CartsResource(mockGraphQLClient);
      const input = { address: 'test' };
      await testResource.updateAddressDetails('testToken', input);
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
      const testResource = new CartsResource(mockGraphQLClient);
      expect(
        testResource.updateAddressDetails('testToken', input)
      ).resolves.toMatchObject(response.subscription);
    });

    it('should handle empty response correctly', async () => {
      const input = { address: 'test', name: 'test name' };
      const response = null;
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ updateAddressDetails: response });
      const testResource = new CartsResource(mockGraphQLClient);
      expect(
        testResource.updateAddressDetails('testToken', input)
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
      const testResource = new CartsResource(mockGraphQLClient);
      expect(
        testResource.updateAddressDetails('testToken', input)
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
      const testResource = new CartsResource(mockGraphQLClient);
      let thrownError: ValidationError | undefined;
      try {
        await testResource.updateAddressDetails('testToken', input);
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
      const testResource = new CartsResource(mockGraphQLClient);
      const paymentPageUrl = 'test';
      const returnUrl = 'test';
      await testResource.createSubscription(
        'testToken',
        paymentPageUrl,
        returnUrl
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
      const testResource = new CartsResource(mockGraphQLClient);
      expect(
        testResource.createSubscription('testToken', paymentUrl, returnUrl)
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
      const testResource = new CartsResource(mockGraphQLClient);
      expect(
        testResource.createSubscription('testToken', paymentPageUrl, returnUrl)
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
      const testResource = new CartsResource(mockGraphQLClient);
      expect(
        testResource.createSubscription('testToken', paymentUrl, returnUrl)
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
      const testResource = new CartsResource(mockGraphQLClient);
      let thrownError: ValidationError | undefined;
      try {
        await testResource.createSubscription(
          'testToken',
          paymentPageUrl,
          returnUrl
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
        updateCartPlan: {
          subscription: { ...subscription, id: 'test', token: 'test' },
        },
      });
      const testResource = new CartsResource(mockGraphQLClient);
      const planSlug = 'new-plan';
      await testResource.updatePlan('testToken', planSlug);
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(
        UpdateCartPlanDocument,
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
        .mockResolvedValue({ updateCartPlan: response });
      const testResource = new CartsResource(mockGraphQLClient);
      expect(
        testResource.updatePlan('testToken', input)
      ).resolves.toMatchObject(response.subscription);
    });

    it('should throw an error if response is null', async () => {
      const input = 'new-plan';
      const response = null;
      mockGraphQLClient.request = jest
        .fn()
        .mockResolvedValue({ updateCartPlan: response });
      const testResource = new CartsResource(mockGraphQLClient);
      expect(testResource.updatePlan('testToken', input)).rejects.toThrow(
        'Could not update plan'
      );
    });
  });
});
