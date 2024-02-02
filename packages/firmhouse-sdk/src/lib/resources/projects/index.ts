import { BaseResource } from '../BaseResource';
import {
  GetCurrentProjectQuery,
  GetCurrentProjectDocument,
} from './projects.generated';
import { NotFoundError } from '../../helpers/errors';

/**
 * @public
 * Project
 */
export type ProjectType = NonNullable<
  NonNullable<GetCurrentProjectQuery['getCurrentProject']>
>;

/**
 * @public
 * Project methods
 */
export class ProjectsResource extends BaseResource {
  /**
   * Retrieve current project
   * @param includeRelations - Relations to include in the response
   * @returns the current project
   */
  public async getCurrent(includeRelations?: {
    taxRates?: boolean;
    extraFields?: boolean;
    promotions?: boolean;
  }) {
    const response = await this.client.request(GetCurrentProjectDocument, {
      includeTaxRates: includeRelations?.taxRates ?? false,
      includeExtraFields: includeRelations?.extraFields ?? false,
      includePromotions: includeRelations?.promotions ?? false,
    });
    if (!response.getCurrentProject) {
      throw new NotFoundError('Project not found');
    }
    return response.getCurrentProject;
  }
}
