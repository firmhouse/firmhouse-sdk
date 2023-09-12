import { BaseResource } from '../BaseResource';
import { AllProductsDocument, AllProductsQueryVariables } from '../../graphql/generated';
import { arrayFilterNulls } from '../../helpers/utils';

export type ProductsType = Awaited<ReturnType<InstanceType<typeof ProductsResource>['fetchAll']>>
export type ProductType = Awaited<ReturnType<InstanceType<typeof ProductsResource>['fetchById']>>
export class ProductsResource extends BaseResource {
  public async fetchAll(params: AllProductsQueryVariables = {}) {
    const response = await this.client.request(AllProductsDocument, params);
    return arrayFilterNulls(response.products?.nodes)
  }

  public async fetchById(id: string) {
    const products = await this.fetchAll({ id });
    if(products.length === 0) return null;
    return products[0];
  }
}
