import { BaseResource } from '../BaseResource';
import {
  AllProductsDocument,
  AllProductsQueryVariables,
  AllProductsQuery,
} from './allProducts.generated';
import { arrayFilterNulls } from '../../helpers/utils';
import { NotFoundError } from '../../helpers/errors';

export type { AllProductsQuery, AllProductsQueryVariables };

/**
 * @public
 * Product
 */
export type ProductType = NonNullable<
  NonNullable<NonNullable<AllProductsQuery['products']>['nodes']>[0]
>;

/**
 * @public
 * Return type of products.fetchAll
 */
export type AllProductsResponse = Awaited<
  ReturnType<InstanceType<typeof ProductsResource>['fetchAll']>
>;

/**
 * @public
 * Product methods
 */
export class ProductsResource extends BaseResource {
  /**
   * Retrieve products
   * @param params - Parameters to filter products by
   * @returns List of products with pagination info
   */
  public async fetchAll(params: AllProductsQueryVariables = {}) {
    const response = await this.client.request(AllProductsDocument, params);
    return {
      total: response.products?.totalCount ?? 0,
      pageInfo: response.products?.pageInfo,
      results: arrayFilterNulls(response.products?.nodes) as ProductType[],
    };
  }

  /**
   * Retrieve a product by ID
   * @param id - ID of the product
   * @returns Product
   */
  public async fetchById(id: string) {
    const { results } = await this.fetchAll({ id });
    if (results.length === 0) {
      throw new NotFoundError('Product not found');
    }
    return results[0];
  }
}
