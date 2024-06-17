import { BaseResource } from '../BaseResource';
import { GetDiscountCodeDocument } from './discountCodes.generated';
import { NotFoundError } from '../../helpers/errors';
import { FirmhouseDiscountCode } from '../../firmhouse';

/**
 * @public
 * You can use discountCodes to access all the discount codes you defined in your project
 */
export class DiscountCodesResource extends BaseResource {
  /**
   * Retrieve discount code by code
   * @param code - Discount code to retrieve
   * @returns the current project
   */
  public async get(
    code: string,
    includeRelations?: {
      /**
       * Include autoSelectPlan relation
       */
      autoSelectPlan?: boolean;
      /**
       * Include promotion relation
       */
      promotion?: boolean;
    }
  ): Promise<FirmhouseDiscountCode> {
    const response = await this._client.request(GetDiscountCodeDocument, {
      code,
      includeAutoSelectPlan: includeRelations?.autoSelectPlan ?? false,
      includePromotion: includeRelations?.promotion ?? false,
    });
    if (!response.getDiscountCode) {
      throw new NotFoundError('Discount code not found');
    }
    return response.getDiscountCode;
  }
}
