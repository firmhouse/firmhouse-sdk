import {
  OrderedProductIntervalUnitOfMeasure,
  OrderedProductStatus,
  SubscriptionStatus,
} from '@firmhouse/firmhouse-sdk/lib/graphql/generated';
import {
  OrderedProductType,
  SubscriptionType,
  _formatOrderedProduct,
  _formatSubscription,
  _formatSubscriptionInResponse,
} from '@firmhouse/firmhouse-sdk/lib/helpers/subscription';

//Base ordered product example with all properties
const orderedProduct: OrderedProductType = {
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
  intervalUnitOfMeasureType: null,
};
const formattedOrderedProduct = {
  ...orderedProduct,
  intervalUnitOfMeasureType: OrderedProductIntervalUnitOfMeasure.Months,
};

const subscription: SubscriptionType = {
  token: 'test',
  skipAutoActivationOnSignup: false,
  startDate: '',
  status: SubscriptionStatus.Draft,
  termsAccepted: false,
  extraFields: [],
  orderedProducts: [orderedProduct],
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
  cancellationStartedAt: null,
  cancelledAt: null,
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
  signupCompletedAt: null,
  state: null,
  stoppedAt: null,
  termsAcceptedOn: null,
  trialPeriodMonths: null,
  updatePaymentMethodUrl: null,
  vatNumber: null,
  zipcode: null,
  activePlan: null,
};

const formattedSubscription = {
  ...subscription,
  orderedProducts: [formattedOrderedProduct],
};

describe('helpers/subscription', () => {
  describe('formatOrderedProduct', () => {
    it('should format ordered products correctly', () => {
      const input = orderedProduct;
      const output = _formatOrderedProduct(input);
      expect(output).toEqual(formattedOrderedProduct);
    });

    it('should return intervalUnitOfMeasureType as null if it is not one of the enum types', () => {
      const input = {
        ...orderedProduct,
        intervalUnitOfMeasure: 'only_once',
      };
      const output = _formatOrderedProduct(input);
      expect(output).toEqual({
        ...input,
        intervalUnitOfMeasureType: null,
      });
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
});
