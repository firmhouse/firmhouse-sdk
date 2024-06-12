import { BaseResource } from '../BaseResource';
import { GetCurrentProjectDocument } from './projects.generated';
import { NotFoundError } from '../../helpers/errors';
import { FirmhouseProject } from '../../firmhouse';

/**
 * @public
 * You can use projects to retrieve the details of your project
 */
export class ProjectsResource extends BaseResource {
  /**
   * Retrieve current project
   * @param includeRelations - Relations to include in the response
   * @returns the current project
   */
  public async getCurrent(includeRelations?: {
    /**
     * Include taxRates relation
     */
    taxRates?: boolean;
    /**
     * Include extraFields relation
     */
    extraFields?: boolean;
    /**
     * Include promotions relation
     */
    promotions?: boolean;
  }): Promise<FirmhouseProject> {
    const response = await this._client.request(GetCurrentProjectDocument, {
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
