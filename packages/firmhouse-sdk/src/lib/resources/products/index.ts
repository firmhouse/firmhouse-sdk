import { BaseResource } from '../BaseResource';
import { AllProductsDocument } from './allProducts.generated';
import { arrayFilterNulls } from '../../helpers/utils';
import { NotFoundError } from '../../helpers/errors';
import { FirmhouseProduct, PaginatedResponse } from '../../firmhouse';

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
  public async fetchAll(params?: {
    /**
     * Only list products that match the passed in ID
     */
    id?: string | null;
    /**
     * Only list products that match the passed in SKU
     */
    sku?: string | null;
    /**
     * Only list products that match the passed in Shopify variant ID
     */
    shopifyVariantId?: string | null;
    /**
     * Filter products to those that where updated since the given datetime.
     * @example
     * 2024-01-15T00:00:00+01:00
     */
    updatedSince?: string | null;
    /**
     * Return the elements in the list that come after the specified cursor.
     */
    after?: string | null;
    /**
     * Return the elements in the list that come before the specified cursor
     */
    before?: string | null;
    /**
     * Return the last n elements from the list.
     */
    last?: number | null;
    /**
     * Return the first n elements from the list
     */
    first?: number | null;
  }): Promise<PaginatedResponse<FirmhouseProduct>> {
    const response = await this._client.request(
      AllProductsDocument,
      params ?? {}
    );
    return {
      total: response.products?.totalCount ?? 0,
      pageInfo: response.products?.pageInfo,
      results: arrayFilterNulls(response.products?.nodes) as FirmhouseProduct[],
    };
  }

  /**
   * Retrieve a product by ID
   * @param id - ID of the product
   * @returns Product
   * @throws {@link NotFoundError} - When the product is not found
   */
  public async fetchById(id: string): Promise<FirmhouseProduct> {
    const { results } = await this.fetchAll({ id });
    if (results.length === 0) {
      throw new NotFoundError('Product not found');
    }
    return results[0];
  }
}
