import { BaseResource } from '../BaseResource';
import {
  AllProductsDocument,
  AllProductsQueryVariables,
} from '../../graphql/generated';
import { arrayFilterNulls } from '../../helpers/utils';
import { NotFoundError } from '../../helpers/errors';

export type ProductsType = Awaited<
  ReturnType<InstanceType<typeof ProductsResource>['fetchAll']>
>;
export type ProductType = Awaited<
  ReturnType<InstanceType<typeof ProductsResource>['fetchById']>
>;
export class ProductsResource extends BaseResource {
  /**
   * Retrieve products
   * @param params Parameters to filter products by
   * @returns List of products
   */
  public async fetchAll(params: AllProductsQueryVariables = {}) {
    const response = await this.client.request(AllProductsDocument, params);
    return arrayFilterNulls(response.products?.nodes);
  }


  /**
   * Retrieve a product by ID
   * @param id ID of the product
   * @returns Product
   */
  public async fetchById(id: string) {
    const products = await this.fetchAll({ id });
    if (products.length === 0) {
      throw new NotFoundError('Product not found');
    }
    return products[0];
  }
}
