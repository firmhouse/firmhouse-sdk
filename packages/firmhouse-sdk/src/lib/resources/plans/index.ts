import { BaseResource } from '../BaseResource';
import {
  AllPlansQuery,
  AllPlansQueryVariables,
  AllPlansDocument,
} from './allPlans.generated';
import { arrayFilterNulls } from '../../helpers/utils';
import { PaginatedResponse } from '../../firmhouse';
import { ResolveObject } from '../../helpers/types';

export type { AllPlansQuery, AllPlansQueryVariables };

/**
 * @public
 * Plan
 */
export type PlanType = ResolveObject<
  NonNullable<NonNullable<NonNullable<AllPlansQuery['plans']>['nodes']>[0]>
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
  public async fetchAll(
    params: AllPlansQueryVariables = {}
  ): Promise<PaginatedResponse<PlanType>> {
    const response = await this._client.request(AllPlansDocument, params);
    return {
      total: response.plans?.totalCount ?? 0,
      pageInfo: response.plans?.pageInfo ?? {
        endCursor: null,
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
      },
      results: arrayFilterNulls(response.plans?.nodes) as PlanType[],
    };
  }
}
