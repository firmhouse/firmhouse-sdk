import { _GraphQLClient } from './helpers/GraphQLClient';
import { PlansResource } from './resources/plans';
import { ProductsResource } from './resources/products';
import { SubscriptionsResource } from './resources/subscriptions';
import { SelfServiceCenterTokenResource } from './resources/selfServiceCenterToken';
import { WriteAccessSubscriptionsResource } from './resources/subscriptions/write';
import { InvoicesResource } from './resources/invoices';
import { ProjectsResource } from './resources/projects';

export enum Access {
  write,
  storefront,
}

/**
 * Configuration for firmhouse client
 * @typeParam T - Access type
 * @public
 */
export type FirmhouseConfig<T extends Access> = {
  readonly apiToken: string;
  readonly baseUrl?: string;
  readonly accessType?: T;
};

/**
 * @public
 * Client for accessing Firmhouse GraphQL api
 * @typeParam TAccess - Access type
 */
export class FirmhouseClient<TAccess extends Access = Access.storefront> {
  private readonly API_TOKEN: string;
  private readonly BASE_URL: string;
  private readonly ACCESS_TYPE: Access;
  private client: _GraphQLClient;
  private _products: ProductsResource;
  private _subscriptions:
    | SubscriptionsResource
    | WriteAccessSubscriptionsResource;
  private _plans: PlansResource;
  private _selfServiceCenterToken: SelfServiceCenterTokenResource;
  private _invoices: InvoicesResource;
  private _projects: ProjectsResource;

  constructor(readonly config: FirmhouseConfig<TAccess>) {
    this.API_TOKEN = config.apiToken;
    this.BASE_URL = config?.baseUrl ?? 'https://portal.firmhouse.com/graphql';
    this.client = new _GraphQLClient(this.API_TOKEN, this.BASE_URL);
    this.ACCESS_TYPE = config?.accessType ?? Access.storefront;

    if (this.ACCESS_TYPE === Access.write) {
      this._subscriptions = new WriteAccessSubscriptionsResource(this.client);
    } else {
      this._subscriptions = new SubscriptionsResource(this.client);
    }
    this._invoices = new InvoicesResource(this.client);
    this._projects = new ProjectsResource(this.client);
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
  public get subscriptions(): TAccess extends Access.write
    ? WriteAccessSubscriptionsResource
    : SubscriptionsResource {
    return this._subscriptions as TAccess extends Access.write
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

  /**
   * @public
   * Invoice methods
   */
  public get invoices(): TAccess extends Access.write
    ? InvoicesResource
    : never {
    if (this.ACCESS_TYPE === Access.storefront) {
      throw new Error('Cannot access projects resource with Storefront acess');
    }
    return this._invoices as TAccess extends Access.write
      ? InvoicesResource
      : never;
  }

  /**
   * @public
   * Project methods
   */
  public get projects(): TAccess extends Access.write
    ? ProjectsResource
    : never {
    if (this.ACCESS_TYPE === Access.write) {
      throw new Error('Cannot access projects resource with Storefront acess');
    }
    return this._projects as TAccess extends Access.write
      ? ProjectsResource
      : never;
  }
}
