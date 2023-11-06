import { BaseResource } from '../BaseResource';
import {
  AllPlansQuery,
  AllPlansQueryVariables,
  AllPlansDocument,
} from './allPlans.generated';
import { arrayFilterNulls } from '../../helpers/utils';

export type { AllPlansQuery, AllPlansQueryVariables };

/**
 * @public
 * Plan
 */
export type PlanType = NonNullable<
  NonNullable<NonNullable<AllPlansQuery['plans']>['nodes']>[0]
>;

/**
 * @public
 * Plan methods
 */
export class PlansResource extends BaseResource {
  /**
   * Retrieve Plans
   * @param params - Parameters to filter products by
   * @returns List of products with pagination info
   */
  public async fetchAll(params: AllPlansQueryVariables = {}) {
    const response = await this.client.request(AllPlansDocument, params);
    return {
      total: response.plans?.totalCount ?? 0,
      pageInfo: response.plans?.pageInfo,
      results: arrayFilterNulls(response.plans?.nodes) as PlanType[],
    };
  }
}
