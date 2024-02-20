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
} from './subscriptions.generated';
import {
  NotFoundError,
  ServerError,
  ValidationError,
} from '../../helpers/errors';
import {
  arrayFilterNulls,
  filterNullsFromPaginatedResult,
} from '../../helpers/utils';
import {
  _formatOrderedProduct,
  _formatSubscription,
} from '../../helpers/subscription';
import {
  CancelSubscriptionInput,
  CreateOrderedProductInput,
  DestroyOrderedProductInput,
  PauseSubscriptionInput,
  ResumeSubscriptionInput,
  UpdateOrderedProductInput,
  UpdatePlanInput,
} from '../../graphql/generated';
import { BaseResource } from '../BaseResource';
import {
  FirmhouseInvoice,
  FirmhouseOrderedProduct,
  FirmhouseSubscription,
} from '../../firmhouse';

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
   * @param input - Payload for cancellation
   * @returns Cancelled subscription
   */
  public async cancel(input: CancelSubscriptionInput) {
    const response = await this._client.request(CancelSubcscriptionDocument, {
      input,
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
   * @param input - Payload for pausing
   * @returns Paused subscription
   */
  public async pause(input: PauseSubscriptionInput) {
    const response = await this._client.request(PauseSubscriptionDocument, {
      input,
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
   * @param input - Payload for resuming
   * @returns Resumed subscription
   */
  public async resume(input: ResumeSubscriptionInput) {
    const response = await this._client.request(ResumeSubscriptionDocument, {
      input,
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

    return {
      subscription: _formatSubscription(subscription) as FirmhouseSubscription,
    };
  }

  /**
   * Create a new ordered product
   * @param subscriptionToken - Subscription token
   * @param input - Payload for creating ordered product
   * @returns Ordered product and subscription
   */
  public async createOrderedProduct(
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
   * Destroy an ordered product
   * @param subscriptionToken - Subscription token
   * @param orderedProductId - Ordered product id to destroy
   * @returns Subscription
   */
  public async destroyOrderedProduct(
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

  protected getSubscriptionTokenHeader(subscriptionToken: string) {
    return { 'X-Subscription-Token': subscriptionToken };
  }
}

export type {
  CancelSubscriptionInput,
  PauseSubscriptionInput,
  ResumeSubscriptionInput,
  GetSubscriptionBySelfServiceCenterLoginTokenQuery,
  UpdateOrderedProductInput,
};
