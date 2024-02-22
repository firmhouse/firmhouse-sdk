import {
  CancelSubcscriptionDocument,
  CreateOrderedProductDocument,
  DestroyOrderedProductDocument,
  GetSubscriptionBySelfServiceCenterLoginTokenDocument,
  GetSubscriptionBySelfServiceCenterLoginTokenQuery,
  GetSubscriptionDocument,
  PauseSubscriptionDocument,
  ResumeSubscriptionDocument,
  UpdateOrderedProductDocument,
  UpdatePlanDocument,
  UpdateSubscriptionDocument,
} from './subscriptions.generated';
import {
  NotFoundError,
  ServerError,
  ValidationError,
} from '../../helpers/errors';
import {
  _formatOrderedProduct,
  _formatSubscription,
} from '../../helpers/subscription';
import {
  CreateOrderedProductInput,
  ExtraFieldInput,
  InputMaybe,
  Scalars,
  SubscriptionStatus,
  UpdateOrderedProductInput,
} from '../../graphql/generated';
import { BaseResource } from '../BaseResource';
import { FirmhouseSubscription } from '../../firmhouse';

export interface CancelSubscriptionInput {
  /** Why did this customer decide to cancel? */
  cancellationNotes?: InputMaybe<Scalars['String']['input']>;
  /** Skip sending the standard cancellation confirmation email to the customer. */
  skipCancellationConfirmationEmail?: InputMaybe<Scalars['Boolean']['input']>;
  /** If a customer cannot be cancelled due to active commitments, this process can be skipped. */
  skipContractTermsEnforcement?: InputMaybe<Scalars['Boolean']['input']>;
  /** If two-step cancellation is enabled it can be skipped */
  skipTwoStepCancellation?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface ResumeSubscriptionInput {
  /** Time to resume the subscription from. If not given the subscription will be immediately resumed. */
  resumeFrom?: InputMaybe<Scalars['ISO8601DateTime']['input']>;
}

export interface PauseSubscriptionInput {
  /** Time from which the subscription automaticaly resumes again. */
  pauseUntil?: InputMaybe<Scalars['ISO8601DateTime']['input']>;
}

export interface UpdateSubscriptionInput {
  /** The time the subscription was activated. */
  activatedAt?: InputMaybe<Scalars['ISO8601DateTime']['input']>;
  /** The customer's address line or street. */
  address?: InputMaybe<Scalars['String']['input']>;
  /** The Adyen shopper reference being used for charges. */
  adyenShopperReference?: InputMaybe<Scalars['String']['input']>;
  /** The customer's billing address address line or street. */
  billToAddress?: InputMaybe<Scalars['String']['input']>;
  /** The customer's billing address city or town. */
  billToCity?: InputMaybe<Scalars['String']['input']>;
  /** The company name of the customer's billing address. */
  billToCompanyName?: InputMaybe<Scalars['String']['input']>;
  /** The customer's billing address country code (ISO3661). */
  billToCountry?: InputMaybe<Scalars['String']['input']>;
  /** The customer's billing address district. */
  billToDistrict?: InputMaybe<Scalars['String']['input']>;
  /** The customer's billing address house, building, or appartment number. */
  billToHouseNumber?: InputMaybe<Scalars['String']['input']>;
  /** The customer's billing address last name. */
  billToLastName?: InputMaybe<Scalars['String']['input']>;
  /** The customer's billing address first name. */
  billToName?: InputMaybe<Scalars['String']['input']>;
  /** The customer's billing address phone number (international format). */
  billToPhoneNumber?: InputMaybe<Scalars['String']['input']>;
  /** The customer's billing address salutation (mr,ms,mx). */
  billToSalutation?: InputMaybe<Scalars['String']['input']>;
  /** The customer's billing address state or province (ISO3661-2). */
  billToState?: InputMaybe<Scalars['String']['input']>;
  /** The customer's billing address zip code or postal code. */
  billToZipcode?: InputMaybe<Scalars['String']['input']>;
  /** The time the subscription started the cancellation process (with two-step cancellation) */
  cancellationStartedAt?: InputMaybe<Scalars['ISO8601DateTime']['input']>;
  /** The time the subscription was (fully) cancelled. */
  cancelledAt?: InputMaybe<Scalars['ISO8601DateTime']['input']>;
  /** The day of the month when the customer is charged. */
  chargeDayOfTheMonth?: InputMaybe<Scalars['Int']['input']>;
  /** The customer's city or town. */
  city?: InputMaybe<Scalars['String']['input']>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The company name of the customer. */
  companyName?: InputMaybe<Scalars['String']['input']>;
  /** The customer's country code (ISO3661). */
  country?: InputMaybe<Scalars['String']['input']>;
  /** The field that can be used for your internal reference. For example, internal customer id. */
  customerReference?: InputMaybe<Scalars['String']['input']>;
  /** The customer's date of birth (yyyy-mm-dd). */
  dateOfBirth?: InputMaybe<Scalars['ISO8601Date']['input']>;
  /** Whether billing and shipping addresses are the same. Set this flag to `true` to store a separate billing address. */
  differentBillingAddress?: InputMaybe<Scalars['Boolean']['input']>;
  /** The customer's district. */
  district?: InputMaybe<Scalars['String']['input']>;
  /** The customer's email address. */
  email?: InputMaybe<Scalars['String']['input']>;
  /** Extra field values for the subscription. */
  extraFields?: InputMaybe<Array<ExtraFieldInput>>;
  /** The customer's house, building, or appartment number. */
  houseNumber?: InputMaybe<Scalars['String']['input']>;
  /** Unique ID for an imported subscription. */
  importedSubscriptionId?: InputMaybe<Scalars['String']['input']>;
  /** The customer's last name. */
  lastName?: InputMaybe<Scalars['String']['input']>;
  /** The customer's language/locale. Must be enabled on the project. */
  locale?: InputMaybe<Scalars['String']['input']>;
  /** Time time the subscription was marked as non-paying. */
  markedAsNonPayingAt?: InputMaybe<Scalars['ISO8601DateTime']['input']>;
  /** Whether the customer accepted optional marketing communication opt-in. */
  marketingOptIn?: InputMaybe<Scalars['Boolean']['input']>;
  /** Metadata that can be used by developers to store additional information on objects. */
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  /** The Mollie Customer ID (cst_XXX) */
  mollieCustomerId?: InputMaybe<Scalars['String']['input']>;
  /** The customer's first name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Notes specific for this subscription */
  notes?: InputMaybe<Scalars['String']['input']>;
  /** The customer's phone number (international format). */
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  /** Additional payment service provider specific properties used for payment creation. */
  pspPaymentProperties?: InputMaybe<Scalars['JSON']['input']>;
  /** The customer's salutation (mr,ms,mx). */
  salutation?: InputMaybe<Scalars['String']['input']>;
  /** The time when the signup was completed. */
  signupCompletedAt?: InputMaybe<Scalars['ISO8601DateTime']['input']>;
  /** Don't automatically activate the subscription on signup. */
  skipAutoActivationOnSignup?: InputMaybe<Scalars['Boolean']['input']>;
  /** The customer's state or province (ISO3661-2). */
  state?: InputMaybe<Scalars['String']['input']>;
  /** The current status of the subscription. (default: inactive) */
  status?: InputMaybe<SubscriptionStatus>;
  /** The Stripe Customer ID (cus_XXX) */
  stripeCustomerId?: InputMaybe<Scalars['String']['input']>;
  /** The Stripe Payment Method ID of the active payment method to charge. (pm_XXX) */
  stripePaymentMethodId?: InputMaybe<Scalars['String']['input']>;
  /** Whether the customer accepted the terms and conditions. */
  termsAccepted?: InputMaybe<Scalars['Boolean']['input']>;
  /** The token of the subscription to update, or creates a new one if one doesn't exist. */
  token?: InputMaybe<Scalars['ID']['input']>;
  /** The number of months before the customer is charged for the first time. */
  trialPeriodMonths?: InputMaybe<Scalars['Int']['input']>;
  /** The company VAT number. */
  vatNumber?: InputMaybe<Scalars['String']['input']>;
  /** The customer's zip code or postal code. */
  zipcode?: InputMaybe<Scalars['String']['input']>;
}

/**
 * @public
 * Subscription methods
 */
export class SubscriptionsResource extends BaseResource {
  /**
   * Get a subscription by subscription token including relations
   * @param token - Subscription token
   * @param includeRelations - Relations to include
   * @returns Subscription
   */
  public async get(
    token: string,
    includeRelations?: {
      collectionCases?: boolean;
      verifiedIdentity?: boolean;
      orders?: {
        after?: string;
        before?: string;
        first?: number;
        last?: number;
        includeRelations?: {
          orderLines?: boolean;
          payment?: boolean;
          invoice?: boolean;
        };
      };
      invoices?: {
        includeRelations?: {
          collectionCase?: boolean;
          invoiceReminders?: boolean;
          invoiceLineItems?: boolean;
          payment?: boolean;
          originalInvoice?: boolean;
        };
      };
    }
  ) {
    const response = await this._client.request(
      GetSubscriptionDocument,
      {
        token,
        includeCollectionCases: includeRelations?.collectionCases ?? false,
        includeVerifiedIdentity: includeRelations?.verifiedIdentity ?? false,
        includeOrders: !!includeRelations?.orders,
        ordersIncludeOrderLines:
          includeRelations?.orders?.includeRelations?.orderLines ?? false,
        ordersIncludePayment:
          includeRelations?.orders?.includeRelations?.payment ?? false,
        ordersIncludeInvoice:
          includeRelations?.orders?.includeRelations?.invoice ?? false,
        ordersAfter: includeRelations?.orders?.after,
        ordersBefore: includeRelations?.orders?.before,
        ordersFirst: includeRelations?.orders?.first,
        ordersLast: includeRelations?.orders?.last,
        includeInvoices: !!includeRelations?.invoices,
        invoicesIncludeCollectionCase:
          includeRelations?.invoices?.includeRelations?.collectionCase ?? false,
        invoicesIncludeInvoiceReminders:
          includeRelations?.invoices?.includeRelations?.invoiceReminders ??
          false,
        invoicesIncludeInvoiceLineItems:
          includeRelations?.invoices?.includeRelations?.invoiceLineItems ??
          false,
        invoicesIncludePayment:
          includeRelations?.invoices?.includeRelations?.payment ?? false,
        invoicesIncludeOriginalInvoice:
          includeRelations?.invoices?.includeRelations?.originalInvoice ??
          false,
      },
      this.getSubscriptionTokenHeader(token)
    );
    if (response.getSubscription === null) {
      throw new NotFoundError('Subscription not found');
    }
    return _formatSubscription(response.getSubscription);
  }

  /**
   * Update a product in the cart
   * @param input - Payload for fields to update
   * @param subscriptionToken - Subscription token
   * @returns Updated subscription
   */
  public async updateOrderedProduct(
    subscriptionToken: string,
    input: UpdateOrderedProductInput
  ) {
    const response = await this._client.request(
      UpdateOrderedProductDocument,
      { input },
      this.getSubscriptionTokenHeader(subscriptionToken)
    );
    const updateOrderedProduct = response.updateOrderedProduct ?? null;
    if (updateOrderedProduct === null) {
      throw new ServerError('Could not update ordered product');
    }
    const orderedProduct = updateOrderedProduct.orderedProduct ?? null;
    if (orderedProduct === null) {
      throw new ServerError('Could not update ordered product');
    }
    const { subscription, ...fields } = orderedProduct;
    if (subscription === null) {
      throw new ServerError('Could not update ordered product');
    }
    return {
      orderedProduct: _formatOrderedProduct(fields, subscription),
      subscription: _formatSubscription(subscription),
    };
  }

  /**
   * Get a subscription by self service center login token
   * @param token - Self service center login token
   * @returns Subscription
   */
  public async getBySelfServiceCenterLoginToken(token: string) {
    const response = await this._client.request(
      GetSubscriptionBySelfServiceCenterLoginTokenDocument,
      { token },
      this.getSubscriptionTokenHeader(token)
    );
    if (response.getSubscriptionBySelfServiceCenterLoginToken === null) {
      throw new NotFoundError('Subscription not found');
    }
    return _formatSubscription(
      response.getSubscriptionBySelfServiceCenterLoginToken
    );
  }

  /**
   * Cancel a subscription
   * @param subscriptionId - ID of the subscription to cancel
   * @param input - Payload for cancellation
   * @returns Cancelled subscription
   */
  public async cancel(subscriptionId: string, input?: CancelSubscriptionInput) {
    const response = await this._client.request(CancelSubcscriptionDocument, {
      input: {
        ...(input ?? {}),
        id: subscriptionId,
      },
    });
    const cancelSubscription = response.cancelSubscription ?? null;
    if (cancelSubscription === null) {
      throw new ServerError('Could not cancel subscription');
    }

    const { errors } = cancelSubscription;
    if (errors && errors.length > 0) {
      throw new ValidationError(errors);
    }

    const subscription = cancelSubscription.subscription ?? null;
    if (subscription === null) {
      throw new ServerError('Could not cancel subscription');
    }

    return _formatSubscription(subscription);
  }

  /**
   * Pause a subscription
   * @param subscriptionId - ID of the subscription to pause
   * @param input - Payload for pausing
   * @returns Paused subscription
   */
  public async pause(subscriptionId: string, input?: PauseSubscriptionInput) {
    const response = await this._client.request(PauseSubscriptionDocument, {
      input: {
        ...(input ?? {}),
        id: subscriptionId,
      },
    });
    const pauseSubscription = response.pauseSubscription ?? null;
    if (pauseSubscription === null) {
      throw new ServerError('Could not pause subscription');
    }

    const { errors } = pauseSubscription;
    if (errors && errors.length > 0) {
      throw new ValidationError(errors);
    }

    const subscription = pauseSubscription.subscription ?? null;
    if (subscription === null) {
      throw new ServerError('Could not pause subscription');
    }

    return _formatSubscription(subscription);
  }

  /**
   * Resume a subscription
   * @param subscriptionId - ID of the subscription to resume
   * @param input - Payload for resuming
   * @returns Resumed subscription
   */
  public async resume(subscriptionId: string, input?: ResumeSubscriptionInput) {
    const response = await this._client.request(ResumeSubscriptionDocument, {
      input: {
        ...(input ?? {}),
        id: subscriptionId,
      },
    });
    const resumeSubscription = response.resumeSubscription ?? null;
    if (resumeSubscription === null) {
      throw new ServerError('Could not resume subscription');
    }

    const { errors } = resumeSubscription;
    if (errors && errors.length > 0) {
      throw new ValidationError(errors);
    }

    const subscription = resumeSubscription.subscription ?? null;
    if (subscription === null) {
      throw new ServerError('Could not resume subscription');
    }

    return _formatSubscription(subscription) as FirmhouseSubscription;
  }

  /**
   * Add a new product to subscription
   * @param subscriptionToken - Subscription token
   * @param input - Payload for creating ordered product
   * @returns Ordered product and subscription
   */
  public async addProduct(
    subscriptionToken: string,
    input: CreateOrderedProductInput
  ) {
    const response = await this._client.request(
      CreateOrderedProductDocument,
      { input },
      this.getSubscriptionTokenHeader(subscriptionToken)
    );
    const createOrderedProduct = response.createOrderedProduct ?? null;
    if (createOrderedProduct === null) {
      throw new ServerError('Could not create ordered product');
    }
    const orderedProduct = createOrderedProduct.orderedProduct ?? null;
    if (orderedProduct === null) {
      throw new ServerError('Could not create ordered product');
    }
    const subscription = createOrderedProduct.subscription ?? null;

    if (subscription === null) {
      throw new ServerError('Could not create ordered product');
    }

    return {
      orderedProduct: _formatOrderedProduct(orderedProduct, subscription),
      subscription: _formatSubscription(subscription),
    };
  }

  /**
   * Remove a product from subscription
   * @param subscriptionToken - Subscription token
   * @param orderedProductId - Ordered product id to destroy
   * @returns Subscription
   */
  public async removeProduct(
    subscriptionToken: string,
    orderedProductId: string
  ) {
    const response = await this._client.request(
      DestroyOrderedProductDocument,
      { input: { id: orderedProductId } },
      this.getSubscriptionTokenHeader(subscriptionToken)
    );
    const destroyOrderedProduct = response.destroyOrderedProduct ?? null;
    if (destroyOrderedProduct === null) {
      throw new ServerError('Could not destroy ordered product');
    }
    const subscription = destroyOrderedProduct.subscription ?? null;
    if (subscription === null) {
      throw new ServerError('Could not destroy ordered product');
    }
    return { subscription: _formatSubscription(subscription) };
  }

  /**
   * Update the plan of a subscription
   * @param subscriptionToken - Subscription token
   * @param planSlug - Slug of the plan to update to
   * @returns Updated subscription
   */
  public async updatePlan(subscriptionToken: string, planSlug: string) {
    const response = await this._client.request(
      UpdatePlanDocument,
      { input: { planSlug } },
      this.getSubscriptionTokenHeader(subscriptionToken)
    );
    const updatePlan = response.updatePlan ?? null;
    if (updatePlan === null) {
      throw new ServerError('Could not update plan');
    }
    const subscription = updatePlan.subscription ?? null;
    if (subscription === null) {
      throw new ServerError('Could not update plan');
    }
    return _formatSubscription(subscription);
  }

  /**
   * Update a subscription.
   * @param cartToken - Cart token
   * @param input - Payload for updating subscription
   * @returns Updated subscription and validation errors
   * @remarks
   * Will return validation error messages for invalid fields.
   */
  public async updateSubscription(
    cartToken: string,
    input: UpdateSubscriptionInput
  ) {
    const response = await this._client.request(
      UpdateSubscriptionDocument,
      {
        input: {
          ...input,
          token: cartToken,
        },
      },
      this.getSubscriptionTokenHeader(cartToken)
    );

    const updateSubscription = response.updateSubscription;
    if (updateSubscription === null) {
      throw new ServerError('Could not update address details');
    }

    const { errors } = updateSubscription;
    if (errors && errors.length > 0) {
      throw new ValidationError(errors);
    }

    const subscription = updateSubscription.subscription;
    if (subscription === null) {
      throw new ServerError('Could not update address details');
    }

    return _formatSubscription(subscription);
  }

  protected getSubscriptionTokenHeader(subscriptionToken: string) {
    return { 'X-Subscription-Token': subscriptionToken };
  }
}

export type {
  GetSubscriptionBySelfServiceCenterLoginTokenQuery,
  UpdateOrderedProductInput,
};
