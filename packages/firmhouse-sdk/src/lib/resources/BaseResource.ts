import type { GraphQLClient } from '../helpers/GraphQLClient';

/**
 * Abstract base resource for unifying the access to GraphQL client
 */
export abstract class BaseResource {
  constructor(protected client: GraphQLClient) {
    this.client = client;
  }
}
