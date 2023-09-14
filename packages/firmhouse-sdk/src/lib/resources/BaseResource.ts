import type GraphQLClient from '../helpers/GraphQLClient';

export abstract class BaseResource {
  constructor(protected client: GraphQLClient) {
    this.client = client;
  }
}
