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
 * @internal
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
  /**
   * The total amount of items available.
   */
  total: number;
  pageInfo?: {
    /**
     * When paginating forwards, are there more items?
     */
    hasNextPage: boolean;

    /**
     *  When paginating backwards, are there more items?
     */
    hasPreviousPage: boolean;

    /**
     * When paginating backwards, the cursor to continue.
     */
    startCursor: string | null;

    /**
     * When paginating forwards, the cursor to continue.
     */
    endCursor: string | null;
  };
  /**
   * A list of nodes.
   */
  results: T[];
};
/**
 * @public
 */
export interface FirmhousePromotion {
  /**
   * Whether the promotion is currently active.
   */
  activated: boolean;
  /**
   * Whether or not this promotion will automatically be applied on checkout
   */
  autoApply: boolean;
  /**
   * The amount after which the promotion should get deactivated on a customer
   */
  deactivateAfterAmountIncludingTaxCents: number | null;
  /**
   * After how many times this promotion is "used up" for a customer
   */
  deactivateAfterTimes: number | null;
  /**
   * Which mechanism will be used to deactivate the promotion
   */
  deactivationStrategy: AppliedPromotionDeactivationStrategy;
  /**
   * The id of this promotion that can be used to apply the promotion on a subscription
   */
  id: string;
  /**
   * The percentage of discount that this promotion gives
   */
  percentDiscount: number | null;
  /**
   * Alternative name to be displayed on invoices and checkout
   */
  publicName: string | null;
  /**
   * The title of the promotion as it will appear on invoices and in the portal
   */
  title: string;
}
/**
 * @public
 */
export interface FirmhouseTaxRate {
  /**
   * The description of this tax rate
   */
  description: string;
  /**
   * Whether the price where this tax is attached to is considered including or excluding tax
   */
  excludingTax: boolean;
  /**
   * ID to identify the tax rate with
   */
  id: string;
  /**
   * The percentage of tax that will get applied
   */
  percentage: number;
}
/**
 * @public
 * Extra fields can be used to acquire additional information from a customer upon subscription
 */
export interface FirmhouseExtraField {
  /**
   * Possible types: single_line, multi_line, date, single_select
   */
  fieldType: string;
  /**
   * ID to identify the extra field with
   */
  id: string;
  /**
   * Name of the extra field
   */
  name: string;
  /**
   * The extra fields should be ordered by this field
   */
  position: number | null;
  /**
   * Field is required to be filled
   */
  required: boolean;
  /**
   * Possible options when fieldType is dropdown
   */
  selectOptions: string[] | null;
  /**
   * Whether the extra field should be visible for public or just for internal use. Possible values: `public`, `internal`
   */
  visibility: string;
}
/**
 * @public
 * Extra field answers are the submitted values of an extra field by a customer
 */
export interface FirmhouseExtraFieldAnswer {
  /**
   * ID to identify the associated extra field
   */
  extraFieldId: string;
  /**
   * Field type of the extra field. Possible types: `single_line`, `multi_line`, `date`, `single_select`
   */
  fieldType: string;
  /**
   * ID to identify the associated extra field
   */
  id: string | null;
  /**
   * Name of the extra field
   */
  name: string;
  /**
   * The extra fields should be ordered by this field
   */
  position: number | null;
  /**
   * Field is required to be filled
   */
  required: boolean;
  /**
   * Possible options when fieldType is dropdown
   */
  selectOptions: string[] | null;
  /**
   * The submitted value of the extra field
   */
  value: string | null;
  /**
   * Whether the extra field should be visible for public or just for internal use. Possible values: `public`, `internal`
   */
  visibility: string;
}
/**
 * @public
 * Represents the environment for your business or proposition on Firmhouse
 */
export interface FirmhouseProject {
  /**
   * The available countries for this project
   */
  availableCountries: string[];
  /**
   * The available states per country for this project
   */
  availableCountryStates: unknown;
  /**
   * The currency of the project
   */
  currency: string;
  /**
   * The current stock of a project
   */
  currentStock: number | null;
  /**
   * The type of the dynamic order strategy for this project
   */
  dynamicOrderStrategy: string;
  /**
   * The threshold that will make shipment free in cents (works in combination with Firmhouse shipping methods)
   */
  freeShipmentFromCents: number | null;
  /**
   * ID to identify the project with
   */
  id: string;
  /**
   * The name of the project
   */
  name: string;
  /**
   * The payment provider of this project
   */
  paymentProvider: string | null;
  /**
   * Image of the main product of the project
   */
  productImageUrl: string | null;
  /**
   * Name of the main product of the project
   */
  productName: string | null;
  /**
   * The type of the project
   */
  projectType: string | null;
  /**
   * Whether the amount of subscriptions is limited
   */
  subscriptionLimitEnabled: boolean;
  /**
   * Token to identify the project with
   */
  token: string;
  /**
   * Whether two-step cancellation is enabled for this project
   */
  twoStepCancellationEnabled: boolean | null;
  /**
   * Whether two step signup is enabled for this project
   */
  twoStepSignupEnabled: boolean;
  /**
   * Project last updated since
   */
  updatedAt: string | null;
  /**
   * Licence
   */
  licence: {
    showFirmhouseLogo: boolean | null;
  } | null;
  /**
   * The available promotions for this project
   */
  promotions?: FirmhousePromotion[];
  /**
   * The available tax rates for this project
   */
  taxRates?: FirmhouseTaxRate[];
  /**
   * The extra fields for this project
   */
  extraFields?: FirmhouseExtraField[] | null;
}
/**
 * @public
 * A product that customers can subscribe to or that can be included in a plan.
 */
export interface FirmhouseProduct {
  /**
   * Whether the product is available for customers
   */
  available: boolean;
  /**
   * Whether this product should be included when calculating discount on invoices
   */
  eligibleForDiscount: boolean;
  /**
   * If the grace cancellation is enabled
   */
  graceCancellationEnabled: boolean | null;
  /**
   * The grace cancellation period
   */
  graceCancellationPeriod: number | null;
  /**
   * The grace cancellation unit
   */
  graceCancellationUnit: CommitmentUnit | null;
  /**
   * The database ID for this product
   */
  id: string;
  /**
   * URL to image of the product
   */
  imageUrl: string | null;
  /**
   * The amount of time in units between shipments of this order
   */
  interval: number | null;

  /**
   * The time measure for interval units
   */
  intervalUnitOfMeasure: string | null;
  /**
   * Will automatically get added on signup.
   */
  mandatory: boolean;
  /**
   * If the maximum commitment is enabled
   */
  maximumCommitmentEnabled: boolean | null;
  /**
   * The maximum commitment period
   */
  maximumCommitmentPeriod: number | null;
  /**
   * The maximum commitment unit
   */
  maximumCommitmentUnit: MaximumCommitmentUnit | null;
  /**
   * Metadata makes it possible to store additional information on objects.
   */
  metadata: unknown | null;
  /**
   * If the minimum commitment is enabled
   */
  minimumCommitmentEnabled: boolean | null;
  /**
   * The minimum commitment period
   */
  minimumCommitmentPeriod: number | null;
  /**
   * The minimum commitment unit
   */
  minimumCommitmentUnit: CommitmentUnit | null;
  /**
   * The nth product of this is free
   */
  nthProductFree: number | null;
  /**
   * The price of the product in cents
   */
  priceCents: number | null;
  /**
   * The price of the product excluding tax in cents
   */
  priceExcludingTaxCents: number | null;
  /**
   * The price of the product including tax in cents
   */
  priceIncludingTaxCents: number | null;
  /**
   * Either recurring or one_time_purchase
   */
  productType: string | null;
  /**
   * The associated Shopify product_id
   */
  shopifyProductId: string | null;
  /**
   * The associated Shopify variant_id
   */
  shopifyVariantId: string | null;
  /**
   * The product SKU
   */
  sku: string | null;
  /**
   * The product slug
   */
  slug: string;
  /**
   * The supplier of the product
   */
  supplier: string | null;
  /**
   * The amount of tax for this product in cents
   */
  taxAmountCents: number | null;
  /**
   * The tax percentage for this product
   */
  taxPercentage: number | null;
  /**
   * Name of the product
   */
  title: string;
}

/**
 * @public
 * A plan that customers can subscribe to.
 */
export interface FirmhousePlan {
  /**
   * Whether plan is available to subscribe to
   */
  available: boolean;
  /**
   * Currency used for subscriptions assigned to this plan
   */
  currency: string | null;
  /**
   * Whether a grace cancellation period is enabled
   */
  graceCancellationEnabled: boolean;
  /**
   * The amount of time in units for grace cancellation period of the plan
   */
  graceCancellationPeriod: number;
  /**
   * The time units of measure for grace cancellation period
   */
  graceCancellationUnit: CommitmentUnit;
  /**
   * The database ID for this plan
   */
  id: string;
  /**
   * URL to image of the plan
   */
  imageUrl: string | null;
  /**
   * The plan's initial amount excl. tax in cents
   */
  initialAmountExcludingTaxCents: number | null;
  /**
   * The plan's initial amount incl. tax in cents
   */
  initialAmountIncludingTaxCents: number | null;
  /**
   * The amount of interval units between instalments
   */
  instalmentIntervalPeriod: number | null;
  /**
   * The interval unit between instalments
   */
  instalmentIntervalUnit: BaseIntervalUnit | null;
  /**
   * Number of instalments.
   */
  instalments: number | null;
  /**
   * Whether a maximum commitment period is enabled.
   */
  maximumCommitmentEnabled: boolean | null;
  /**
   * The amount of time in units for maximum commitment period of the plan.
   */
  maximumCommitmentPeriod: number | null;
  /**
   * The time units of measure for maximum commitment period.
   */
  maximumCommitmentUnit: MaximumCommitmentUnit | null;
  /**
   * Metadata makes it possible to store additional information on objects.
   */
  metadata: unknown | null;
  /**
   * Whether a minimum commitment period is enabled
   */
  minimumCommitmentEnabled: boolean;
  /**
   * The amount of time in units for minimum commitment period of the plan
   */
  minimumCommitmentPeriod: number;
  /**
   * The time units of measure for minimum commitment period.
   */
  minimumCommitmentUnit: CommitmentUnit;
  /**
   * The price of the plan
   */
  monthlyAmountCents: number | null;
  /**
   * The price of the plan excluding tax in cents
   */
  monthlyAmountExcludingTaxCents: number | null;
  /**
   * The price of the plan including tax in cents
   */
  monthlyAmountIncludingTaxCents: number | null;
  /**
   * Name of the plan
   */
  name: string;
  /**
   * The plan slug
   */
  slug: string;
  /**
   * The amount of tax for this plan in cents
   */
  taxAmountCents: number | null;
  /**
   * The tax percentage for this plan
   */
  taxPercentage: number | null;
  /**
   * The products that are included in this plan
   */
  planProducts: {
    /**
     * The quantity of the product within the plan
     */
    quantity: number;
    /**
     * The associated product record for this plan's product
     */
    product: FirmhouseProduct;
  }[];
}
/**
 * @public
 *
 */
export interface FirmhouseInvoiceLineItem {
  /**
   * Unit price excluding tax
   */
  amountExcludingTaxCents: number;
  /**
   * Unit price including tax
   */
  amountIncludingTaxCents: number;
  /**
   * Billing period end date for the invoice
   */
  billingPeriodEndsAt: string | null;
  /**
   * Billing period start date for the invoice
   */
  billingPeriodStartsAt: string | null;
  /**
   * The description of this invoice line item.
   */
  description: string | null;
  /**
   * Effective unit price excluding tax, corrected based on invoice discount.
   */
  effectiveAmountExcludingTaxCents: number;
  /**
   * Effective unit price including tax, corrected based on invoice discount.
   */
  effectiveAmountIncludingTaxCents: number;
  /**
   * The database ID of this invoice line item.
   */
  id: string;
  /**
   * Indicates what this line item is charging for
   */
  lineItemType: LineItemTypeEnum;
  /**
   * Metadata makes it possible to store additional information on objects.
   */
  metadata: unknown | null;
  /**
   * Quantity for this line item
   */
  quantity: number;
  /**
   * The percentage of tax used for this invoice.
   */
  taxPercentage: number;
  /**
   * Total amount for this line item excluding tax (unit price * quantity)
   */
  totalAmountExcludingTaxCents: number;
  /**
   * Total amount for this line item including tax (unit price * quantity)
   */
  totalAmountIncludingTaxCents: number;
  /**
   * Total amount of tax charged
   */
  totalTaxAmountCents: number;
  /**
   * The associated product in case of a product charge
   */
  product: FirmhouseProduct;
}
/**
 * @public
 */
export interface FirmhouseCollectionCase {
  /**
   * The collection case number
   */
  caseNumber: string;
  /**
   * The date and time when the collection case record was first created.
   */
  createdAt: string | null;
  /**
   * ID to identify the collection case with
   */
  id: string;
  /**
   * The status of the collection case
   */
  status: CollectionCaseStatus;
  /**
   * The date and time when the collection case record was last updated.
   */
  updatedAt: string | null;
}

/**
 * @public
 */
export interface FirmhouseInvoiceReminder {
  /**
   * The database ID of this invoice reminder.
   */
  id: string;
  /**
   * The date on which the reminder will be sent out.
   */
  remindOn: string;
  /**
   * The date and time on which this reminder was sent.
   */
  remindedAt: string | null;
  /**
   * The how manyth invoice reminder this is.
   */
  reminderNumber: number;
}
/**
 * @public
 */
export interface FirmhouseOriginalInvoice {
  /**
   * The customer's city or town stored on the invoice.
   */
  city: string | null;
  /**
   * The customer's company name stored on the invoice.
   */
  companyName: string | null;
  /**
   * The billing country code (ISO 3116) stored on the invoice.
   */
  country: string | null;
  /**
   * When the invoice record was first created.
   */
  createdAt: string;
  /**
   * Currency used for this invoice
   */
  currency: string | null;
  /**
   * The description of the invoice.
   */
  description: string | null;
  /**
   * URL to view invoice details, PDF download, and manual payment link.
   */
  detailsUrl: string;
  /**
   * An external invoice URL that replaces the default invoice
   */
  externalUrl: string | null;
  /**
   * The customer's full address by combining address and house number stored on the invoice.
   */
  fullAddress: string | null;
  /**
   * The customer's full name stored on the invoice.
   */
  fullName: string | null;
  /**
   * The database ID of this invoice.
   */
  id: string;
  /**
   * The formatted (legal) invoice number.
   */
  invoiceNumber: string;
  /**
   * The payment status of the invoice.
   */
  invoiceStatus: InvoiceStatusEnum;
  /**
   * When the invoice was formally invoiced.
   */
  invoicedAt: string | null;
  /**
   * The customer's full international phone number stored on the invoice.
   */
  phoneNumber: string | null;
  /**
   * The customer's salutation (mr,ms,mx) stored on the invoice.
   */
  salutation: string | null;
  /**
   * The customer's state stored on the invoice.
   */
  state: string | null;
  /**
   * ID of the associated subscription.
   */
  subscriptionId: string;
  /**
   * The percentage of tax used for this invoice.
   */
  taxPercentage: number | null;
  /**
   * Total amount of invoice in cents.
   */
  totalAmountCents: number;
  /**
   * Total tax amount of invoice in cents.
   */
  totalTaxAmountCents: number;
  /**
   * The customer's postal code or zipcode stored on the invoice.
   */
  zipcode: string | null;
}
/**
 * @public
 */
export interface FirmhouseRefund {
  /**
   * Refund amount in cents.
   */
  amountCents: number;
  /**
   * The database ID of the refund.
   */
  id: string;
  /**
   * The payment provider ID for this refund
   */
  paymentProviderObjectId: string | null;
  /**
   * Reason why the refund was issued.
   */
  reason: string | null;
  /**
   * The creation time of the refund.
   */
  refundedAt: string | null;
  /**
   * Status of the refund.
   */
  status: RefundStatus;
}
/**
 * @public
 */
export interface FirmhousePayment {
  /**
   * Payment amount in cents.
   */
  amountCents: number;
  /**
   * Payment amount with currency symbol.
   */
  amountWithSymbol: string;
  /**
   * When the payment record was first created.
   */
  createdAt: string;
  /**
   * The database ID of the payment.
   */
  id: string;
  /**
   * The external payment reference from the payment service provider.
   */
  paymentId: string | null;
  /**
   * Status of the payment.
   */
  paymentStatus: PaymentStatusEnum;
  /**
   * The type of transaction that this payment represents
   */
  paymentType: PaymentTypeEnum;
  /**
   * Send your customer to this URL to allow them to retry the failed payment. Append ?return_url=https://your-url to send the customer back after a successful payment.
   */
  retryPaymentUrl: string | null;
  /**
   * Token to identify the payment with
   */
  token: string;
  /**
   * When the payment record was last updated.
   */
  updatedAt: string;
  /**
   * The refunds for this payment.
   */
  refunds: FirmhouseRefund[];
}
/**
 * @public
 */
export interface FirmhouseInvoice {
  /**
   * The customer's city or town stored on the invoice.
   */
  city: string | null;

  /**
   * The customer's company name stored on the invoice.
   */
  companyName: string | null;
  /**
   * The billing country code (ISO 3116) stored on the invoice.
   */
  country: string | null;
  /**
   * When the invoice record was first created.
   */
  createdAt: string;
  /**
   * Currency used for this invoice
   */
  currency: string | null;
  /**
   * The description of the invoice.
   */
  description: string | null;
  /**
   * URL to view invoice details, PDF download, and manual payment link.
   */
  detailsUrl: string;
  /**
   * An external invoice URL that replaces the default invoice
   */
  externalUrl: string | null;
  /**
   * The customer's full address by combining address and house number stored on the invoice.
   */
  fullAddress: string | null;
  /**
   * The customer's full name stored on the invoice.
   */
  fullName: string | null;
  /**
   * The database ID of this invoice.
   */
  id: string;
  /**
   * The formatted (legal) invoice number.
   */
  invoiceNumber: string;
  /**
   * The payment status of the invoice.
   */
  invoiceStatus: InvoiceStatusEnum;
  /**
   * When the invoice was formally invoiced.
   */
  invoicedAt: string | null;
  /**
   * The customer's full international phone number stored on the invoice.
   */
  phoneNumber: string | null;
  /**
   * The customer's salutation (mr,ms,mx) stored on the invoice.
   */
  salutation: string | null;
  /**
   * The customer's state stored on the invoice.
   */
  state: string | null;
  /**
   * ID of the associated subscription.
   */
  subscriptionId: string;
  /**
   * The percentage of tax used for this invoice.
   */
  taxPercentage: number | null;
  /**
   * Total amount of invoice in cents.
   */
  totalAmountCents: number;
  /**
   * Total tax amount of invoice in cents.
   */
  totalTaxAmountCents: number;
  /**
   * The customer's postal code or zipcode stored on the invoice.
   */
  zipcode: string | null;
  /**
   * The collection case this invoice is part of.
   */
  collectionCase?: FirmhouseCollectionCase | null;
  /**
   * The line items of this invoice.
   */
  invoiceLineItems?: FirmhouseInvoiceLineItem[] | null;
  /**
   * The reminders for this invoice.
   */
  invoiceReminders?: FirmhouseInvoiceReminder[] | null;
  /**
   * The associated original invoice for this invoice (only available for credit invoices)
   */
  originalInvoice?: FirmhouseOriginalInvoice | null;
  /**
   * The associated payment for this invoice. Can be null if this order didn't require payment.
   */
  payment?: FirmhousePayment | null;
}

/**
 * @public
 */
export interface FirmhouseSubscribedPlan {
  /**
   * The time of subscription activation for the subscribed plan
   */
  activatedAt: string | null;
  /**
   * Whether this subscribed plan is allowed to be cancelled
   */
  allowedToCancel: boolean;
  /**
   * The interval at which the billing cycle runs according to the unit set in billingCycleIntervalUnit.
   */
  billingCycleInterval: number | null;
  /**
   * The unit of the interval the billing cycle runs
   */
  billingCycleIntervalUnit: BillingCycleIntervalUnit | null;
  /**
   * The custom initial amount for this subscription
   */
  customInitialAmountCents: number | null;
  /**
   * The custom recurring amount for this subscription
   */
  customRecurringAmountCents: number | null;
  /**
   * The date and time when grace cancellation period ends
   */
  graceCancellationEndsAt: string | null;
  /**
   * The amount of time in units for grace cancellation period of the subscribed plan
   */
  graceCancellationPeriod: number | null;
  /**
   * The time units of measure for grace cancellation period
   */
  graceCancellationUnit: CommitmentUnit | null;
  /**
   * The database ID for the subscribed plan
   */
  id: string;
  /**
   * Whether this subscribed plan is in grace cancellation period
   */
  inGraceCancellation: boolean;
  /**
   * Whether this subscribed plan is in minimum commitment period
   */
  inMinimumCommitment: boolean;

  /**
   * The time when the maximum commitment will ends and billing for this plan will stop.
   */
  maximumCommitmentEndsAt: string | null;
  /**
   * The maximum commitment period.
   */
  maximumCommitmentPeriod: number | null;

  /**
   * The maximum commitment unit.
   */
  maximumCommitmentUnit: MaximumCommitmentUnit | null;
  /**
   * The time when minimum commitment period ends
   */
  minimumCommitmentEndsAt: string | null;
  /**
   * The amount of time in units for minimum commitment period of the subscribed plan
   */
  minimumCommitmentPeriod: number | null;
  /**
   * The time units of measure for minimum commitment period
   */
  minimumCommitmentUnit: CommitmentUnit | null;
  /**
   * Name of the subscribed plan
   */
  name: string;
  /**
   * The moment the next charge will be created (Only for flexbile billing cycle projects)
   */
  nextBillingDate: string | null;
  /**
   * Whether or not the associated plan is relevant to display in cart price breakdown.
   */
  showInPriceBreakDown: boolean;
  /**
   * The interval defining trial period length according to the unit set in trialPeriodIntervalUnit.
   */
  trialPeriodPeriod: number | null;
  /**
   * The unit of the interval defining the trial period length set in trialPeriodInterval
   */
  trialPeriodUnit: CommitmentUnit | null;
  /**
   * The number of unconsumed contract term events
   */
  unconsumedContractTermEventCount: number | null;
}

/**
 * @public
 */
export interface FirmhouseOrderedProductUtils {
  /**
   * Utility to check if the ordered product follows the plan schedule
   * @returns Whether the ordered product shipment and billing schedule follows the plan schedule
   */
  followsPlanSchedule: () => boolean;
  /**
   * Utility to check if the ordered product is delivered only once
   * @returns Whether the ordered product is delivered only once
   */
  shipsOnlyOnce: () => boolean;
}

/**
 * @public
 */
export interface FirmhouseOrderedProduct {
  /**
   * The time when the ordered product was created
   */
  createdAt: string | null;
  /**
   * The time when the grace cancellation period ends
   */
  graceCancellationEndsAt: string | null;

  /**
   * ID to identify the ordered product with
   */
  id: string;
  /**
   * The amount of time in units between shipments of this order
   */
  interval: number | null;
  /**
   * The time measure for interval units
   */
  intervalUnitOfMeasure: string | null;
  /**
   * The time when the maximum commitment period ends
   */
  intervalUnitOfMeasureType: OrderedProductIntervalUnitOfMeasure | null;
  /**
   * Metadata makes it possible to store additional information on objects.
   */
  maximumCommitmentEndsAt: string | null;
  /**
   * The time when the minimum commitment period ends
   */
  metadata: unknown | null;
  /**
   * Type of ordered products
   */
  minimumCommitmentEndsAt: string | null;
  /**
   * The price of the product for this subscription excluding tax in cents
   */
  priceExcludingTaxCents: number | null;
  /**
   * The price of the product for this subscription including tax in cents
   */
  priceIncludingTaxCents: number | null;
  /**
   * The associated product record for this order line
   */
  productId: string;
  /**
   * The amount ordered for this product
   */
  quantity: number | null;
  /**
   * Whether this product will get shipped or charged recurringly.
   */
  recurring: boolean;
  /**
   * The next date on which a new order should get initiated
   */
  shipmentDate: string | null;
  /**
   *
   */
  status: OrderedProductStatus;
  /**
   * Name of the product
   */
  title: string | null;
  /**
   * The total amount based on the unit price * quantity excluding tax, in cents
   */
  totalAmountExcludingTaxCents: number | null;
  /**
   * The total amount based on the unit price * quantity including tax, in cents
   */
  totalAmountIncludingTaxCents: number | null;
  /**
   * The total amount that the customer has ordered of this product upto now
   */
  totalOrdered: number | null;
  /**
   * The time when the ordered product was updated
   */
  updatedAt: string | null;
  /**
   * If added as part of a plan, this will be the reference.
   */
  plan: {
    id: string;
  } | null;
  /**
   * The associated product record for this order line
   */
  product: FirmhouseProduct;
}

/**
 * @public
 */
export interface FirmhouseOrderedProductWithUtils
  extends FirmhouseOrderedProduct,
    FirmhouseOrderedProductUtils {}

/**
 * @public
 */
export interface FirmhouseSubscriptionUtils {
  /**
   * Utilty to check the closest upcoming order date
   * @returns The next date on which a new order will get initiated
   */
  getClosestUpcomingOrderDate: () => string | null;
  /**
   * Utility to check the closest upcoming order ordered products
   * @returns Ordered products that will be part of the next order
   */
  getClosestUpcomingOrderOrderedProducts: () => FirmhouseOrderedProduct[];
}

/**
 * @public
 * Cart
 */
export interface FirmhouseCart {
  /**
   * The customer's full address line or just street. Can include houseNumber if not separately stored in houseNumber field.
   */
  address: string | null;
  /**
   * The amount that is due on checkout (in cents).
   */
  amountForStartingSubscriptionCents: number | null;
  /**
   * The customer's billing address address line or street.
   */
  billToAddress: string | null;
  /**
   * The customer's billing address city or town.
   */
  billToCity: string | null;
  /**
   * The company name of the customer's billing address.
   */
  billToCompanyName: string | null;
  /**
   * The customer's billing address country code (ISO3661).
   */
  billToCountry: string | null;
  /**
   * The customer's billing address district.
   */
  billToDistrict: string | null;
  /**
   * The customer's billing address full address by combining address and house number.
   */
  billToFullAddress: string | null;
  /**
   * The customer's billing address full name.
   */
  billToFullName: string | null;
  /**
   * The customer's billing address house, building, or appartment number.
   */
  billToHouseNumber: string | null;
  /**
   * The customer's billing address last name.
   */
  billToLastName: string | null;
  /**
   * The customer' billing address first name.
   */
  billToName: string | null;
  /**
   * The customer's billing address phone number (international format).
   */
  billToPhoneNumber: string | null;
  /**
   * The customer's billing address salutation (mr,ms,mx).
   */
  billToSalutation: string | null;
  /**
   * The customer's billing address state or province (ISO3661-2).
   */
  billToState: string | null;
  /**
   * The customer's billing address zip code or postal code.
   */
  billToZipcode: string | null;
  /**
   * The day of the month when the customer is charged.
   */
  chargeDayOfTheMonth: number | null;
  /**
   * URL for the customers to complete their draft subscription.
   */
  checkoutUrl: string | null;
  /**
   * The customer's city or town.
   */
  city: string | null;
  /**
   * The customer's company name.
   */
  companyName: string | null;
  /**
   * The customer's country code (ISO 3116)
   */
  country: string | null;
  /**
   *  The date and time when the subscription record was first created.
   */
  createdAt: string | null;
  /**
   * The currency used for this subscription
   */
  currency: string | null;
  /**
   * The customer ID given by the selected payment provider
   */
  customerId: string | null;
  /**
   * The field that can be used for your internal reference. For example, internal customer id.
   */
  customerReference: string | null;
  /**
   * The customer's date of birth
   */
  dateOfBirth: string | null;
  /**
   * Whether billing and shipping addresses are the same. Set this flag to `true` to store a separate billing address.
   */
  differentBillingAddress: boolean | null;
  /**
   * The customer's district
   */
  district: string | null;
  /**
   * The customer's email address
   */
  email: string | null;
  /**
   * The customer's full address by combining address and house number.
   */
  fullAddress: string | null;
  /**
   * The customer's full name.
   */
  fullName: string | null;
  /**
   * The customer's house number.
   */
  houseNumber: string | null;
  /**
   * The id of the subscription.
   */
  id: string | null;
  /**
   * Identity verification URL that automatically uses the configured provider.Append ?return_url=https://your-url to send the customer back after a successful identification.
   */
  identityVerificationUrl: string | null;
  /**
   * The customer's last name.
   */
  lastName: string | null;
  /**
   * The customer's locale/language.
   */
  locale: string | null;
  /**
   * Whether the customer accepted the optional marketing opt-in.
   */
  marketingOptIn: boolean | null;
  /**
   * Metadata makes it possible to store additional information on objects.
   */
  metadata: unknown | null;
  /**
   * The monthly amount that is charged.
   */
  monthlyAmountCents: number | null;
  /**
   * The customer's first name.
   */
  name: string | null;
  /**
   * The customer's full international phone number
   */
  phoneNumber: string | null;
  /**
   * The customer's salutation (mr,ms,mx).
   */
  salutation: string | null;
  /**
   * The date and time when this subscription was (or will be) charged for the first time.
   */
  startDate: string;
  /**
   * The customer's state
   */
  state: string | null;
  /**
   * Status of this customer.
   */
  status: SubscriptionStatus;
  /**
   * Whether the customer accepted the terms and conditions.
   */
  termsAccepted: boolean;

  /**
   * Whether the customer has accepted the terms&conditions.
   */
  termsAcceptedOn: string | null;

  /**
   * Unique token of the subscription
   */
  token: string;
  /**
   * The number of months before customer is charged for the first time.
   */
  trialPeriodMonths: number | null;
  /**
   * The date and time when the subscription was last updated.
   */
  updatedAt: string | null;
  /**
   * The company's VAT number.
   */
  vatNumber: string | null;
  /**
   * The customer's postal code or zipcode.
   */
  zipcode: string | null;
  /**
   * Returns the plan the subscription is currently subscribed to.
   */
  activePlan: FirmhousePlan | null;
  /**
   * Returns the plan relationship and contract terms of the current plan
   */
  subscribedPlan: FirmhouseSubscribedPlan | null;
  /**
   * The ordered products that are part of the order
   */
  orderedProducts: FirmhouseOrderedProduct[] | null;
  /**
   * List of extra fields and values.
   */
  extraFields: FirmhouseExtraFieldAnswer[];
}

/**
 * @public
 * A line on an order representing how many of a product are delivered and for what price.
 */
export interface FirmhouseOrderLine {
  /**
   * Metadata makes it possible to store additional information on objects.
   */
  metadata: unknown | null;

  /**
   * The product SKU at the moment of order creation.
   */
  productSku: string | null;

  /**
   * The product title at the moment of order creation.
   */
  productTitle: string | null;

  /**
   * The type of product at the moment of order creation.
   */
  productType: FirmhouseOrderedProduct | null;

  /**
   * The quantity of products for this order line.
   */
  quantity: number;

  /**
   * The tax percentage for this order line.
   */
  taxPercentage: number | null;

  /**
   * The total amount for this order line excluding tax in cents (not including discounts).
   */
  totalAmountExcludingTaxCents: number | null;

  /**
   * The total amount for this order line including tax in cents (not including discounts).
   */
  totalAmountIncludingTaxCents: number | null;

  /**
   * The product for this order line.
   */
  product: FirmhouseProduct;
}

/**
 * @public
 */
export interface FirmhouseOrder {
  /**
   * The url to accept and pay for this order
   */
  acceptUrl: string | null;
  /**
   * The amount in cents
   */
  amountCents: number;
  /**
   * The url to cancel this order
   */
  cancelUrl: string | null;

  /**
   * Order creation date
   */
  createdAt: string | null;
  /**
   * The amount of discount for this order in cents including tax
   */
  discountCents: number | null;

  /**
   * The amount of discount for this order in cents excluding tax
   */
  discountExclTaxCents: number | null;
  /**
   * Time at which the order was marked as fulfilled.
   */
  fulfilledAt: string | null;
  /**
   * ID to identify the order with
   */
  id: string | null;
  /**
   * Whether the order and its invoice is paid. Will always be true if the order total amount is zero and no invoice is attached.
   */
  paid: boolean;
  /**
   * The date on which the order is initiated
   */
  shipmentDate: string | null;
  /**
   * The amount of shipping cost for this order in cents including tax
   */
  shippingCostsCents: number | null;
  /**
   * The amount of shipping cost for this order in cents excluding tax
   */
  shippingCostsExclTaxCents: number | null;
  /**
   * The associated Shopify draft order ID
   */
  shopifyDraftId: string | null;
  /**
   * The associated Shopify order ID.
   */
  shopifyId: string | null;
  /**
   * The url to snooze this order
   */
  snoozeUrl: string | null;
  /**
   * Order status
   */
  status: OrderStatus;
  /**
   * The total amount of tax for this order in cents
   */
  totalTaxCents: number;
  /**
   * The tracking code for this order. Made available in email templates.
   */
  trackingCode: string | null;
  /**
   * The date and time when the order was last updated.
   */
  updatedAt: string | null;
  /**
   * The lines on the order.
   */
  orderLines?: FirmhouseOrderLine[] | null;
  /**
   * The invoice for this order. Can be null if this order is a shipment-only order without directly being related to a payment or invoice.
   */
  invoice?: FirmhouseInvoice | null;
  /**
   * The associated payment for this order. Can be null if this order is a shipment-only order.
   */
  payment?: FirmhousePayment | null;
}

/**
 * @public
 */
export interface FirmouseCollectionCase {
  /**
   * The collection case number
   */
  caseNumber: string;
  /**
   * The date and time when the collection case record was first created.
   */
  createdAt: string | null;
  /**
   * ID to identify the collection case with
   */
  id: string;
  /**
   * The status of the collection case
   */
  status: CollectionCaseStatus;
  /**
   * The date and time when the collection case record was last updated.
   */
  updatedAt: string | null;
}

/**
 * @public
 */
export interface FirmhouseVerifiedIdentity {
  /**
   * Date and time on which the verification was initiated
   */
  createdAt: string;
  /**
   * The payload that was given back from the identity service after identification. Usually a hash with key/value pairs of attributes of the identity or person.
   */
  payload: unknown;
  /**
   * Which service provider was used to verify the identity
   */
  serviceProvider: string;
  /**
   * Current verification status of the subscription identity
   */
  status: string;
  /**
   * The chosen verification method. (i.e. iDIN, itsme, etc.)
   */
  verificationMethod: string | null;
}
/**
 * @public
 */
export interface FirmhouseSubscription extends FirmhouseCart {
  /**
   * The date and time when the subscription was activated and billing started.
   */
  activatedAt: string | null;
  /**
   * The date and time when cancellation was initiated for the subscription (in case of two-step cancellation).
   */
  cancellationStartedAt: string | null;
  /**
   * The date and time when the subscription was cancelled.
   */
  cancelledAt: string | null;
  /**
   * Whether this subscription is currently in its trial period.
   */
  inTrialPeriod: boolean;
  /**
   * The date and time when the subscription was last marked as non-paying.
   */
  markedAsNonPayingAt: string | null;
  /**
   * Notes about the customer that can be set in the portal
   */
  notes: string | null;
  /**
   * The amount that is succesfully paid so far.
   */
  paidAmount: number | null;
  /**
   * The time the subscription was paused.
   */
  pausedAt: string | null;
  /**
   * The time the subscription will be automatically resumed.
   */
  pausedUntil: string | null;
  /**
   * The payment method currently in use for billing
   */
  paymentMethod: string | null;
  /**
   * The last 4 digits of the current payment method.
   */
  paymentMethodSummary: string | null;
  /**
   * Localised string of the payment method currently in use for billing.
   */
  paymentMethodTranslated: string | null;
  /**
   * The payment method details returned by PSP currently used for billing.
   */
  pspPaymentMethodDetails: unknown | null;
  /**
   * The date and time when the subscription completed their signup and made their initial payment (or no payment if free).
   */
  signupCompletedAt: string | null;
  /**
   * If true then the subscription won't be activated after signup and initial payment.
   */
  skipAutoActivationOnSignup: boolean;
  /**
   * The date and time when the subscription was automatically stopped.
   */
  stoppedAt: string | null;
  /**
   * Send your customer to this URL to allow them to update their active payment method.
   */
  updatePaymentMethodUrl: string | null;
  /**
   * List of collection cases for this customer
   */
  collectionCases?: FirmhouseCollectionCase[];
  /**
   * Details of the verified identity if present.
   */
  verifiedIdentity?: FirmhouseVerifiedIdentity | null;
  /**
   * List of orders of this subscription
   */
  ordersV2?: PaginatedResponse<FirmhouseOrder>;
  /**
   * List of invoices of this customer.
   */
  invoices?: FirmhouseInvoice[] | null;
}
/**
 * @public
 */
export interface FirmhouseSubscriptionWithUtils
  extends FirmhouseSubscription,
    FirmhouseSubscriptionUtils {
  orderedProducts: FirmhouseOrderedProductWithUtils[] | null;
}
