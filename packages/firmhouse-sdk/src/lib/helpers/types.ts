import {
  AppliedPromotionDeactivationStrategy,
  BaseIntervalUnit,
  BillingCycleIntervalUnit,
  CollectionCaseStatus,
  CommitmentUnit,
  InvoiceStatusEnum,
  LineItemTypeEnum,
  MaximumCommitmentUnit,
  OrderStatus,
  OrderedProductIntervalUnitOfMeasure,
  OrderedProductStatus,
  PaymentStatusEnum,
  PaymentTypeEnum,
  RefundStatus,
  SubscriptionStatus,
} from '../graphql/generated';

/**
 * @public
 * Resolves all modifiers in a interface.
 * @remarks
 * e.g. \{ foo: string \} & \{ bar: number \} =\> \{ foo: string, bar: number\}
 */
export type ResolveObject<T extends object> = T extends object
  ? { [K in keyof T]: T[K] }
  : T;

/**
 * @public
 * Paginated Response
 */
export type PaginatedResponse<T> = {
  total: number;
  pageInfo?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
  results: T[];
};

export interface FirmhousePromotion {
  activated: boolean;
  autoApply: boolean;
  deactivateAfterAmountIncludingTaxCents: number | null;
  deactivateAfterTimes: number | null;
  deactivationStrategy: AppliedPromotionDeactivationStrategy;
  id: string;
  percentDiscount: number | null;
  publicName: string | null;
  title: string;
}

export interface FirmhouseTaxRate {
  description: string;
  excludingTax: boolean;
  id: string;
  percentage: number;
}

export interface FirmhouseExtraField {
  fieldType: string;
  id: string;
  name: string;
  position: number | null;
  required: boolean;
  selectOptions: string[] | null;
  visibility: string;
}

export interface FirmhouseExtraFieldAnswer {
  extraFieldId: string;
  fieldType: string;
  id: string | null;
  name: string;
  position: number | null;
  required: boolean;
  selectOptions: string[] | null;
  value: string | null;
  visibility: string;
}

export interface FirmhouseProject {
  availableCountries: string[];
  availableCountryStates: unknown;
  currency: string;
  currentStock: number | null;
  dynamicOrderStrategy: string;
  freeShipmentFromCents: number | null;
  id: string;
  name: string;
  paymentProvider: string | null;
  productImageUrl: string | null;
  productName: string | null;
  projectType: string | null;
  shippingCostsCents: number | null;
  shippingCostsExclTaxCents: number | null;
  subscriptionLimitEnabled: boolean;
  token: string;
  twoStepCancellationEnabled: boolean | null;
  twoStepSignupEnabled: boolean;
  updatedAt: string | null;
  licence: {
    showFirmhouseLogo: boolean | null;
  } | null;
  promotions?: FirmhousePromotion[];
  taxRates?: FirmhouseTaxRate[];
  extraFields?: FirmhouseExtraField[] | null;
}

export interface FirmhouseProduct {
  available: boolean;
  eligibleForDiscount: boolean;
  graceCancellationEnabled: boolean | null;
  graceCancellationPeriod: number | null;
  graceCancellationUnit: CommitmentUnit | null;
  id: string;
  imageUrl: string | null;
  interval: number | null;
  intervalUnitOfMeasure: string | null;
  mandatory: boolean;
  maximumCommitmentEnabled: boolean | null;
  maximumCommitmentPeriod: number | null;
  maximumCommitmentUnit: MaximumCommitmentUnit | null;
  metadata: unknown | null;
  minimumCommitmentEnabled: boolean | null;
  minimumCommitmentPeriod: number | null;
  minimumCommitmentUnit: CommitmentUnit | null;
  nthProductFree: number | null;
  priceCents: number | null;
  priceExcludingTaxCents: number | null;
  priceIncludingTaxCents: number | null;
  productType: string | null;
  shopifyProductId: string | null;
  shopifyVariantId: string | null;
  sku: string | null;
  slug: string;
  supplier: string | null;
  taxAmountCents: number | null;
  taxPercentage: number | null;
  title: string;
}

export interface FirmhousePlan {
  available: boolean;
  currency: string | null;
  graceCancellationEnabled: boolean;
  graceCancellationPeriod: number;
  graceCancellationUnit: CommitmentUnit;
  id: string;
  imageUrl: string | null;
  initialAmountExcludingTaxCents: number | null;
  initialAmountIncludingTaxCents: number | null;
  instalmentIntervalPeriod: number | null;
  instalmentIntervalUnit: BaseIntervalUnit | null;
  instalments: number | null;
  maximumCommitmentEnabled: boolean | null;
  maximumCommitmentPeriod: number | null;
  maximumCommitmentUnit: MaximumCommitmentUnit | null;
  metadata: unknown | null;
  minimumCommitmentEnabled: boolean;
  minimumCommitmentPeriod: number;
  minimumCommitmentUnit: CommitmentUnit;
  monthlyAmountCents: number | null;
  monthlyAmountExcludingTaxCents: number | null;
  monthlyAmountIncludingTaxCents: number | null;
  name: string;
  slug: string;
  taxAmountCents: number | null;
  taxPercentage: number | null;
  planProducts: {
    quantity: number;
    product: FirmhouseProduct;
  }[];
}

export interface FirmhouseInvoiceLineItem {
  amountExcludingTaxCents: number;
  amountIncludingTaxCents: number;
  billingPeriodEndsAt: string | null;
  billingPeriodStartsAt: string | null;
  description: string | null;
  effectiveAmountExcludingTaxCents: number;
  effectiveAmountIncludingTaxCents: number;
  id: string;
  lineItemType: LineItemTypeEnum;
  metadata: unknown | null;
  quantity: number;
  taxPercentage: number;
  totalAmountExcludingTaxCents: number;
  totalAmountIncludingTaxCents: number;
  totalTaxAmountCents: number;
  product: FirmhouseProduct;
}
export interface FirmhouseCollectionCase {
  caseNumber: string;
  createdAt: string | null;
  id: string;
  status: CollectionCaseStatus;
  updatedAt: string | null;
}

export interface FirmhouseInvoiceReminder {
  id: string;
  remindOn: string;
  remindedAt: string | null;
  reminderNumber: number;
}

export interface FirmhouseOriginalInvoice {
  city: string | null;
  companyName: string | null;
  country: string | null;
  createdAt: string;
  currency: string | null;
  description: string | null;
  detailsUrl: string;
  externalUrl: string | null;
  fullAddress: string | null;
  fullName: string | null;
  id: string;
  invoiceNumber: string;
  invoiceStatus: InvoiceStatusEnum;
  invoicedAt: string | null;
  phoneNumber: string | null;
  salutation: string | null;
  state: string | null;
  status: string;
  subscriptionId: string;
  taxPercentage: number | null;
  totalAmountCents: number;
  totalTaxAmountCents: number;
  zipcode: string | null;
}

export interface FirmhouseRefund {
  amountCents: number;
  id: string;
  paymentProviderObjectId: string | null;
  reason: string | null;
  refundedAt: string | null;
  status: RefundStatus;
}

export interface FirmhousePayment {
  amountCents: number;
  amountWithSymbol: string;
  createdAt: string;
  id: string;
  paymentId: string | null;
  paymentStatus: PaymentStatusEnum;
  paymentType: PaymentTypeEnum;
  retryPaymentUrl: string | null;
  status: string | null;
  token: string;
  updatedAt: string;
  refunds: FirmhouseRefund[];
}

export interface FirmhouseInvoice {
  city: string | null;
  companyName: string | null;
  country: string | null;
  createdAt: string;
  currency: string | null;
  description: string | null;
  detailsUrl: string;
  externalUrl: string | null;
  fullAddress: string | null;
  fullName: string | null;
  id: string;
  invoiceNumber: string;
  invoiceStatus: InvoiceStatusEnum;
  invoicedAt: string | null;
  phoneNumber: string | null;
  salutation: string | null;
  state: string | null;
  status: string;
  subscriptionId: string;
  taxPercentage: number | null;
  totalAmountCents: number;
  totalTaxAmountCents: number;
  zipcode: string | null;
  collectionCase?: FirmhouseCollectionCase | null;
  invoiceLineItems?: FirmhouseInvoiceLineItem[] | null;
  invoiceReminders?: FirmhouseInvoiceReminder[] | null;
  originalInvoice?: FirmhouseOriginalInvoice | null;
  payment?: FirmhousePayment | null;
}

export interface FirmhouseSubscribedPlan {
  activatedAt: string | null;
  allowedToCancel: boolean;
  billingCycleInterval: number | null;
  billingCycleIntervalUnit: BillingCycleIntervalUnit | null;
  customInitialAmountCents: number | null;
  customRecurringAmountCents: number | null;
  graceCancellationEndsAt: string | null;
  graceCancellationPeriod: number | null;
  graceCancellationUnit: CommitmentUnit | null;
  id: string;
  inGraceCancellation: boolean;
  inMinimumCommitment: boolean;
  maximumCommitmentEndsAt: string | null;
  maximumCommitmentPeriod: number | null;
  maximumCommitmentUnit: MaximumCommitmentUnit | null;
  minimumCommitmentEndsAt: string | null;
  minimumCommitmentPeriod: number | null;
  minimumCommitmentUnit: CommitmentUnit | null;
  name: string;
  nextBillingDate: string | null;
  showInPriceBreakDown: boolean;
  trialPeriodPeriod: number | null;
  trialPeriodUnit: CommitmentUnit | null;
  unconsumedContractTermEventCount: number | null;
}

export interface FirmhouseOrderedProductUtils {
  followsPlanSchedule: () => boolean;
  shipsOnlyOnce: () => boolean;
}

export interface FirmhouseOrderedProduct {
  createdAt: string | null;
  graceCancellationEndsAt: string | null;
  id: string;
  interval: number | null;
  intervalUnitOfMeasure: string | null;
  intervalUnitOfMeasureType: OrderedProductIntervalUnitOfMeasure | null;
  maximumCommitmentEndsAt: string | null;
  metadata: unknown | null;
  minimumCommitmentEndsAt: string | null;
  priceExcludingTaxCents: number | null;
  priceIncludingTaxCents: number | null;
  productId: string;
  quantity: number | null;
  recurring: boolean;
  shipmentDate: string | null;
  status: OrderedProductStatus;
  title: string | null;
  totalAmountExcludingTaxCents: number | null;
  totalAmountIncludingTaxCents: number | null;
  totalOrdered: number | null;
  updatedAt: string | null;
  plan: { id: string } | null;
  product: FirmhouseProduct;
}

export interface FirmhouseOrderedProductWithUtils
  extends FirmhouseOrderedProduct,
    FirmhouseOrderedProductUtils {}

export interface FirmhouseSubscriptionUtils {
  getClosestUpcomingOrderDate: () => string | null;
  getClosestUpcomingOrderOrderedProducts: () => FirmhouseOrderedProduct[];
}

/**
 * @public
 * Cart
 */
export interface FirmhouseCart {
  address: string | null;
  amountForStartingSubscriptionCents: number | null;
  billToAddress: string | null;
  billToCity: string | null;
  billToCompanyName: string | null;
  billToCountry: string | null;
  billToDistrict: string | null;
  billToFullAddress: string | null;
  billToFullName: string | null;
  billToHouseNumber: string | null;
  billToLastName: string | null;
  billToName: string | null;
  billToPhoneNumber: string | null;
  billToSalutation: string | null;
  billToState: string | null;
  billToZipcode: string | null;
  chargeDayOfTheMonth: number | null;
  checkoutUrl: string | null;
  city: string | null;
  companyName: string | null;
  country: string | null;
  createdAt: string | null;
  currency: string | null;
  customerId: string | null;
  customerReference: string | null;
  dateOfBirth: string | null;
  differentBillingAddress: boolean | null;
  district: string | null;
  email: string | null;
  fullAddress: string | null;
  fullName: string | null;
  houseNumber: string | null;
  id: string | null;
  identityVerificationUrl: string | null;
  lastName: string | null;
  locale: string | null;
  marketingOptIn: boolean | null;
  metadata: unknown | null;
  monthlyAmountCents: number | null;
  name: string | null;
  phoneNumber: string | null;
  salutation: string | null;
  startDate: string;
  state: string | null;
  status: SubscriptionStatus;
  termsAccepted: boolean;
  termsAcceptedOn: string | null;
  token: string;
  trialPeriodMonths: number | null;
  updatedAt: string | null;
  vatNumber: string | null;
  zipcode: string | null;
  activePlan: FirmhousePlan | null;
  subscribedPlan: FirmhouseSubscribedPlan | null;
  orderedProducts: FirmhouseOrderedProduct[] | null;
  extraFields: FirmhouseExtraFieldAnswer[];
}
export interface FirmhouseOrderLine {
  metadata: unknown | null;
  productSku: string | null;
  productTitle: string | null;
  productType: FirmhouseOrderedProduct | null;
  quantity: number;
  taxPercentage: number | null;
  totalAmountExcludingTaxCents: number | null;
  totalAmountIncludingTaxCents: number | null;
  product: FirmhouseProduct;
}

export interface FirmhouseOrder {
  acceptUrl: string | null;
  amountCents: number;
  cancelUrl: string | null;
  createdAt: string | null;
  discountCents: number | null;
  discountExclTaxCents: number | null;
  fulfilledAt: string | null;
  id: string | null;
  paid: boolean;
  shipmentDate: string | null;
  shippingCostsCents: number | null;
  shippingCostsExclTaxCents: number | null;
  shopifyDraftId: string | null;
  shopifyId: string | null;
  snoozeUrl: string | null;
  status: OrderStatus;
  totalTaxCents: number;
  trackAndTraceCode: string | null;
  trackingCode: string | null;
  updatedAt: string | null;
  orderLines?: FirmhouseOrderLine[] | null;
  invoice?: FirmhouseInvoice | null;
  payment?: FirmhousePayment | null;
}

export interface FirmouseCollectionCase {
  caseNumber: string;
  createdAt: string | null;
  id: string;
  status: CollectionCaseStatus;
  updatedAt: string | null;
}

export interface FirmhouseVerifiedIdentity {
  /**
   * The createdAt date of the identity verification
   */
  createdAt: string;
  /**
   * The payload of the identity verification
   */
  payload: unknown;
  /**
   * Name of the service provider that verified the identity
   */
  serviceProvider: string;
  /**
   * The status of the identity verification
   */
  status: string;
  /**
   * The method used to verify the identity
   */
  verificationMethod: string | null;
}

export interface FirmhouseSubscription extends FirmhouseCart {
  activatedAt: string | null;
  cancellationStartedAt: string | null;
  cancelledAt: string | null;
  inTrialPeriod: boolean;
  markedAsNonPayingAt: string | null;
  notes: string | null;
  paidAmount: number | null;
  pausedAt: string | null;
  pausedUntil: string | null;
  paymentMethod: string | null;
  paymentMethodSummary: string | null;
  paymentMethodTranslated: string | null;
  projectId: string;
  pspPaymentMethodDetails: unknown | null;
  signupCompletedAt: string | null;
  skipAutoActivationOnSignup: boolean;
  stoppedAt: string | null;
  updatePaymentMethodUrl: string | null;
  collectionCases?: FirmhouseCollectionCase[];
  verifiedIdentity?: FirmhouseVerifiedIdentity | null;
  ordersV2?: PaginatedResponse<FirmhouseOrder>;
  invoices?: FirmhouseInvoice[] | null;
  payment?: FirmhousePayment | null;
}

export interface FirmhouseSubscriptionWithUtils
  extends FirmhouseSubscription,
    FirmhouseSubscriptionUtils {
  orderedProducts: FirmhouseOrderedProductWithUtils[] | null;
}
