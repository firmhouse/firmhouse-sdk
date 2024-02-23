/* eslint-disable @nx/enforce-module-boundaries */
import {
  GraphQLClient as GraphQLClientBase,
  ClientError,
  type ResponseMiddleware,
} from 'graphql-request';
import { _mapToLibraryErrorTypes } from './errors';

/**
 * @internal
 * Response type for the graphql client
 */
export type _GraphQLClientResponse = Parameters<ResponseMiddleware>[0];

/**
 * @internal
 * Wrapper around the graphql client
 */
export class _GraphQLClient {
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
    const fetchMethod = typeof fetch === 'undefined' ? undefined : fetch;
    this.client = new GraphQLClientBase(this.BASE_URL, {
      fetch: fetchMethod,
      headers: {
        'X-Project-Access-Token': this.API_TOKEN,
      },
      responseMiddleware: this._responseMiddleware,
    });
    this.request = this.client.request.bind(this.client);
  }
  /**
   * @internal
   * @param res - Response
   * @returns Modified response
   */
  async _responseMiddleware(res: _GraphQLClientResponse) {
    if (res instanceof ClientError) {
      return _mapToLibraryErrorTypes(res as ClientError);
    }
  }
}
