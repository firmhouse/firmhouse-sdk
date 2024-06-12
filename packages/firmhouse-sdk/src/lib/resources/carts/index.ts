import { BaseResource } from '../BaseResource';
import {
  ExtraFieldInput,
  OrderedProductIntervalUnitOfMeasure,
  SubscriptionStatus,
} from '../../graphql/generated';

import {
  AddToCartDocument,
  CreateCartDocument,
  CreateSubscriptionFromCartDocument,
  GetCartDocument,
  RemoveFromCartDocument,
  UpdateAddressDetailsDocument,
  UpdateCartPlanDocument,
  UpdateOrderedProductInCartDocument,
  UpdateOrderedProductInCartQuantityDocument,
} from './carts.generated';
import {
  NotFoundError,
  ServerError,
  ValidationError,
} from '../../helpers/errors';
import { _formatCart, _formatOrderedProduct } from '../../helpers/subscription';
import { FirmhouseCart, FirmhouseOrderedProduct } from '../../helpers/types';

/**
 * @public
 * You can use carts for all the necessary operations to manage a customer's cart and implement cart functionality in your application.
 * You can handle everything related to managing items in the cart before checkout such as adding, removing items, updating quantities, accessing payment and checkout urls and more.
 */
export class CartsResource extends BaseResource {
  async create(includeRelations?: {
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
  }): Promise<FirmhouseCart> {
    const response = await this._client.request(CreateCartDocument, {
      input: {},
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
    });
    if (response.createCart === null || response.createCart === undefined) {
      throw new ServerError('Could not create subscription');
    }
    return _formatCart(response.createCart.subscription);
  }

  /**
   * Create a new cart and return the subscription token
   * @returns cart token
   * @throws {@link ServerError} Thrown if no token is returned from the API
   */
  public async createCartToken() {
    const response = await this.create();
    const token = response.token;
    if (token === null || token === undefined) {
      throw new ServerError('No token returned from API');
    }
    return token;
  }

  /**
   * Get a cart by cart token
   * @param token - Cart token
   * @param includeRelations - Relations to include
   * @returns Cart
   * @throws {@link NotFoundError} Thrown if the cart is not found
   */
  public async get(
    token: string,
    includeRelations?: {
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
  ): Promise<FirmhouseCart> {
    const response = await this._client.request(
      GetCartDocument,
      {
        token,
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
    if (response.getCart === null) {
      throw new NotFoundError('Cart not found');
    }
    return _formatCart(response.getCart);
  }

  /**
   * Try to get a cart by token, if it exists and is a subscription in draft status, return it. Otherwise create a new cart.
   * @param token - Cart token
   * @returns Cart if it exists, otherwise a new cart
   */
  public async getOrCreate(
    token?: string,
    includeRelations?: {
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
    if (token !== undefined) {
      try {
        const response = await this.get(token, includeRelations);
        if (response.status === SubscriptionStatus.Draft) {
          return _formatCart(response);
        }
      } catch (error) {
        // ignore
      }
    }
    return this.create(includeRelations);
  }

  /**
   * Add a product to the cart
   * @param input - Parameters for the added product
   * @param cartToken - Cart token
   * @returns subscription after adding the product and the ordered product
   * @throws {@link ServerError} Thrown if the product could not be added to the cart
   * @throws {@link ValidationError} Thrown if the input is invalid
   * @throws {@link NotFoundError} Thrown if the product or cart is not found
   */
  public async addProduct(
    cartToken: string,
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
      AddToCartDocument,
      { input },
      this.getSubscriptionTokenHeader(cartToken)
    );
    const addToCart = response.addToCart ?? null;
    if (addToCart === null) {
      throw new ServerError('Could not add product to cart');
    }
    const subscription = addToCart.subscription ?? null;
    const orderedProduct = addToCart.orderedProduct ?? null;
    if (subscription === null || orderedProduct === null) {
      throw new ServerError('Could not add product to cart');
    }

    return {
      orderedProduct: _formatOrderedProduct(orderedProduct),
      subscription: _formatCart(subscription),
    };
  }

  /**
   * Remove a product from the cart
   * @param orderedProductId - Ordered product id to remove from the cart
   * @param cartToken - Cart token
   * @returns subscription after removing the product and the removed product
   * @throws {@link ServerError} Thrown if the product could not be removed from the cart
   * @throws {@link NotFoundError} Thrown if the product or cart is not found
   */
  public async removeProduct(cartToken: string, orderedProductId: string) {
    const response = await this._client.request(
      RemoveFromCartDocument,
      { input: { id: orderedProductId } },
      this.getSubscriptionTokenHeader(cartToken)
    );
    const removeFromCart = response.removeFromCart ?? null;
    if (removeFromCart === null) {
      throw new ServerError('Could not remove product from cart');
    }
    const subscription = removeFromCart.subscription ?? null;
    const orderedProduct = removeFromCart.orderedProduct ?? null;
    if (subscription === null || orderedProduct === null) {
      throw new ServerError('Could not remove product from cart');
    }

    return {
      orderedProduct: _formatOrderedProduct(
        orderedProduct
      ) as FirmhouseOrderedProduct,
      subscription: _formatCart(subscription) as FirmhouseCart,
    };
  }

  /**
   * Update a product quantity in the cart
   * @param orderedProductId - Ordered product id to update quantity
   * @param quantity - New quantity
   * @param cartToken - Cart token
   * @returns Updated cart
   * @throws {@link ServerError} Thrown if the product quantity could not be updated
   * @throws {@link NotFoundError} Thrown if the product or cart is not found
   * @throws {@link ValidationError} Thrown if the input is invalid
   */
  public async updateOrderedProductQuantity(
    cartToken: string,
    orderedProductId: string,
    quantity: number
  ) {
    const response = await this._client.request(
      UpdateOrderedProductInCartQuantityDocument,
      { id: orderedProductId, quantity },
      this.getSubscriptionTokenHeader(cartToken)
    );
    const updateOrderedProductQuantity =
      response.updateOrderedProductInCartQuantity ?? null;
    if (updateOrderedProductQuantity === null) {
      throw new ServerError('Could not update ordered product quantity');
    }
    const subscription = updateOrderedProductQuantity.subscription ?? null;
    const orderedProduct = updateOrderedProductQuantity.orderedProduct ?? null;
    if (subscription === null || orderedProduct === null) {
      throw new ServerError('Could not update ordered product quantity');
    }

    return {
      orderedProduct: _formatOrderedProduct(orderedProduct),
      subscription: _formatCart(subscription),
    };
  }

  /**
   * Update an ordered product
   * @param input - Payload for fields to update
   * @param cartToken - Cart token
   * @returns Updated cart
   * @throws {@link ServerError} Thrown if the ordered product could not be updated
   * @throws {@link ValidationError} Thrown if the input is invalid
   * @throws {@link NotFoundError} Thrown if the product or cart is not found
   */
  public async updateOrderedProduct(
    cartToken: string,
    input: {
      /** ID of this ordered product. */
      id?: string | null;
      /** A custom price in cents for this ordered product, if left blank the default product price will be used */
      customPriceCents?: number | null;
      /** The amount of time in units between shipments of this order */
      interval?: number | null;
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
      UpdateOrderedProductInCartDocument,
      input,
      this.getSubscriptionTokenHeader(cartToken)
    );
    const updateOrderedProduct = response.updateOrderedProductInCart ?? null;
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
      subscription: _formatCart(subscription),
    };
  }

  /**
   * Update the address details of a subscription.
   * @param input - Address details, address, name, email, etc
   * @param cartToken - Cart token
   * @returns Updated cart and validation errors
   * @remarks
   * Will save changes to certain fields even when other fields given are invalid.
   * Will return validation error messages for invalid fields.
   * @throws {@link ValidationError} Thrown if the input is invalid
   * @throws {@link ServerError} Thrown if the address details could not be updated
   * @throws {@link NotFoundError} Thrown if the cart is not found
   */
  public async updateAddressDetails(
    cartToken: string,
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
  ): Promise<FirmhouseCart> {
    const response = await this._client.request(
      UpdateAddressDetailsDocument,
      input,
      this.getSubscriptionTokenHeader(cartToken)
    );

    const updateAddressDetails = response.updateAddressDetails;
    if (updateAddressDetails === null) {
      throw new ServerError('Could not update address details');
    }

    const { errors } = updateAddressDetails;
    if (errors && errors.length > 0) {
      throw new ValidationError(errors);
    }

    const subscription = updateAddressDetails.subscription;
    if (subscription === null) {
      throw new ServerError('Could not update address details');
    }

    return _formatCart(subscription);
  }

  /**
   * Finalises a subscription and returns payment details based on a cart/draft subscription
   * @param paymentPageUrl - The URL where the user can sign up for a new subscription
   * @param returnUrl - The URL the user gets redirected to after completing payment
   * @param cartToken - Cart token
   * @returns Payment details and validation errors if any
   * @throws {@link ValidationError} Thrown if required fields is missing from cart
   * @throws {@link ServerError} Thrown if the subscription could not be created
   * @throws {@link NotFoundError} Thrown if the cart is not found
   */
  public async createSubscription(
    cartToken: string,
    paymentPageUrl: string,
    returnUrl: string
  ) {
    const response = await this._client.request(
      CreateSubscriptionFromCartDocument,
      { input: { paymentPageUrl, returnUrl } },
      this.getSubscriptionTokenHeader(cartToken)
    );
    const { createSubscriptionFromCart } = response;

    if (createSubscriptionFromCart === null) {
      throw new ServerError('Could not create subscription');
    }

    const { errors, subscription, paymentUrl } = createSubscriptionFromCart;
    if (errors && errors.length > 0) {
      throw new ValidationError(errors);
    }

    if (subscription === null) {
      throw new ServerError('Could not create subscription');
    }

    return {
      paymentUrl,
      returnUrl: createSubscriptionFromCart.returnUrl,
      subscription: _formatCart(subscription),
    };
  }

  /**
   * Updates the active plan of a subscription
   * @param planSlug - Slug of the plan to update the subscription to
   * @param cartToken - Cart token
   * @returns Updated cart
   * @throws {@link ServerError} Thrown if the plan could not be changed
   * @throws {@link NotFoundError} Thrown if the cart or plan is not found
   */
  public async updatePlan(cartToken: string, planSlug: string) {
    const response = await this._client.request(
      UpdateCartPlanDocument,
      { input: { planSlug } },
      this.getSubscriptionTokenHeader(cartToken)
    );
    const { updateCartPlan } = response;

    if (updateCartPlan === null) {
      throw new ServerError('Could not update plan');
    }

    return _formatCart(updateCartPlan.subscription);
  }
}
