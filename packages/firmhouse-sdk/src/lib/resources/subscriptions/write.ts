import { SubscriptionsResource } from './index';
import {
  GetCompleteSubscriptionDocument,
  GetCompleteSubscriptionQuery,
  GetSubscriptionWithDocument,
} from './subscriptions.generated';
import { NotFoundError } from '../../helpers/errors';
import { _formatSubscription } from '../../helpers/subscription';
import { GetSubscriptionWithQuery } from './subscriptions.generated';

/**
 * @public
 * Subscription methods
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
   * Get a subscription by subscription token
   * @param token - Subscription token
   * @param includeRelations - Relations to include
   * @param includeRelations.collectionCases - Include collection cases
   * @param includeRelations.verifiedIdentity - Include verified identity
   * @returns Subscription
   */
  public async getWith(
    token: string,
    includeRelations: { collectionCases: false; verifiedIdentity: false }
  ) {
    const response = await this.client.request(
      GetSubscriptionWithDocument,
      {
        token,
        includeCollectionCases: includeRelations.collectionCases,
        includeVerifiedIdentity: includeRelations.verifiedIdentity,
      },
      this.getSubscriptionTokenHeader(token)
    );
    if (response.getSubscription === null) {
      throw new NotFoundError('Subscription not found');
    }
    return _formatSubscription<
      NonNullable<GetSubscriptionWithQuery['getSubscription']>
    >(response.getSubscription);
  }
}
