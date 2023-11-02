/* eslint-disable @nx/enforce-module-boundaries */
import {
  GraphQLClient as GraphQLClientBase,
  ClientError,
} from 'graphql-request';
import { mapToLibraryErrorTypes } from './errors';
// Wraps the graphql-request client to provide a typed interface
export default class GraphQLClient {
  private readonly API_TOKEN: string;
  private readonly BASE_URL: string;
  private client: GraphQLClientBase;

  public request: InstanceType<typeof GraphQLClientBase>['request'];

  constructor(
    apiToken: string,
    baseUrl = 'https://portal.firmhouse.com/graphql'
  ) {
    this.API_TOKEN = apiToken;
    this.BASE_URL = baseUrl;
    this.client = new GraphQLClientBase(this.BASE_URL, {
      headers: {
        'X-Project-Access-Token': this.API_TOKEN,
      },
      responseMiddleware: async (res) => {
        if (res instanceof ClientError) {
          return mapToLibraryErrorTypes(res as ClientError);
        }
      },
    });
    this.request = this.client.request.bind(this.client);
  }
}
