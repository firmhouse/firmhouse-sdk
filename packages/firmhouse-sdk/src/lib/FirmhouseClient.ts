import { _GraphQLClient } from './helpers/GraphQLClient';
import { PlansResource } from './resources/plans';
import { ProductsResource } from './resources/products';
import { SubscriptionsResource } from './resources/subscriptions';
import { SelfServiceCenterTokenResource } from './resources/selfServiceCenterToken';
import { InvoicesResource } from './resources/invoices';
import { ProjectsResource } from './resources/projects';
import { CartsResource } from './resources/carts';

export enum Access {
  storefront,
  write,
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
  private _subscriptions: SubscriptionsResource;
  private _carts: CartsResource;
  private _plans: PlansResource;
  private _selfServiceCenterToken: SelfServiceCenterTokenResource;
  private _invoices: InvoicesResource;
  private _projects: ProjectsResource;

  constructor(private readonly _config: FirmhouseConfig<TAccess>) {
    this.API_TOKEN = _config.apiToken;
    this.BASE_URL = _config?.baseUrl ?? 'https://portal.firmhouse.com/graphql';
    this.client = new _GraphQLClient(this.API_TOKEN, this.BASE_URL);
    this.ACCESS_TYPE = _config?.accessType ?? Access.storefront;
    this._subscriptions = new SubscriptionsResource(this.client);
    this._carts = new CartsResource(this.client);
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
    ? SubscriptionsResource
    : never {
    if (this.ACCESS_TYPE === Access.storefront) {
      throw new Error(
        'Cannot access subscriptions resource with Storefront acess'
      );
    }
    return this._subscriptions as Access extends Access.write
      ? SubscriptionsResource
      : never;
  }

  /**
   * @public
   * Cart methods
   */
  public get carts(): CartsResource {
    return this._carts;
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
      throw new Error('Cannot access invoices resource with Storefront acess');
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
    if (this.ACCESS_TYPE === Access.storefront) {
      throw new Error('Cannot access projects resource with Storefront acess');
    }
    return this._projects as TAccess extends Access.write
      ? ProjectsResource
      : never;
  }
}
