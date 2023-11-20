import { GraphQLClient } from './helpers/GraphQLClient';
import { PlansResource } from './resources/plans';
import { ProductsResource } from './resources/products';
import { SubscriptionsResource } from './resources/subscriptions';
import { SelfServiceCenterTokenResource } from './resources/selfServiceCenterToken';

/**
 * @public
 * Configuration for firmhouse client
 */
export type FirmhouseConfig = {
  apiToken: string;
  baseUrl?: string;
};

/**
 * @public
 * Client for accessing Firmhouse GraphQL api
 */
export class FirmhouseClient {
  private readonly API_TOKEN: string;
  private readonly BASE_URL: string;
  private client: GraphQLClient;
  private _products: ProductsResource;
  private _subscriptions: SubscriptionsResource;
  private _plans: PlansResource;
  private _selfServiceCenterToken: SelfServiceCenterTokenResource;

  constructor(config: FirmhouseConfig) {
    this.API_TOKEN = config.apiToken;
    this.BASE_URL = config?.baseUrl ?? 'https://portal.firmhouse.com/graphql';
    this.client = new GraphQLClient(this.API_TOKEN, this.BASE_URL);
    this._products = new ProductsResource(this.client);
    this._subscriptions = new SubscriptionsResource(this.client);
    this._plans = new PlansResource(this.client);
    this._selfServiceCenterToken = new SelfServiceCenterTokenResource(
      this.client
    );
  }

  /**
   * @public
   * Plan methods
   */
  public get plans(): PlansResource {
    return this._plans;
  }

  /**
   * @public
   * Product methods
   */
  public get products(): ProductsResource {
    return this._products;
  }

  /**
   * @public
   * Subscription methods
   */
  public get subscriptions(): SubscriptionsResource {
    return this._subscriptions;
  }

  /**
   * @public
   * SelfServiceCenterToken methods
   */
  public get selfServiceCenterToken(): SelfServiceCenterTokenResource {
    return this._selfServiceCenterToken;
  }
}
