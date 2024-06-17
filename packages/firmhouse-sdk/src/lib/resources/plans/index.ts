import { BaseResource } from '../BaseResource';
import { AllPlansDocument } from './allPlans.generated';
import { arrayFilterNulls } from '../../helpers/utils';
import { FirmhousePlan, PaginatedResponse } from '../../firmhouse';

/**
 * @public
 * You can use the plans resource to access plans in the Firmhouse API.
 */
export class PlansResource extends BaseResource {
  /**
   * Retrieve Plans
   * @param params - Parameters to filter products by
   * @returns List of products with pagination info
   */
  public async fetchAll(params?: {
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
  }): Promise<PaginatedResponse<FirmhousePlan>> {
    const response = await this._client.request(AllPlansDocument, params ?? {});
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
