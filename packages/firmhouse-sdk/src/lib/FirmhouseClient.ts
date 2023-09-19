import GraphQLClient from './helpers/GraphQLClient';
import { ProductsResource } from './resources/products';
import {
  SubscriptionsResource,
} from './resources/subscriptions';

export type FirmhouseConfig = {
  apiToken: string;
  baseUrl?: string;
};

export class FirmhouseClient {
  private readonly API_TOKEN: string;
  private readonly BASE_URL: string;
  private client: GraphQLClient;
  public products: ProductsResource;
  public subscriptions: SubscriptionsResource;

  constructor(config: FirmhouseConfig) {
    this.API_TOKEN = config.apiToken;
    this.BASE_URL = config?.baseUrl ?? 'https://portal.firmhouse.com/graphql';
    this.client = new GraphQLClient(this.API_TOKEN, this.BASE_URL);
    this.products = new ProductsResource(this.client);
    this.subscriptions = new SubscriptionsResource(this.client);
  }
}
