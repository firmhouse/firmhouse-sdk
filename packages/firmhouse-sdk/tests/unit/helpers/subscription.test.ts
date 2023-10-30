import {
  OrderedProductIntervalUnitOfMeasure,
  OrderedProductStatus,
  SubscriptionStatus,
} from '@firmhouse/firmhouse-sdk/lib/graphql/generated';
import {
  formatOrderedProduct,
  formatSubscription,
  formatSubscriptionInResponse,
} from '@firmhouse/firmhouse-sdk/lib/helpers/subscription';

//Base ordered product example with all properties
const orderedProduct = {
  id: '1',
  intervalUnitOfMeasure: 'months',
  product: {
    id: '1',
    available: false,
    eligibleForDiscount: false,
    mandatory: false,
    slug: '',
    title: '',
  },
  productId: '',
  recurring: false,
  status: OrderedProductStatus.Active,
};
const formattedOrderedProduct = {
  ...orderedProduct,
  intervalUnitOfMeasureType: OrderedProductIntervalUnitOfMeasure.Months,
};

const subscription = {
  token: 'test',
  skipAutoActivationOnSignup: false,
  startDate: '',
  status: SubscriptionStatus.Draft,
  termsAccepted: false,
  extraFields: [],
  orderedProducts: [orderedProduct],
};

const formattedSubscription = {
  ...subscription,
  orderedProducts: [formattedOrderedProduct],
};

describe('helpers/subscription', () => {
  describe('formatOrderedProduct', () => {
    it('should format ordered products correctly', () => {
      const input = orderedProduct;
      const output = formatOrderedProduct(input);
      expect(output).toEqual(formattedOrderedProduct);
    });

    it('should return intervalUnitOfMeasureType as null if it is not one of the enum types', () => {
      const input = {
        ...orderedProduct,
        intervalUnitOfMeasure: 'only_once',
      };
      const output = formatOrderedProduct(input);
      expect(output).toEqual({
        ...input,
        intervalUnitOfMeasureType: null,
      });
    });
  });

  describe('formatSubscription', () => {
    it('should format subscription correctly', () => {
      const input = subscription;
      const output = formatSubscription(input);
      expect(output).toEqual(formattedSubscription);
    });

    it('should throw an error if subscription is missing the token property', () => {
      const input = { ...subscription, token: '' };
      try {
        expect(formatSubscription(input)).toThrow('No token returned from API');
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
        orderedProducts: undefined,
      };
      const output = formatSubscription(input);
      expect(output).toEqual(outputWithNoOrderedProducts);
    });

    it('should handle undefined orderedProducts correctly', () => {
      const { orderedProducts, ...subscriptionWithoutOrderedProducts } =
        subscription;
      const input = subscriptionWithoutOrderedProducts;
      const outputWithNoOrderedProducts = {
        ...formattedSubscription,
        orderedProducts: undefined,
      };
      const output = formatSubscription(input);
      expect(output).toEqual(outputWithNoOrderedProducts);
    });
  });

  describe('formatSubscriptionInResponse', () => {
    it('should format subscription in response correctly', () => {
      const input = {
        property: 'test',
        subscription,
      };
      const output = formatSubscriptionInResponse(input);
      expect(output).toEqual({
        ...input,
        subscription: formattedSubscription,
      });
    });
  });
});
