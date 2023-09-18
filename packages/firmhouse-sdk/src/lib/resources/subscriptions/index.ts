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
  UpdateOrderedProductQuantityDocument,
} from '../../graphql/generated';
import { formatValidationErrors } from '../../helpers/errors';

export type SubscriptionType = Awaited<
  ReturnType<InstanceType<typeof SubscriptionsResource>['get']>
>;
export type SubscriptionWithTokenType = Omit<SubscriptionType, 'token'> & {
  token: string;
};
export class SubscriptionsResource extends BaseResource {
  async createCart(clientMutationId?: string) {
    const response = await this.client.request(CreateCartDocument, {
      input: { clientMutationId },
    });
    if (response.createCart === null || response.createCart === undefined) {
      throw new Error('Could not create subscription');
    }
    return response.createCart;
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
      throw new Error('No token returned from API');
    }
    return token;
  }

  /**
   * Get a subscription by subscription token
   * @param token Subscription token
   * @param includeCheckoutDetails Include checkout details
   * @returns Subscription
   */
  public async get(token: string, includeCheckoutDetails = false) {
    const response = await this.client.request(
      GetSubscriptionDocument,
      { token, includeCheckoutDetails },
      this.getSubscriptionTokenHeader(token)
    );
    if (
      response.getSubscription === null ||
      response.getSubscription === undefined
    ) {
      throw new Error('Subscription not found');
    }
    return response.getSubscription;
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

    if (this.checkSubscriptionToken(subscription)) {
      return subscription;
    }
    throw new Error('No token returned from API');
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
    return response.createOrderedProduct;
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
    return response.destroyOrderedProduct;
  }

  /**
   * Update a product in the cart
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
    return response.updateOrderedProductQuantity;
  }

  /**
   * Update the address details of a subscription. 
   * Will save changes to certain fields even when other fields given are invalid. 
   * Will return validation error messages for invalid fields.
   * @param input Address details, address, name, email, etc
   * @param subscriptionToken Subscription token
   * @returns Updated subscription and validation errors
   */
  public async updateAddressDetails(input: UpdateAddressDetailsInput, subscriptionToken: string) {
    const response = await this.client.request(
      UpdateAddressDetailsDocument,
      { input },
      this.getSubscriptionTokenHeader(subscriptionToken)
    );
    return { ...response.updateAddressDetails, errors: formatValidationErrors(response.updateAddressDetails?.errors ?? []) };
  }

  /**
   * Finalises a subscription and returns payment details based on a cart/draft subscription
   * Will return validation error messages if required fields for payment is missing.
   * @param paymentPageUrl The URL the user gets redirected to after completing payment
   * @param returnUrl The URL where the user can sign up for a new subscription
   * @param subscriptionToken Subscription token
   * @returns Payment details and validation errors if any
   */
  public async finaliseSubscription(paymentPageUrl: string, returnUrl: string, subscriptionToken: string) {
    const response = await this.client.request(
      CreateSubscriptionFromCartDocument,
      { input: { paymentPageUrl, returnUrl } },
      this.getSubscriptionTokenHeader(subscriptionToken)
    );
    return { ...response.createSubscriptionFromCart, errors: formatValidationErrors(response.createSubscriptionFromCart?.errors ?? []) };
  }

  private checkSubscriptionToken(
    subscription: SubscriptionType
  ): subscription is SubscriptionWithTokenType {
    return subscription.token !== undefined && subscription.token !== null;
  }

  private getSubscriptionTokenHeader(subscriptionToken: string) {
    return { 'X-Subscription-Token': subscriptionToken };
  }
}
