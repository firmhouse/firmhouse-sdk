import { BaseResource } from '../BaseResource';
import { AllPlansQueryVariables, AllPlansDocument } from './allPlans.generated';
import { arrayFilterNulls } from '../../helpers/utils';
import { FirmhousePlan, PaginatedResponse } from '../../firmhouse';

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
  ): Promise<PaginatedResponse<FirmhousePlan>> {
    const response = await this._client.request(AllPlansDocument, params);
    return {
      total: response.plans?.totalCount ?? 0,
      pageInfo: response.plans?.pageInfo ?? {
        endCursor: null,
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
      },
      results: arrayFilterNulls(response.plans?.nodes) as FirmhousePlan[],
    };
  }
}
