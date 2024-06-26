import { _GraphQLClient } from './helpers/GraphQLClient';
import { PlansResource } from './resources/plans';
import { ProductsResource } from './resources/products';
import { SubscriptionsResource } from './resources/subscriptions';
import { SelfServiceCenterTokenResource } from './resources/selfServiceCenterToken';
import { InvoicesResource } from './resources/invoices';
import { ProjectsResource } from './resources/projects';
import { CartsResource } from './resources/carts';

/**
 * Access type for the Firmhouse access token
 */
export enum Access {
  /**
   * Storefront access
   */
  storefront,
  /**
   * Write access
   */
  write,
}

/**
 * Configuration for firmhouse client
 * @typeParam T - Access type
 * @public
 */
export interface FirmhouseConfig<T extends Access> {
  /**
   * Firmhouse api token
   * @remarks
   * This token can be obtained from Firmhouse portal \> Integrations
   */
  readonly apiToken: string;
  /**
   * Base url for the Firmhouse api
   * @remarks
   * Default value is `https://portal.firmhouse.com/graphql`
   */
  readonly baseUrl?: string;
  /**
   * Access type for the apiToken
   * @remarks
   * If the accessType is `storefront`, then the client will not have access to write operations such as projects, subscriptions, invoices etc.
   * Default value is `Access.storefront`
   */
  readonly accessType?: T;
}

/**
 * @public
 * Client for accessing Firmhouse GraphQL api
 * @typeParam TAccess - Access type. (Will be inferred from the config)
 * @groupDescription Resources
 * Resources for accessing Firmhouse API
 * @example
 * ```typescript
 * import { FirmhouseClient, Access } from '@firmhouse/sdk';
 * const client = new FirmhouseClient({
 *  apiToken,
 *  accessType: Access.write
 * });
 *
 * const cart = await client.carts.getOrCreate();
 * const products = await client.products.fetchAll();
 * const invoices = await client.invoices.fetchAll();
 * ```
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

  constructor(readonly config: FirmhouseConfig<TAccess>) {
    this.API_TOKEN = config.apiToken;
    this.BASE_URL = config?.baseUrl ?? 'https://portal.firmhouse.com/graphql';
    this.client = new _GraphQLClient(this.API_TOKEN, this.BASE_URL);
    this.ACCESS_TYPE = config?.accessType ?? Access.storefront;
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
   * Sends an authenticated raw request to API. This can be used for custom field selections or bulk queries/mutations.
   * @param graphQLQuery The GraphQL query
   * @param variables Variables to use in query
   * @returns The response from the API
   * @throws {@link NotFoundError} - When there is an entity not found error in the response
   * @throws {@link ValidationError} - When there are invalid fields
   * @throws {@link ServerError} - When the request fails
   */
  public async rawRequest(
    graphQLQuery: string,
    variables?: Record<string, unknown>
  ): Promise<unknown> {
    return this.client.request(graphQLQuery, variables);
  }

  /**
   * @public
   * Plan methods
   * @group Resources
   * @category Available with Storefront Access
   * @example
   * ```typescript
   * const plans = await client.plans.fetchAll();
   * ```
   */
  public get plans(): PlansResource {
    return this._plans;
  }

  /**
   * @public
   * Product methods
   * @group Resources
   * @category Available with Storefront Access
   * @example
   * ```typescript
   * const products = await client.products.fetchAll();
   * ```
   */
  public get products(): ProductsResource {
    return this._products;
  }

  /**
   * @public
   * Subscription methods.
   * @group Resources
   * @category Only Available with Write Access
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
   * @group Resources
   * @category Available with Storefront Access
   */
  public get carts(): CartsResource {
    return this._carts;
  }

  /**
   * @public
   * SelfServiceCenterToken methods
   * @group Resources
   * @category Available with Storefront Access
   */
  public get selfServiceCenterToken(): SelfServiceCenterTokenResource {
    return this._selfServiceCenterToken;
  }

  /**
   * @public
   * Invoice methods
   * @group Resources
   * @category Only Available with Write Access
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
   * @group Resources
   * @category Only Available with Write Access
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
