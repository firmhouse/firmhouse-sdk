import { GraphQLClient } from './helpers/GraphQLClient';
import { PlansResource } from './resources/plans';
import { ProductsResource } from './resources/products';
import { SubscriptionsResource } from './resources/subscriptions';
import { SelfServiceCenterTokenResource } from './resources/selfServiceCenterToken';
import { WriteAccessSubscriptionsResource } from './resources/subscriptions/write';

export enum Access {
  write,
  storefront,
}

type WriteAccess = Access.write;
type StorefrontAccess = Access.storefront;

export type AccessType = WriteAccess | StorefrontAccess;

/**
 * @public
 * Configuration for firmhouse client
 */
export type FirmhouseConfig<T extends AccessType> = {
  readonly apiToken: string;
  readonly baseUrl?: string;
  readonly accessType?: T;
};

/**
 * @public
 * Client for accessing Firmhouse GraphQL api
 */
export class FirmhouseClient<TAccess extends AccessType = StorefrontAccess> {
  private readonly API_TOKEN: string;
  private readonly BASE_URL: string;
  private readonly ACCESS_TYPE: Access;
  private client: GraphQLClient;
  private _products: ProductsResource;
  private _subscriptions:
    | SubscriptionsResource
    | WriteAccessSubscriptionsResource;
  private _plans: PlansResource;
  private _selfServiceCenterToken: SelfServiceCenterTokenResource;

  constructor(readonly config: FirmhouseConfig<TAccess>) {
    this.API_TOKEN = config.apiToken;
    this.BASE_URL = config?.baseUrl ?? 'https://portal.firmhouse.com/graphql';
    this.client = new GraphQLClient(this.API_TOKEN, this.BASE_URL);
    this.ACCESS_TYPE = config?.accessType ?? Access.storefront;

    if (this.ACCESS_TYPE === Access.write) {
      this._subscriptions = new WriteAccessSubscriptionsResource(this.client);
    } else {
      this._subscriptions = new SubscriptionsResource(this.client);
    }
    this._products = new ProductsResource(this.client);
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
  public get subscriptions(): TAccess extends WriteAccess
    ? WriteAccessSubscriptionsResource
    : SubscriptionsResource {
    return this._subscriptions as TAccess extends WriteAccess
      ? WriteAccessSubscriptionsResource
      : SubscriptionsResource;
  }

  /**
   * @public
   * SelfServiceCenterToken methods
   */
  public get selfServiceCenterToken(): SelfServiceCenterTokenResource {
    return this._selfServiceCenterToken;
  }
}
