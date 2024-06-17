import {
  ApplyPromotionDocument,
  CancelSubscriptionDocument,
  CreateOrderedProductDocument,
  DestroyOrderedProductDocument,
  GetPromotionAndSubscriptionIdDocument,
  GetSubscriptionBySelfServiceCenterLoginTokenDocument,
  GetSubscriptionDocument,
  PauseSubscriptionDocument,
  ResumeSubscriptionDocument,
  UpdateOrderedProductDocument,
  UpdatePlanDocument,
  UpdateSubscriptionDocument,
  UpdateAppliedPromotionDocument,
  DeactivateAppliedPromotionDocument,
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
  ExtraFieldInput,
  OrderedProductIntervalUnitOfMeasure,
  SubscriptionStatus,
} from '../../graphql/generated';
import { BaseResource } from '../BaseResource';
import {
  FirmhouseAppliedOrderDiscountPromotion,
  FirmhouseBillingCyclePromotion,
  FirmhouseSubscription,
} from '../../firmhouse';

/**
 * @public
 * You can use subscriptions to manage the subscriptions in your project.
 * It's similar to the carts but the difference is that the subscriptions are carts that are already checked out.
 */
export class SubscriptionsResource extends BaseResource {
  /**
   * Get a subscription by subscription token including relations
   * @param token - Subscription token
   * @param includeRelations - Relations to include
   * @returns Subscription
   * @throws {@link NotFoundError} - When the subscription is not found
   */
  public async get(
    token: string,
    includeRelations?: {
      /** Include collectionCases relation */
      collectionCases?: boolean;
      /** Include verifiedIdentity relation */
      verifiedIdentity?: boolean;
      /** Parameters for including orders relation */
      orders?: {
        /** Fetch orders after this cursor */
        after?: string;
        /** Fetch orders before this cursor */
        before?: string;
        /** Fetch first n orders */
        first?: number;
        /** Fetch last n orders */
        last?: number;
        /** Include relations for orders */
        includeRelations?: {
          /** Include orderLines relation */
          orderLines?: boolean;
          /** Include payment relation */
          payment?: boolean;
          /** Include invoice relation */
          invoice?: boolean;
        };
      };
      /** Parameters for including invoices relation */
      invoices?: {
        /** Include collectionCase relation */
        includeRelations?: {
          /** Include collectionCase relation */
          collectionCase?: boolean;
          /** Include invoiceReminders relation */
          invoiceReminders?: boolean;
          /** Include invoiceLineItems relation */
          invoiceLineItems?: boolean;
          /** Include payment relation */
          payment?: boolean;
          /** Include originalInvoice relation */
          originalInvoice?: boolean;
        };
      };
      /** Parameters for including discountCodes Relation */
      discountCodes?: {
        /**
         * Include relations for discountCodes
         */
        includeRelations?: {
          /**
           * Include the autoSelectPlan relation
           */
          autoSelectPlan?: boolean;
          /**
           * Include the promotion relation
           */
          promotion?: boolean;
        };
      };
      /**
       * Include applied promotions
       */
      appliedPromotions?: {
        /**
         * Include relations for applied promotions
         */
        includeRelations?: {
          /**
           * Include the promotion relation
           */
          promotion?: boolean;

          /**
           * Include the discountCode relation
           */
          discountCode?: boolean;
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
        includeDiscountCodes: !!includeRelations?.discountCodes,
        includeDiscountCodesAutoSelectPlan:
          includeRelations?.discountCodes?.includeRelations?.autoSelectPlan ??
          false,
        includeDiscountCodesPromotion:
          includeRelations?.discountCodes?.includeRelations?.promotion ?? false,
        includeAppliedPromotions: !!includeRelations?.appliedPromotions,
        includeAppliedPromotionsPromotion:
          includeRelations?.appliedPromotions?.includeRelations?.promotion ??
          false,
        includeAppliedPromotionsDiscountCode:
          includeRelations?.appliedPromotions?.includeRelations?.discountCode ??
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
   * Update a product in the subscription
   * @param input - Payload for fields to update
   * @param subscriptionToken - Subscription token
   * @returns Updated subscription and ordered product
   * @throws {@link ServerError} - When the request fails
   * @throws {@link NotFoundError} - When the product is not found
   * @throws {@link ValidationError} - When there are invalid fields
   */
  public async updateOrderedProduct(
    subscriptionToken: string,
    input: {
      /** A custom price in cents for this ordered product, if left blank the default product price will be used */
      customPriceCents?: number | null;
      /** ID of the ordered product to update */
      id?: string | null;
      /** The amount of time in units between shipments of this order */
      interval?: number | null;
      /** The time measure for interval units. This argument is deprecated. Use intervalUnitOfMeasureType instead. If intervalUnitOfMeasureType passed, this field will be ignored. */
      intervalUnitOfMeasure?: string | null;
      /** The time measure for interval units */
      intervalUnitOfMeasureType?: OrderedProductIntervalUnitOfMeasure | null;
      /** Metadata that can be used by developers to store additional information on objects. */
      metadata?: unknown | null;
      /** ID for the related product */
      productId?: string | null;
      /** The quantity for this ordered product. */
      quantity?: number | null;
      /**
       * The next date on which a new order should get initiated
       * @example 2024-01-01
       */
      shipmentDate?: string | null;
    }
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
      orderedProduct: _formatOrderedProduct(fields),
      subscription: _formatSubscription(subscription),
    };
  }

  /**
   * Get a subscription by self service center login token
   * @param token - Self service center login token
   * @returns Subscription
   * @throws {@link NotFoundError} - When the subscription is not found
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
   * @throws {@link ValidationError} - When the request is not in cancellable state
   * @throws {@link ServerError} - When the request fails
   * @throws {@link NotFoundError} - When the subscription is not found
   */
  public async cancel(
    subscriptionId: string,
    input?: {
      /** Why did this customer decide to cancel? */
      cancellationNotes?: string | null;
      /** Skip sending the standard cancellation confirmation email to the customer. */
      skipCancellationConfirmationEmail?: boolean | null;
      /** If a customer cannot be cancelled due to active commitments, this process can be skipped. */
      skipContractTermsEnforcement?: boolean | null;
      /** If two-step cancellation is enabled it can be skipped */
      skipTwoStepCancellation?: boolean | null;
    }
  ) {
    const response = await this._client.request(CancelSubscriptionDocument, {
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
   * @throws {@link ValidationError} - When the request is not in pausable state
   * @throws {@link ServerError} - When the request fails
   * @throws {@link NotFoundError} - When the subscription is not found
   */
  public async pause(
    subscriptionId: string,
    input?: {
      /** Time from which the subscription automaticaly resumes again.
       * @example 2024-01-15T00:00:00+01:00
       */
      pauseUntil?: string | null;
    }
  ) {
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
   * @throws {@link ValidationError} - When the request is not in resumable state
   * @throws {@link ServerError} - When the request fails
   * @throws {@link NotFoundError} - When the subscription is not found
   */
  public async resume(
    subscriptionId: string,
    input?: {
      /** Time to resume the subscription from. If not given the subscription will be immediately resumed.
       * @example 2024-01-15T00:00:00+01:00
       */
      resumeFrom?: string | null;
    }
  ) {
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
   * @param input - Parameters for the added product
   * @returns Ordered product and subscription
   * @throws {@link ServerError} - When the request fails
   * @throws {@link NotFoundError} - When the product or subscription is not found
   */
  public async addProduct(
    subscriptionToken: string,
    input: {
      /** A custom price in cents for this ordered product, if left blank the default product price will be used */
      customPriceCents?: number | null;
      /**
       * Create a new record even if the same product already exists in subscription.
       * Without this paramater when you add a new product and if the product already exists
       * in the subscription, the quantity of the product will be updated.
       */
      ensureNewRecord?: boolean | null;
      /** The amount of time in units between shipments of this order */
      interval?: number | null;
      /** The time measure for interval units. This argument is deprecated. Use intervalUnitOfMeasureType instead. If intervalUnitOfMeasureType passed, this field will be ignored. */
      intervalUnitOfMeasure?: string | null;
      /** The time measure for interval units */
      intervalUnitOfMeasureType?: OrderedProductIntervalUnitOfMeasure | null;
      /** Metadata that can be used by developers to store additional information on objects. */
      metadata?: unknown | null;
      /** ID for the related product */
      productId?: string | null;
      /** The quantity for this ordered product. */
      quantity?: number | null;
      /** The next date on which a new order should get initiated
       * @example 2000-01-01
       */
      shipmentDate?: string | null;
      /** Use this field to look up the associated product based on Shopify Variant ID. */
      shopifyVariantId?: string | null;
      /** Use this field to look up the associated product based on SKU. */
      sku?: string | null;
      /** Use this field to look up the associated product based on slug. */
      slug?: string | null;
      /** ID of the subscription to create this OrderedProduct for. Required if authenticated via a project access token */
      subscriptionId?: string | null;
    }
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
      orderedProduct: _formatOrderedProduct(orderedProduct),
      subscription: _formatSubscription(subscription),
    };
  }

  /**
   * Remove a product from subscription
   * @param subscriptionToken - Subscription token
   * @param orderedProductId - Ordered product id to destroy
   * @returns Subscription
   * @throws {@link ServerError} - When the request fails
   * @throws {@link NotFoundError} - When the product is not found
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
   * @throws {@link ServerError} - When the request fails
   * @throws {@link NotFoundError} - When the plan or subscription is not found
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
   * @param subscriptionToken - Subscription token
   * @param input - Payload for updating subscription
   * @returns Updated subscription and validation errors
   * @remarks
   * Will return validation error messages for invalid fields.
   * @throws {@link ServerError} - When the request fails
   * @throws {@link ValidationError} - When there are invalid fields
   * @throws {@link NotFoundError} - When the subscription is not found
   */
  public async updateSubscription(
    subscriptionToken: string,
    input: {
      /** The time the subscription was activated
       * @example 2024-01-15T00:00:00+01:00
       */
      activatedAt?: string | null;
      /** The customer's address line or street. */
      address?: string | null;
      /** The Adyen shopper reference being used for charges. */
      adyenShopperReference?: string | null;
      /** The customer's billing address address line or street. */
      billToAddress?: string | null;
      /** The customer's billing address city or town. */
      billToCity?: string | null;
      /** The company name of the customer's billing address. */
      billToCompanyName?: string | null;
      /** The customer's billing address country code (ISO3661). */
      billToCountry?: string | null;
      /** The customer's billing address district. */
      billToDistrict?: string | null;
      /** The customer's billing address house, building, or appartment number. */
      billToHouseNumber?: string | null;
      /** The customer's billing address last name. */
      billToLastName?: string | null;
      /** The customer's billing address first name. */
      billToName?: string | null;
      /** The customer's billing address phone number (international format). */
      billToPhoneNumber?: string | null;
      /** The customer's billing address salutation (mr,ms,mx). */
      billToSalutation?: string | null;
      /** The customer's billing address state or province (ISO3661-2). */
      billToState?: string | null;
      /** The customer's billing address zip code or postal code. */
      billToZipcode?: string | null;
      /** The time the subscription started the cancellation process (with two-step cancellation)
       * @example 2024-01-15T00:00:00+01:00
       */
      cancellationStartedAt?: string | null;
      /** The time the subscription was (fully) cancelled.
       * @example 2024-01-15T00:00:00+01:00
       */
      cancelledAt?: string | null;
      /** The day of the month when the customer is charged. */
      chargeDayOfTheMonth?: number | null;
      /** The customer's city or town. */
      city?: string | null;
      /** The company name of the customer. */
      companyName?: string | null;
      /** The customer's country code (ISO3661). */
      country?: string | null;
      /** The field that can be used for your internal reference. For example, internal customer id. */
      customerReference?: string | null;
      /** The customer's date of birth (yyyy-mm-dd).
       * @example 2000-01-01
       */
      dateOfBirth?: string | null;
      /** Whether billing and shipping addresses are the same. Set this flag to `true` to store a separate billing address. */
      differentBillingAddress?: boolean | null;
      /** The customer's district. */
      district?: string | null;
      /** The customer's email address. */
      email?: string | null;
      /** Extra field values for the subscription. */
      extraFields?: ExtraFieldInput[] | null;
      /** The customer's house, building, or appartment number. */
      houseNumber?: string | null;
      /** Unique ID for an imported subscription. */
      importedSubscriptionId?: string | null;
      /** The customer's last name. */
      lastName?: string | null;
      /** The customer's language/locale. Must be enabled on the project. */
      locale?: string | null;
      /** Time time the subscription was marked as non-paying.
       * @example 2024-01-15T00:00:00+01:00
       */
      markedAsNonPayingAt?: string | null;
      /** Whether the customer accepted optional marketing communication opt-in. */
      marketingOptIn?: boolean | null;
      /** Metadata that can be used by developers to store additional information on objects. */
      metadata?: unknown | null;
      /** The Mollie Customer ID (cst_XXX) */
      mollieCustomerId?: string | null;
      /** The customer's first name. */
      name?: string | null;
      /** Notes specific for this subscription */
      notes?: string | null;
      /** The customer's phone number (international format). */
      phoneNumber?: string | null;
      /** Additional payment service provider specific properties used for payment creation. */
      pspPaymentProperties?: unknown | null;
      /** The customer's salutation (mr,ms,mx). */
      salutation?: string | null;
      /** The time when the signup was completed.
       * @example 2024-01-15T00:00:00+01:00
       */
      signupCompletedAt?: string | null;
      /** Don't automatically activate the subscription on signup. */
      skipAutoActivationOnSignup?: boolean | null;
      /** The customer's state or province (ISO3661-2). */
      state?: string | null;
      /** The current status of the subscription. (default: inactive) */
      status?: SubscriptionStatus | null;
      /** The Stripe Customer ID (cus_XXX) */
      stripeCustomerId?: string | null;
      /** The Stripe Payment Method ID of the active payment method to charge. (pm_XXX) */
      stripePaymentMethodId?: string | null;
      /** Whether the customer accepted the terms and conditions. */
      termsAccepted?: boolean | null;
      /** The token of the subscription to update, or creates a new one if one doesn't exist. */
      token?: string | null;
      /** The number of months before the customer is charged for the first time. */
      trialPeriodMonths?: number | null;
      /** The company VAT number. */
      vatNumber?: string | null;
      /** The customer's zip code or postal code. */
      zipcode?: string | null;
    }
  ) {
    const response = await this._client.request(
      UpdateSubscriptionDocument,
      {
        input: {
          ...input,
          token: subscriptionToken,
        },
      },
      this.getSubscriptionTokenHeader(subscriptionToken)
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

  /**
   * Applies a promotion to a subscription.
   * @param subscriptionId ID of the subscription to apply the promotion to.
   * @param promotionId ID of the promotion to apply.
   * @returns Applied promotion
   * @throws {@link ServerError} - When the request fails
   * @throws {@link ValidationError} - When there are invalid fields
   */
  public async applyPromotion(
    subscriptionId: string,
    promotionId: string
  ): Promise<
    FirmhouseBillingCyclePromotion | FirmhouseAppliedOrderDiscountPromotion
  > {
    const response = await this._client.request(ApplyPromotionDocument, {
      input: { promotionId, subscriptionId },
    });
    const applyPromotion = response?.applyPromotionToSubscription;
    if (applyPromotion === null || applyPromotion.appliedPromotion === null) {
      throw new ServerError('Could not apply promotion');
    }
    const { errors } = applyPromotion;
    if (errors && errors.length > 0) {
      throw new ValidationError(errors);
    }
    return applyPromotion.appliedPromotion;
  }

  /**
   * @beta
   * Apply a promotion using a discount code to a subscription
   * @param subscriptionToken Subscription token
   * @param code Discount code to apply
   * @returns Applied promotion
   * @throws {@link ServerError} - When the request fails
   * @throws {@link ValidationError} - When there are invalid fields
   * @throws {@link NotFoundError} - When the subscription is not found
   */
  public async applyPromotionWithDiscountCode(
    subscriptionToken: string,
    code: string
  ): Promise<
    FirmhouseBillingCyclePromotion | FirmhouseAppliedOrderDiscountPromotion
  > {
    const response = await this._client.request(
      GetPromotionAndSubscriptionIdDocument,
      { code, subscriptionToken }
    );
    const { id, appliedPromotions } = response?.getSubscription ?? {};
    const { promotionId } = response?.getDiscountCode ?? {};
    const existingPromotion = appliedPromotions?.find(
      (ap) => ap.promotion.id === promotionId
    );
    if (existingPromotion?.active) {
      throw new ValidationError([
        { attribute: 'code', message: 'Promotion already applied' },
      ]);
    }
    if (!id) {
      throw new NotFoundError('Subscription not found');
    }
    if (!promotionId) {
      throw new NotFoundError('Promotion not found');
    }

    if (existingPromotion) {
      return this.updateAppliedPromotion({
        id: existingPromotion.id,
        active: true,
      });
    }
    return this.applyPromotion(id, promotionId);
  }

  /**
   * Updates a promotion applied to a subscription
   * @param subscriptionToken Subscription token
   * @param input Paramater for updating the applied promotion
   * @returns Applied promotion
   * @throws {@link ServerError} - When the request fails
   * @throws {@link ValidationError} - When there are invalid fields
   * @throws {@link NotFoundError} - When the subscription is not found
   */
  public async updateAppliedPromotion(input: {
    /**
     * ID of the applied promotion that needs to be updated.
     */
    id: string;
    /**
     * The maximum discount amount in cents that this promotion should provide.Only applicable when using the VALUE deactivation strategy.
     */
    deactivateAfterAmountIncludingTaxCents?: number | null;
    /**
     * After how mamy times used this applied promotion should get deactivated.Only applicable when using the TIMES deactivation strategy.
     */
    deactivateAfterTimes?: number | null;
    /**
     * Whether this promotion should actively be used for this subscription.
     */
    active?: boolean | null;
  }): Promise<
    FirmhouseBillingCyclePromotion | FirmhouseAppliedOrderDiscountPromotion
  > {
    const response = await this._client.request(
      UpdateAppliedPromotionDocument,
      { input }
    );
    const result = response?.updateAppliedPromotion;
    if (result === null || result.appliedPromotion === null) {
      throw new ServerError('Could not update applied promotion');
    }
    const { errors } = result;
    if (errors && errors.length > 0) {
      throw new ValidationError(errors);
    }
    return result.appliedPromotion;
  }

  /**
   * Deactivates an applied promotion
   * @param appliedPromotionId 	ID of the applied promotion that needs to be deactivated.
   * @returns Deactivated applied promotion
   * @throws {@link ServerError} - When the request fails
   */
  public async deactivateAppliedPromotion(
    appliedPromotionId: string
  ): Promise<
    FirmhouseBillingCyclePromotion | FirmhouseAppliedOrderDiscountPromotion
  > {
    const response = await this._client.request(
      DeactivateAppliedPromotionDocument,
      { input: { id: appliedPromotionId } }
    );
    const result = response?.deactivateAppliedPromotion;
    if (result === null || result.appliedPromotion === null) {
      throw new ServerError('Could not deactivate applied promotion');
    }
    return result.appliedPromotion;
  }

  protected getSubscriptionTokenHeader(subscriptionToken: string) {
    return { 'X-Subscription-Token': subscriptionToken };
  }
}
