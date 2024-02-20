import { BaseResource } from '../BaseResource';
import {
  CreateOrderedProductInput,
  SubscriptionStatus,
} from '../../graphql/generated';

import {
  AddToCartDocument,
  CreateCartDocument,
  CreateSubscriptionFromCartDocument,
  GetCartDocument,
  RemoveFromCartDocument,
  UpdateAddressDetailsDocument,
  UpdateAddressDetailsMutationVariables,
  UpdateCartPlanDocument,
  UpdateOrderedProductInCartDocument,
  UpdateOrderedProductInCartMutationVariables,
  UpdateOrderedProductInCartQuantityDocument,
} from './cart.generated';
import {
  NotFoundError,
  ServerError,
  ValidationError,
} from '../../helpers/errors';
import { _formatCart, _formatOrderedProduct } from '../../helpers/subscription';
import { FirmhouseCart, FirmhouseOrderedProduct } from '../../helpers/types';

/**
 * @public
 * Cart(Draft subscription) methods
 */
export class CartsResource extends BaseResource {
  async createCart(clientMutationId?: string): Promise<FirmhouseCart> {
    const response = await this._client.request(CreateCartDocument, {
      input: { clientMutationId },
    });
    if (response.createCart === null || response.createCart === undefined) {
      throw new ServerError('Could not create subscription');
    }
    return _formatCart(response.createCart.subscription);
  }

  /**
   * Create a new cart and return the subscription token
   * @param clientMutationId - Optional client mutation id
   * @returns subscription token
   */
  public async createSubscriptionToken(clientMutationId?: string) {
    const response = await this.createCart(clientMutationId);
    const token = response.token;
    if (token === null || token === undefined) {
      throw new ServerError('No token returned from API');
    }
    return token;
  }

  /**
   * Get a cart by subscription token
   * @param token - Cart token
   * @returns Subscription
   */
  public async get(token: string): Promise<FirmhouseCart> {
    const response = await this._client.request(
      GetCartDocument,
      { token },
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
  public async getOrCreateCart(token?: string) {
    if (token !== undefined) {
      try {
        const response = await this.get(token);
        if (response.status === SubscriptionStatus.Draft) {
          return _formatCart(response);
        }
      } catch (error) {
        // ignore
      }
    }
    return this.createCart();
  }

  /**
   * Add a product to the cart
   * @param input - Selected product and quantity
   * @param cartToken - Cart token
   * @returns subscription after adding the product and the ordered product
   */
  public async addToCart(cartToken: string, input: CreateOrderedProductInput) {
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
      orderedProduct: _formatOrderedProduct(orderedProduct, subscription),
      subscription: _formatCart(subscription),
    };
  }

  /**
   * Remove a product from the cart
   * @param orderedProductId - Ordered product id to remove from the cart
   * @param cartToken - Cart token
   * @returns subscription after removing the product and the removed product
   */
  public async removeFromCart(cartToken: string, orderedProductId: string) {
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
        orderedProduct,
        subscription
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
      orderedProduct: _formatOrderedProduct(orderedProduct, subscription),
      subscription: _formatCart(subscription),
    };
  }

  /**
   * Update an ordered product
   * @param input - Payload for fields to update
   * @param cartToken - Cart token
   * @returns Updated cart
   */
  public async updateOrderedProduct(
    cartToken: string,
    input: UpdateOrderedProductInCartMutationVariables
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
      orderedProduct: _formatOrderedProduct(fields, subscription),
      subscription: _formatCart(subscription),
    };
  }

  /**
   * Update the address details of a subscription.
   * @param input - Address details, address, name, email, etc
   * @param cartToken - Cart token
   * @returns Updated cart and validation errors
   * @remarks
   * Will save changes to certain fields evesn when other fields given are invalid.
   * Will return validation error messages for invalid fields.
   */
  public async updateAddressDetails(
    cartToken: string,
    input: UpdateAddressDetailsMutationVariables
  ) {
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
   * @throws {@link @firmhouse/firmhouse-sdk#ValidationError}
   * Thrown if required fields for payment is missing.
   */
  public async createSubscriptionFromCart(
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

  protected getSubscriptionTokenHeader(cartToken: string) {
    return { 'X-Subscription-Token': cartToken };
  }
}

export type {
  UpdateAddressDetailsMutationVariables,
  UpdateOrderedProductInCartMutationVariables,
} from './cart.generated';
