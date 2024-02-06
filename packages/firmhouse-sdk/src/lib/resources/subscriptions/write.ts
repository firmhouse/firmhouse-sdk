import { SubscriptionsResource } from './index';
import {
  CancelSubcscriptionDocument,
  GetCompleteSubscriptionDocument,
  GetCompleteSubscriptionQuery,
  GetSubscriptionBySelfServiceCenterLoginTokenDocument,
  GetSubscriptionBySelfServiceCenterLoginTokenQuery,
  GetSubscriptionWithDocument,
  PauseSubscriptionDocument,
  ResumeSubscriptionDocument,
  UpdateOrderedProductWithWriteAccessDocument,
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
  GetSubscriptionWithQuery,
  UpdateOrderedProductWithWriteAccessMutationVariables,
} from './subscriptions.generated';
import {
  CancelSubscriptionInput,
  PauseSubscriptionInput,
  ResumeSubscriptionInput,
} from '../../firmhouse';

/**
 * @public
 * Subscription methods accessible with Write access token
 */
export class WriteAccessSubscriptionsResource extends SubscriptionsResource {
  /**
   * Get a subscription by subscription token
   * @param token - Subscription token
   * @returns Subscription
   */
  public async get(token: string) {
    const response = await this.client.request(
      GetCompleteSubscriptionDocument,
      { token },
      this.getSubscriptionTokenHeader(token)
    );
    if (response.getSubscription === null) {
      throw new NotFoundError('Subscription not found');
    }
    return _formatSubscription<
      NonNullable<GetCompleteSubscriptionQuery['getSubscription']>
    >(response.getSubscription);
  }

  /**
   * Get a subscription by subscription token including relations
   * @param token - Subscription token
   * @param includeRelations - Relations to include
   * @param includeRelations.collectionCases - Include collection cases
   * @param includeRelations.verifiedIdentity - Include verified identity
   * @returns Subscription
   */
  public async getWith(
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
    const response = await this.client.request(
      GetSubscriptionWithDocument,
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
    return {
      ..._formatSubscription<
        NonNullable<GetSubscriptionWithQuery['getSubscription']>
      >(response.getSubscription),
      ordersV2: filterNullsFromPaginatedResult(
        response.getSubscription.ordersV2
      ),
      invoices: arrayFilterNulls(response.getSubscription.invoices),
    };
  }

  /**
   * Update a product in the cart
   * @param input - Payload for fields to update
   * @param subscriptionToken - Subscription token
   * @returns Updated subscription
   */
  public async updateOrderedProduct(
    input: UpdateOrderedProductWithWriteAccessMutationVariables,
    subscriptionToken: string
  ) {
    const response = await this.client.request(
      UpdateOrderedProductWithWriteAccessDocument,
      input,
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
    const response = await this.client.request(
      GetSubscriptionBySelfServiceCenterLoginTokenDocument,
      { token },
      this.getSubscriptionTokenHeader(token)
    );
    if (response.getSubscriptionBySelfServiceCenterLoginToken === null) {
      throw new NotFoundError('Subscription not found');
    }
    return _formatSubscription<
      NonNullable<
        GetSubscriptionBySelfServiceCenterLoginTokenQuery['getSubscriptionBySelfServiceCenterLoginToken']
      >
    >(response.getSubscriptionBySelfServiceCenterLoginToken);
  }

  /**
   * Cancel a subscription
   * @param input - Payload for cancellation
   * @returns Cancelled subscription
   */
  public async cancel(input: CancelSubscriptionInput) {
    const response = await this.client.request(CancelSubcscriptionDocument, {
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

    return {
      subscription: _formatSubscription(subscription),
    };
  }

  /**
   * Pause a subscription
   * @param input - Payload for pausing
   * @returns Paused subscription
   */
  public async pause(input: PauseSubscriptionInput) {
    const response = await this.client.request(PauseSubscriptionDocument, {
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

    return {
      subscription: _formatSubscription(subscription),
    };
  }

  /**
   * Resume a subscription
   * @param input - Payload for resuming
   * @returns Resumed subscription
   */
  public async resume(input: ResumeSubscriptionInput) {
    const response = await this.client.request(ResumeSubscriptionDocument, {
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
      subscription: _formatSubscription(subscription),
    };
  }
}
