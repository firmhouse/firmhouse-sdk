import type { _GraphQLClient } from '../helpers/GraphQLClient';

/**
 * @public
 * Abstract base resource for unifying the access to GraphQL client
 */
export abstract class BaseResource {
  /**
   * GraphQL client
   * @internal
   */
  protected readonly _client: _GraphQLClient;

  /**
   * @internal
   */
  constructor(client: _GraphQLClient) {
    this._client = client;
  }

  protected getSubscriptionTokenHeader(token: string) {
    return { 'X-Subscription-Token': token };
  }
}
