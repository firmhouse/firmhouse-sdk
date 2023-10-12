import { BaseResource } from '../BaseResource';
import {
  AllProductsDocument,
  AllProductsQueryVariables,
} from '../../graphql/generated';
import { arrayFilterNulls } from '../../helpers/utils';
import { NotFoundError } from '../../helpers/errors';


export type AllProductsResponse = Awaited<
ReturnType<InstanceType<typeof ProductsResource>['fetchAll']>
>;
export type ProductType = AllProductsResponse['results'][0];

export class ProductsResource extends BaseResource {
  /**
   * Retrieve products
   * @param params Parameters to filter products by
   * @returns List of products with pagination info
   */
  public async fetchAll(params: AllProductsQueryVariables = {}) {
    const response = await this.client.request(AllProductsDocument, params);
    return {
      total: response.products?.totalCount ?? 0,
      pageInfo: response.products?.pageInfo,
      results: arrayFilterNulls(response.products?.nodes)
    }
  }


  /**
   * Retrieve a product by ID
   * @param id ID of the product
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
