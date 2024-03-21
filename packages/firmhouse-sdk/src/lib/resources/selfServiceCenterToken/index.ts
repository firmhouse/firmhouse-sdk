import { ServerError } from '../../helpers/errors';
import { BaseResource } from '../BaseResource';
import { CreateSelfServiceCenterLoginTokenDocument } from './selfServiceCenterToken.generated';

/**
 * @public
 * Self service center token methods
 */
export class SelfServiceCenterTokenResource extends BaseResource {
  /**
   * @public
   * Create self service center token
   * @param email - Customer's email address
   * @param returnUrl - Self service center url to use in the email
   * @returns The status of the request
   * @throws {@link ServerError} - Thrown if the request fails
   */
  public async create(email: string, returnUrl?: string) {
    const response = await this._client.request(
      CreateSelfServiceCenterLoginTokenDocument,
      { email, returnUrl: returnUrl ?? '' }
    );
    const { createSelfServiceCenterLoginToken } = response;

    if (createSelfServiceCenterLoginToken === null) {
      throw new ServerError('Could not create self service center token');
    }
    if (createSelfServiceCenterLoginToken.status !== 'success') {
      throw new ServerError(
        createSelfServiceCenterLoginToken.error ||
          'Could not create self service center token'
      );
    }
    return {
      status: response.createSelfServiceCenterLoginToken?.status ?? 'error',
    };
  }
}
