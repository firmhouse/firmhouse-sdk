import { ServerError } from '../../helpers/errors';
import { BaseResource } from '../BaseResource';
import { CreateSelfServiceCenterLoginTokenDocument } from './selfServiceCenterToken.generated';

/**
 * @public
 * You can use selfServiceCenterToken to create a token for accessing the self service center and sending it to the customer
 */
export class SelfServiceCenterTokenResource extends BaseResource {
  /**
   * @public
   * Create self service center token, and send it to the customer in an email.
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
