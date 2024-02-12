import {
  OrderedProductType,
  assignSubscriptionUtils,
} from '../../../src/lib/helpers/subscription';
import {
  OrderedProductIntervalUnitOfMeasure,
  OrderedProductStatus,
  SubscriptionStatus,
} from '@firmhouse/firmhouse-sdk/lib/graphql/generated';
import {
  BaseOrderedProductType,
  BaseSubscriptionType,
  SubscriptionType,
  _formatOrderedProduct,
  _formatSubscription,
  _formatSubscriptionInResponse,
} from '@firmhouse/firmhouse-sdk/lib/helpers/subscription';

//Base ordered product example with all properties
const orderedProduct: BaseOrderedProductType = {
  id: '1',
  intervalUnitOfMeasure: 'months',
  product: {
    id: '1',
    available: false,
    eligibleForDiscount: false,
    mandatory: false,
    slug: '',
    title: '',
    graceCancellationEnabled: null,
    graceCancellationPeriod: null,
    graceCancellationUnit: null,
    imageUrl: null,
    interval: null,
    intervalUnitOfMeasure: null,
    maximumCommitmentEnabled: null,
    maximumCommitmentPeriod: null,
    maximumCommitmentUnit: null,
    metadata: undefined,
    minimumCommitmentEnabled: null,
    minimumCommitmentPeriod: null,
    minimumCommitmentUnit: null,
    nthProductFree: null,
    priceCents: null,
    priceExcludingTaxCents: null,
    priceIncludingTaxCents: null,
    productType: null,
    shopifyProductId: null,
    shopifyVariantId: null,
    sku: null,
    supplier: null,
    taxAmountCents: null,
    taxPercentage: null,
  },
  productId: '',
  recurring: false,
  status: OrderedProductStatus.Active,
  createdAt: null,
  graceCancellationEndsAt: null,
  interval: null,
  maximumCommitmentEndsAt: null,
  metadata: undefined,
  minimumCommitmentEndsAt: null,
  priceExcludingTaxCents: null,
  priceIncludingTaxCents: null,
  quantity: null,
  shipmentDate: null,
  title: null,
  totalAmountExcludingTaxCents: null,
  totalAmountIncludingTaxCents: null,
  totalOrdered: null,
  updatedAt: null,
  plan: null,
};
const formattedOrderedProduct = {
  ...orderedProduct,
  intervalUnitOfMeasureType: OrderedProductIntervalUnitOfMeasure.Months,
  followsPlanSchedule: expect.any(Function),
  shipsOnlyOnce: expect.any(Function),
};

const subscription: SubscriptionType<BaseSubscriptionType> = {
  token: 'test',
  startDate: '',
  status: SubscriptionStatus.Draft,
  termsAccepted: false,
  extraFields: [],
  orderedProducts: [
    {
      ...orderedProduct,
      shipsOnlyOnce: expect.any(Function),
      followsPlanSchedule: expect.any(Function),
      intervalUnitOfMeasureType: OrderedProductIntervalUnitOfMeasure.Months,
    },
  ],
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

const formattedSubscription = {
  ...subscription,
  orderedProducts: [formattedOrderedProduct],
  getClosestUpcomingOrderDate: expect.any(Function),
  getClosestUpcomingOrderOrderedProducts: expect.any(Function),
};

describe('helpers/subscription', () => {
  describe('formatOrderedProduct', () => {
    it('should format ordered products correctly', () => {
      const input = orderedProduct;
      const output = _formatOrderedProduct(input, subscription);
      expect(output).toEqual(formattedOrderedProduct);
    });

    it('should return intervalUnitOfMeasureType as null if it is not one of the enum types', () => {
      const input = {
        ...orderedProduct,
        intervalUnitOfMeasure: 'only_once',
      };
      const output = _formatOrderedProduct(input, subscription);
      expect(output).toEqual({
        ...input,
        intervalUnitOfMeasureType: null,
        followsPlanSchedule: expect.any(Function),
        shipsOnlyOnce: expect.any(Function),
      });
    });
  });

  describe('followsPlanSchedule', () => {
    it('should return true if the interval unit is "on_billing_cycle" and subscription is for plan based project', () => {
      const input = {
        ...orderedProduct,
        product: {
          ...orderedProduct.product,
          intervalUnitOfMeasure: 'on_billing_cycle',
        },
      };
      const output = _formatOrderedProduct(input, {
        ...subscription,
        subscribedPlan: { id: '1' } as SubscriptionType['subscribedPlan'],
      });
      expect(output.followsPlanSchedule()).toBe(true);
    });

    it('should return false if subscription is not for plan based project', () => {
      const input = {
        ...orderedProduct,
        product: {
          ...orderedProduct.product,
          intervalUnitOfMeasure: 'on_billing_cycle',
        },
      };
      const output = _formatOrderedProduct(input, {
        ...subscription,
        subscribedPlan: null,
      });
      expect(output.followsPlanSchedule()).toBe(false);
    });

    it('should return false if interval unit is not "on_billing_cycle"', () => {
      const input = {
        ...orderedProduct,
        product: { ...orderedProduct.product, intervalUnitOfMeasure: 'months' },
      };
      const output = _formatOrderedProduct(input, {
        ...subscription,
        subscribedPlan: { id: '1' } as SubscriptionType['subscribedPlan'],
      });
      expect(output.followsPlanSchedule()).toBe(false);
    });
  });

  describe('shipsOnlyOnce', () => {
    it('should return true if the product interval unit is only_once and it is not overriden', () => {
      const input = {
        ...orderedProduct,
        intervalUnitOfMeasure: OrderedProductIntervalUnitOfMeasure.Default,
        product: {
          ...orderedProduct.product,
          intervalUnitOfMeasure: 'only_once',
        },
      };
      const output = _formatOrderedProduct(input, subscription);
      expect(output.shipsOnlyOnce()).toBe(true);
    });

    it('should return false if the product interval unit is not only_once', () => {
      const input = {
        ...orderedProduct,
        intervalUnitOfMeasure: OrderedProductIntervalUnitOfMeasure.Default,
        product: {
          ...orderedProduct.product,
          intervalUnitOfMeasure: 'on_billing_cycle',
        },
      };
      const output = _formatOrderedProduct(input, subscription);
      expect(output.shipsOnlyOnce()).toBe(false);
    });

    it('should return false if the product interval unit is overriden', () => {
      const input = {
        ...orderedProduct,
        intervalUnitOfMeasure: OrderedProductIntervalUnitOfMeasure.Months,
        product: {
          ...orderedProduct.product,
          intervalUnitOfMeasure: 'only_once',
        },
      };
      const output = _formatOrderedProduct(input, subscription);
      expect(output.shipsOnlyOnce()).toBe(false);
    });
  });

  describe('formatSubscription', () => {
    it('should format subscription correctly', () => {
      const input = subscription;
      const output = _formatSubscription(input);
      expect(output).toEqual(formattedSubscription);
    });

    it('should throw an error if subscription is missing the token property', () => {
      const input = { ...subscription, token: '' };
      try {
        expect(_formatSubscription(input)).toThrow(
          'No token returned from API'
        );
      } catch (e) {
        expect(e).toEqual(new Error('No token returned from API'));
      }
    });

    it('should handle null orderedProducts correctly', () => {
      const input = {
        ...subscription,
        orderedProducts: null,
      };
      const outputWithNoOrderedProducts = {
        ...formattedSubscription,
        orderedProducts: null,
      };
      const output = _formatSubscription(input);
      expect(output).toEqual(outputWithNoOrderedProducts);
    });
  });

  describe('formatSubscriptionInResponse', () => {
    it('should format subscription in response correctly', () => {
      const input = {
        property: 'test',
        subscription,
      };
      const output = _formatSubscriptionInResponse(input);
      expect(output).toEqual({
        ...input,
        subscription: formattedSubscription,
      });
    });
  });

  describe('assignSubscriptionUtils', () => {
    it('should add the utility methods to subscription object correctly', () => {
      const result = assignSubscriptionUtils(subscription);
      expect(result).toEqual({
        ...subscription,
        getClosestUpcomingOrderDate: expect.any(Function),
        getClosestUpcomingOrderOrderedProducts: expect.any(Function),
      });
    });
  });

  describe('getClosestUpcomingOrderDate', () => {
    it('should return the closest upcoming order date', () => {
      jest.useFakeTimers({ now: new Date('2024-01-05') });
      const orderedProducts = [
        { ...formattedOrderedProduct, shipmentDate: '2024-01-06' },
        { ...formattedOrderedProduct, shipmentDate: '2024-01-04' },
        { ...formattedOrderedProduct, shipmentDate: '2024-01-08' },
      ];
      const subscriptionWithUtils = assignSubscriptionUtils({
        ...subscription,
        orderedProducts,
      });
      expect(subscriptionWithUtils.getClosestUpcomingOrderDate()).toBe(
        '2024-01-06'
      );
    });

    it('should return null if ordered products list is empty', () => {
      const orderedProducts: OrderedProductType[] = [];
      const subscriptionWithUtils = assignSubscriptionUtils({
        ...subscription,
        orderedProducts,
      });
      expect(subscriptionWithUtils.getClosestUpcomingOrderDate()).toBeNull();
    });

    it('should return null if ordered products list is null', () => {
      const orderedProducts = null;
      const subscriptionWithUtils = assignSubscriptionUtils({
        ...subscription,
        orderedProducts,
      });
      expect(subscriptionWithUtils.getClosestUpcomingOrderDate()).toBeNull();
    });
  });

  describe('getClosestUpcomingOrderOrderedProducts', () => {
    it('should return the products for the closest upcoming order', () => {
      jest.useFakeTimers({ now: new Date('2024-01-05') });
      const orderedProducts = [
        { ...formattedOrderedProduct, id: '1', shipmentDate: '2024-01-07' },
        { ...formattedOrderedProduct, shipmentDate: '2024-01-06', id: '4' },
        { ...formattedOrderedProduct, shipmentDate: '2024-01-04', id: '2' },
        { ...formattedOrderedProduct, shipmentDate: '2024-01-06', id: '3' },
      ];
      const subscriptionWithUtils = assignSubscriptionUtils({
        ...subscription,
        orderedProducts,
      });
      expect(
        subscriptionWithUtils
          .getClosestUpcomingOrderOrderedProducts()
          .map((op) => op.id)
      ).toStrictEqual(['4', '3']);
    });

    it('should return empty array if ordered products list is empty', () => {
      const orderedProducts: OrderedProductType[] = [];
      const subscriptionWithUtils = assignSubscriptionUtils({
        ...subscription,
        orderedProducts,
      });
      expect(
        subscriptionWithUtils.getClosestUpcomingOrderOrderedProducts()
      ).toStrictEqual([]);
    });

    it('should return empty array if ordered products list is null', () => {
      const orderedProducts = null;
      const subscriptionWithUtils = assignSubscriptionUtils({
        ...subscription,
        orderedProducts,
      });
      expect(
        subscriptionWithUtils.getClosestUpcomingOrderOrderedProducts()
      ).toStrictEqual([]);
    });
  });
});
