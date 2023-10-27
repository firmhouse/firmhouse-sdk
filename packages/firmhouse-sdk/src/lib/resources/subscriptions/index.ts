import { BaseResource } from '../BaseResource';
import {
  AddToCartDocument,
  CreateCartDocument,
  CreateOrderedProductInput,
  CreateSubscriptionFromCartDocument,
  GetSubscriptionDocument,
  RemoveFromCartDocument,
  SubscriptionStatus,
  UpdateAddressDetailsDocument,
  UpdateAddressDetailsInput,
  UpdateOrderedProductDocument,
  UpdateOrderedProductInput,
  UpdateOrderedProductQuantityDocument,
  UpdatePlanDocument,
} from '../../graphql/generated';
import {
  NotFoundError,
  ServerError,
  ValidationError,
} from '../../helpers/errors';
import {
  SubscriptionType,
  formatOrderedProduct,
  formatSubscription,
  formatSubscriptionInResponse,
} from '../../helpers/subscription';
export class SubscriptionsResource extends BaseResource {
  async createCart(clientMutationId?: string) {
    const response = await this.client.request(CreateCartDocument, {
      input: { clientMutationId },
    });
    if (response.createCart === null || response.createCart === undefined) {
      throw new ServerError('Could not create subscription');
    }
    return formatSubscriptionInResponse(response.createCart);
  }

  /**
   * Create a new cart and return the subscription token
   * @param clientMutationId Optional client mutation id
   * @returns subscription token
   */
  public async createSubscriptionToken(clientMutationId?: string) {
    const response = await this.createCart(clientMutationId);
    const token = response.subscription.token;
    if (token === null || token === undefined) {
      throw new ServerError('No token returned from API');
    }
    return token;
  }

  /**
   * Get a subscription by subscription token
   * @param token Subscription token
   * @returns Subscription
   */
  public async get(token: string) {
    const response = await this.client.request(
      GetSubscriptionDocument,
      { token },
      this.getSubscriptionTokenHeader(token)
    );
    if (
      response.getSubscription === null ||
      response.getSubscription === undefined
    ) {
      throw new NotFoundError('Subscription not found');
    }
    return formatSubscription(response.getSubscription);
  }

  /**
   * Try to get a subscription by token, if it exists and is a draft subscription, return it. Otherwise create a new draft subscription.
   * @param token Subscription token
   * @returns Subscription if it exists, otherwise a new draft subscription
   */
  public async getOrCreateDraftSubscription(token?: string) {
    let subscription: SubscriptionType | null = null;
    if (token !== undefined) {
      try {
        const response = await this.get(token);
        if (response.status === SubscriptionStatus.Draft) {
          subscription = response;
        }
      } catch (error) {
        // ignore
      }
    }
    if (subscription === null) {
      const response = await this.createCart();
      subscription = response.subscription;
    }

    return formatSubscription(subscription);
  }

  /**
   * Add a product to the cart
   * @param input Selected product and quantity
   * @param subscriptionToken Subscription token
   * @returns subscription after adding the product and the ordered product
   */
  public async addToCart(
    input: CreateOrderedProductInput,
    subscriptionToken: string
  ) {
    const response = await this.client.request(
      AddToCartDocument,
      { input },
      this.getSubscriptionTokenHeader(subscriptionToken)
    );
    const createOrderedProduct = response.createOrderedProduct ?? null;
    if (createOrderedProduct === null) {
      throw new ServerError('Could not add product to cart');
    }
    const subscription = createOrderedProduct.subscription ?? null;
    const orderedProduct = createOrderedProduct.orderedProduct ?? null;
    if (subscription === null || orderedProduct === null) {
      throw new ServerError('Could not add product to cart');
    }

    return {
      orderedProduct: formatOrderedProduct(orderedProduct),
      subscription: formatSubscription(subscription),
    };
  }

  /**
   * Remove a product from the cart
   * @param orderedProductId Ordered product id to remove from the cart
   * @param subscriptionToken Subscription token
   * @returns subscription after removing the product and the removed product
   */
  public async removeFromCart(
    orderedProductId: string,
    subscriptionToken: string
  ) {
    const response = await this.client.request(
      RemoveFromCartDocument,
      { input: { id: orderedProductId } },
      this.getSubscriptionTokenHeader(subscriptionToken)
    );
    const destroyOrderedProduct = response.destroyOrderedProduct ?? null;
    if (destroyOrderedProduct === null) {
      throw new ServerError('Could not remove product from cart');
    }
    const subscription = destroyOrderedProduct.subscription ?? null;
    const orderedProduct = destroyOrderedProduct.orderedProduct ?? null;
    if (subscription === null || orderedProduct === null) {
      throw new ServerError('Could not remove product from cart');
    }

    return {
      orderedProduct: formatOrderedProduct(orderedProduct),
      subscription: formatSubscription(subscription),
    };
  }

  /**
   * Update a product quantity in the cart
   * @param orderedProductId Ordered product id to update quantity
   * @param quantity New quantity
   * @param subscriptionToken Subscription token
   * @returns Updated subscription
   */
  public async updateOrderedProductQuantity(
    orderedProductId: string,
    quantity: number,
    subscriptionToken: string
  ) {
    const response = await this.client.request(
      UpdateOrderedProductQuantityDocument,
      { input: { orderedProduct: { id: orderedProductId, quantity } } },
      this.getSubscriptionTokenHeader(subscriptionToken)
    );
    const updateOrderedProductQuantity =
      response.updateOrderedProductQuantity ?? null;
    if (updateOrderedProductQuantity === null) {
      throw new ServerError('Could not update ordered product quantity');
    }
    const subscription = updateOrderedProductQuantity.subscription ?? null;
    const orderedProduct = updateOrderedProductQuantity.orderedProduct ?? null;
    if (subscription === null || orderedProduct === null) {
      throw new ServerError('Could not update ordered product quantity');
    }

    return {
      orderedProduct: formatOrderedProduct(orderedProduct),
      subscription: formatSubscription(subscription),
    };
  }

  /**
   * Update a product in the cart
   * @param input
   * @param subscriptionToken Subscription token
   * @returns Updated subscription
   */
  public async updateOrderedProduct(
    input: UpdateOrderedProductInput,
    subscriptionToken: string
  ) {
    const response = await this.client.request(
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

    return {
      orderedProduct: formatOrderedProduct(orderedProduct),
    };
  }

  /**
   * Update the address details of a subscription.
   * Will save changes to certain fields even when other fields given are invalid.
   * Will return validation error messages for invalid fields.
   * @param input Address details, address, name, email, etc
   * @param subscriptionToken Subscription token
   * @returns Updated subscription and validation errors
   */
  public async updateAddressDetails(
    input: UpdateAddressDetailsInput,
    subscriptionToken: string
  ) {
    const response = await this.client.request(
      UpdateAddressDetailsDocument,
      { input },
      this.getSubscriptionTokenHeader(subscriptionToken)
    );

    const updateAddressDetails = response.updateAddressDetails ?? null;
    if (updateAddressDetails === null) {
      throw new ServerError('Could not update address details');
    }

    const { errors } = updateAddressDetails;
    if (errors && errors.length > 0) {
      throw new ValidationError(errors);
    }

    const subscription = updateAddressDetails?.subscription ?? null;
    if (subscription === null) {
      throw new ServerError('Could not update address details');
    }

    return {
      subscription: formatSubscription(subscription),
    };
  }

  /**
   * Finalises a subscription and returns payment details based on a cart/draft subscription
   * Will return validation error messages if required fields for payment is missing.
   * @param paymentPageUrl The URL where the user can sign up for a new subscription
   * @param returnUrl The URL the user gets redirected to after completing payment
   * @param subscriptionToken Subscription token
   * @returns Payment details and validation errors if any
   */
  public async createSubscriptionFromCart(
    paymentPageUrl: string,
    returnUrl: string,
    subscriptionToken: string
  ) {
    const response = await this.client.request(
      CreateSubscriptionFromCartDocument,
      { input: { paymentPageUrl, returnUrl } },
      this.getSubscriptionTokenHeader(subscriptionToken)
    );
    const createSubscriptionFromCart =
      response.createSubscriptionFromCart ?? null;

    if (createSubscriptionFromCart === null) {
      throw new ServerError('Could not create subscription');
    }

    const { errors, subscription, paymentUrl } = createSubscriptionFromCart;
    if (errors && errors.length > 0) {
      throw new ValidationError(errors);
    }

    if (subscription === null) {
      throw new ServerError('Could  not create subscription');
    }

    return {
      paymentUrl,
      returnUrl: createSubscriptionFromCart.returnUrl,
      subscription: formatSubscription(subscription),
    };
  }

  /**
   * Updates the active plan of a subscription
   * @param planSlug Slug of the plan to update the subscription to
   * @param subscriptionToken Subscription token
   * @returns Updated subscription
   */
  public async updatePlan(planSlug: string, subscriptionToken: string) {
    const response = await this.client.request(
      UpdatePlanDocument,
      { input: { planSlug } },
      this.getSubscriptionTokenHeader(subscriptionToken)
    );
    const updatePlan = response.updatePlan ?? null;

    if (updatePlan === null) {
      throw new ServerError('Could not update plan');
    }

    return formatSubscriptionInResponse(updatePlan);
  }

  private getSubscriptionTokenHeader(subscriptionToken: string) {
    return { 'X-Subscription-Token': subscriptionToken };
  }
}
