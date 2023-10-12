import { BaseResource } from '../BaseResource';
import {
  AllPlansDocument,
  AllPlansQueryVariables,
} from '../../graphql/generated';
import { arrayFilterNulls } from '../../helpers/utils';

type AllPlansResponse = Awaited<
ReturnType<InstanceType<typeof PlansResource>['fetchAll']>
>;

export type PlanType = AllPlansResponse['results'][0];

export class PlansResource extends BaseResource {
  /**
   * Retrieve Plans
   * @param params Parameters to filter products by
   * @returns List of products with pagination info
   */
  public async fetchAll(params: AllPlansQueryVariables = {}) {
    const response = await this.client.request(AllPlansDocument, params);
    return {
      total: response.plans?.totalCount ?? 0,
      pageInfo: response.plans?.pageInfo,
      results: arrayFilterNulls(response.plans?.nodes)
    }
  }

}
