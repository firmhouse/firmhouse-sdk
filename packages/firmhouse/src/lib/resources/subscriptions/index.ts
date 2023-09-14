import { BaseResource } from '../BaseResource';
import { AddToCartDocument, AddToCartMutationVariables, CreateCartDocument, CreateCartMutationVariables, CreateOrderedProductInput, DestroyOrderedProductInput, GetSubscriptionDocument, RemoveFromCartDocument, SubscriptionStatus, UpdateOrderedProductDocument, UpdateOrderedProductInput, UpdateOrderedProductQuantityDocument } from '../../graphql/generated';

export type SubscriptionType = Awaited<ReturnType<InstanceType<typeof SubscriptionsResource>['get']>>
export type SubscriptionWithTokenType = Omit<SubscriptionType, 'token'> & { token: string }
export class SubscriptionsResource extends BaseResource {

  async createCart(clientMutationId?: string) {
    const response = await this.client.request(CreateCartDocument, { input: { clientMutationId } });
    if (response.createCart === null || response.createCart === undefined) {
      throw new Error('Could not create subscription')
    }
    return response.createCart
  }

  /**
   * Create a new cart and return the subscription token
   * @param clientMutationId Optional client mutation id
   * @returns subscription token
   */
  public async createSubscriptionToken(clientMutationId?: string) {
    const response = await this.createCart(clientMutationId)
    const token = response.subscription.token
    if (token === null || token === undefined) {
      throw new Error('No token returned from API')
    }
    return token
  }

  /**
   * Get a subscription by subscription token
   * @param token Subscription token
   * @returns Subscription
   */
  public async get(token: string) {
    const response = await this.client.request(GetSubscriptionDocument, { token }, this.getSubscriptionTokenHeader(token));
    if (response.getSubscription === null || response.getSubscription === undefined) {
      throw new Error('Subscription not found')
    }
    return response.getSubscription
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
        const response = await this.get(token)
        if (response.status === SubscriptionStatus.Draft) {
          subscription = response
        }
      } catch (error) {
        // ignore
      }
    }
    if (subscription === null) {
      const response = await this.createCart()
      subscription = response.subscription
    }

    if (this.checkSubscriptionToken(subscription)) {
      return subscription
    }
    throw new Error('No token returned from API')
  }

  /**
   * Add a product to the cart
   * @param input Selected product and quantity
   * @param subscriptionToken Subscription token
   * @returns subscription after adding the product and the ordered product
   */
  public async addToCart(input: CreateOrderedProductInput, subscriptionToken: string) {
    const response = await this.client.request(AddToCartDocument, { input }, this.getSubscriptionTokenHeader(subscriptionToken));
    return response.createOrderedProduct
  }

  /**
   * Remove a product from the cart
   * @param orderedProductId Ordered product id to remove from the cart
   * @param subscriptionToken Subscription token
   * @returns subscription after removing the product and the removed product
   */
  public async removeFromCart(orderedProductId: string, subscriptionToken: string) {
    const response = await this.client.request(RemoveFromCartDocument, { input: { id: orderedProductId } }, this.getSubscriptionTokenHeader(subscriptionToken));
    return response.destroyOrderedProduct
  }

  /**
   * Update a product in the cart
   * @param orderedProductId Ordered product id to update quantity
   * @param quantity New quantity
   * @param subscriptionToken Subscription token
   * @returns 
   */
  public async updateOrderedProductQuantity(orderedProductId: string, quantity: number, subscriptionToken: string) {
    const response = await this.client.request(UpdateOrderedProductQuantityDocument, { input: { id: orderedProductId, quantity }}, this.getSubscriptionTokenHeader(subscriptionToken));
    return response.updateOrderedProductQuantity
  }


  private checkSubscriptionToken(subscription: SubscriptionType): subscription is SubscriptionWithTokenType {
    return subscription.token !== undefined && subscription.token !== null
  }

  private getSubscriptionTokenHeader(subscriptionToken: string) {
    return { 'X-Subscription-Token': subscriptionToken }
  }
}
