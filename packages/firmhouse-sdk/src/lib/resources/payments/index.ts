import { ServerError, ValidationError } from '../../helpers/errors';
import { BaseResource } from '../BaseResource';
import {
  CreateAdyenPaymentSessionDocument,
  GetCheckoutPaymentStatusDocument,
  type CreateAdyenPaymentSessionMutation_createAdyenPaymentSession_CreateAdyenPaymentSessionPayload_session_AdyenPaymentSession,
  type GetCheckoutPaymentStatusQuery_getCheckoutPaymentStatus_CheckoutPaymentStatus,
} from './payments.generated';

/**
 * @public
 * Browser-safe configuration for initialising Adyen Web Drop-in with a payment session.
 */
export type FirmhouseAdyenPaymentSession =
  CreateAdyenPaymentSessionMutation_createAdyenPaymentSession_CreateAdyenPaymentSessionPayload_session_AdyenPaymentSession;

/**
 * @public
 * The authoritative outcome of a checkout payment.
 */
export type FirmhouseCheckoutPaymentStatus =
  GetCheckoutPaymentStatusQuery_getCheckoutPaymentStatus_CheckoutPaymentStatus;

/**
 * @public
 * Options for polling a checkout payment until its outcome is known.
 */
export interface WaitForCheckoutPaymentStatusOptions {
  /**
   * Milliseconds between polls. Defaults to `2000`.
   */
  intervalMs?: number;
  /**
   * Milliseconds to keep polling before giving up. Defaults to `120000`.
   */
  timeoutMs?: number;
}

const PENDING_PAYMENT_STATUSES = ['OPEN', 'PENDING'];

/**
 * @public
 * Checkout payment methods for storefronts that render the payment step themselves
 * instead of redirecting the customer to a hosted payment page.
 * @remarks
 * Every method here requires a storefront access token and the subscription token of
 * the checkout. A client configured with `Access.write` is rejected by the API.
 */
export class PaymentsResource extends BaseResource {
  /**
   * @public
   * Creates an Adyen payment session for a checkout payment.
   * @remarks
   * Requesting a session for the same payment again returns the session that is still
   * active, so a customer who reloads the checkout page keeps the same session.
   * @param subscriptionToken - Token of the subscription the payment belongs to
   * @param paymentToken - Token of the payment to pay for
   * @returns The browser-safe session configuration for Adyen Web Drop-in
   * @throws {@link ValidationError} - Thrown when a session cannot be created for this payment
   * @throws {@link ServerError} - Thrown if the request fails
   * @throws {@link NotFoundError} - Thrown if the payment is not found
   */
  public async createAdyenSession(
    subscriptionToken: string,
    paymentToken: string,
  ): Promise<FirmhouseAdyenPaymentSession> {
    const response = await this._client.request(
      CreateAdyenPaymentSessionDocument,
      { paymentToken },
      this.getSubscriptionTokenHeader(subscriptionToken),
    );
    const { createAdyenPaymentSession } = response;

    if (createAdyenPaymentSession === null) {
      throw new ServerError('Could not create an Adyen payment session');
    }

    const { errors, session } = createAdyenPaymentSession;
    if (errors && errors.length > 0) {
      throw new ValidationError(errors);
    }

    if (session === null) {
      throw new ServerError('Could not create an Adyen payment session');
    }

    return session;
  }

  /**
   * @public
   * Fetches the authoritative outcome of a checkout payment.
   * @remarks
   * Payment providers confirm payments through a webhook after the customer leaves the
   * payment form, so read this instead of relying on the browser callback of Drop-in.
   * @param subscriptionToken - Token of the subscription the payment belongs to
   * @param paymentToken - Token of the payment to return the status for
   * @returns The payment status, subscription status and the URL to send the customer to
   * @throws {@link ServerError} - Thrown if the status could not be read
   * @throws {@link NotFoundError} - Thrown if the payment is not found
   */
  public async getCheckoutStatus(
    subscriptionToken: string,
    paymentToken: string,
  ): Promise<FirmhouseCheckoutPaymentStatus> {
    const response = await this._client.request(
      GetCheckoutPaymentStatusDocument,
      { paymentToken },
      this.getSubscriptionTokenHeader(subscriptionToken),
    );

    if (!response.getCheckoutPaymentStatus) {
      throw new ServerError('Could not read the checkout payment status');
    }

    return response.getCheckoutPaymentStatus;
  }

  /**
   * @public
   * Polls the checkout payment status until the payment is no longer open or pending.
   * @remarks
   * Call this after Drop-in reports that it is done, or after the customer returns from
   * a redirect, and send them to `successUrl` once the payment is paid. Returns the last
   * status that was read when the timeout is reached, so always check `paymentStatus`.
   * @param subscriptionToken - Token of the subscription the payment belongs to
   * @param paymentToken - Token of the payment to return the status for
   * @param options - Polling interval and timeout
   * @returns The last checkout payment status that was read
   * @throws {@link ServerError} - Thrown if the status could not be read
   * @throws {@link NotFoundError} - Thrown if the payment is not found
   */
  public async waitForCheckoutStatus(
    subscriptionToken: string,
    paymentToken: string,
    options?: WaitForCheckoutPaymentStatusOptions,
  ): Promise<FirmhouseCheckoutPaymentStatus> {
    const intervalMs = options?.intervalMs ?? 2000;
    const timeoutMs = options?.timeoutMs ?? 120000;
    const deadline = Date.now() + timeoutMs;

    let status = await this.getCheckoutStatus(subscriptionToken, paymentToken);
    while (
      PENDING_PAYMENT_STATUSES.includes(status.paymentStatus) &&
      Date.now() + intervalMs < deadline
    ) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
      status = await this.getCheckoutStatus(subscriptionToken, paymentToken);
    }

    return status;
  }
}
