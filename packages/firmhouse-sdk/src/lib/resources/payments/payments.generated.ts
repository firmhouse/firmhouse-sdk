/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../../graphql/generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type PaymentFailureReasonEnum =
  /** The account is blocked for debits. */
  | 'BLOCKED_ACCOUNT_FOR_DEBIT'
  /** The account is closed. */
  | 'CLOSED_ACCOUNT'
  /** The account holder is deceased. */
  | 'CUSTOMER_DIED'
  /** The direct payment could not be completed. */
  | 'DIRECT_PAYMENT_FAILURE'
  /** A dispute over the payment was lost. */
  | 'DISPUTE_LOST'
  /** The account details are incorrect. */
  | 'INCORRECT_ACCOUNT'
  /** The account did not have enough balance. */
  | 'INSUFFICIENT_FUNDS'
  /** The mandate is no longer valid. */
  | 'INVALID_MANDATE'
  /** The payment provider did not specify a reason. */
  | 'NOT_SPECIFIED'
  /** The customer failed to authenticate the payment. */
  | 'PAYMENT_INTENT_AUTHENTICATION_FAILURE'
  /** The customer refused the payment. */
  | 'REFUSED_BY_CUSTOMER'
  /** The bank rejected the payment. */
  | 'REJECTED_BY_BANK'
  /** The customer reverted the payment. */
  | 'REVERTED_BY_CUSTOMER';

export type PaymentStatusEnum =
  /** The payment was cancelled. */
  | 'CANCELLED'
  /** The payment has been charged back. */
  | 'CHARGED_BACK'
  /** The payment has expired. */
  | 'EXPIRED'
  /** The payment has failed. */
  | 'FAILED'
  /** The payment is open. */
  | 'OPEN'
  /** The payment has been successfully paid in full. */
  | 'PAID'
  /** The payment has been successfully paid in full. */
  | 'PAIDOUT'
  /** The payment has been partially refunded. */
  | 'PARTIALLY_REFUNDED'
  /** The payment is pending. */
  | 'PENDING'
  /** The payment has been refunded in full. */
  | 'REFUNDED';

export type SubscriptionStatus =
  /** The subscription has completed signup process and has been activated. Active subscription. */
  | 'ACTIVATED'
  /**
   * The subscription started but has not completed. cancellation process yet (only
   * for projects with two-step cancellation feature enabled).
   */
  | 'CANCELLATION_IN_PROGRESS'
  /** The subscription has been cancelled. */
  | 'CANCELLED'
  /** Deprecated. */
  | 'CUSTOMER_UNSUBSCRIBED'
  /** The subscription (or a cart) created on checkout that has not completed signup process. */
  | 'DRAFT'
  /** The subscription has completed signup process by has not yet been activated (for manual activation strategy). */
  | 'INACTIVE'
  /** This status can be assigned to customers that do a one-time purchase. */
  | 'ONE_TIME_PURCHASE'
  /** The subscription has been paused. */
  | 'PAUSED'
  /** The subscription is marked to be automatically cancelled on the next billing moment after the prepaid commitment ends. */
  | 'PENDING_CANCELLATION'
  /** The subscription completed first step of two step signup process. */
  | 'PENDING_CUSTOMER_COMPLETION'
  /** This subscription is currently in the process of completing the initial payment. */
  | 'PENDING_INITIAL_PAYMENT'
  /** The subscription has been rejected (for manual activation strategy). */
  | 'REJECTED'
  /** The subscription was automatically stopped because the maximum plan commitment was reached */
  | 'STOPPED';

export type CreateAdyenPaymentSessionMutation_createAdyenPaymentSession_CreateAdyenPaymentSessionPayload_session_AdyenPaymentSession_cardConfiguration_AdyenCardConfiguration = { hasHolderName: boolean, holderNameRequired: boolean };

export type CreateAdyenPaymentSessionMutation_createAdyenPaymentSession_CreateAdyenPaymentSessionPayload_session_AdyenPaymentSession_googlePayConfiguration_AdyenGooglePayConfiguration = { authJWT: string | null, gatewayMerchantId: string | null, merchantId: string | null, merchantName: string | null, merchantOrigin: string | null };

export type CreateAdyenPaymentSessionMutation_createAdyenPaymentSession_CreateAdyenPaymentSessionPayload_session_AdyenPaymentSession = { sessionId: string, sessionData: string, expiresAt: string, clientKey: string, environment: string, locale: string | null, countryCode: string | null, amountCents: number, currency: string, successUrl: string | null, cardConfiguration: CreateAdyenPaymentSessionMutation_createAdyenPaymentSession_CreateAdyenPaymentSessionPayload_session_AdyenPaymentSession_cardConfiguration_AdyenCardConfiguration, googlePayConfiguration: CreateAdyenPaymentSessionMutation_createAdyenPaymentSession_CreateAdyenPaymentSessionPayload_session_AdyenPaymentSession_googlePayConfiguration_AdyenGooglePayConfiguration | null };

export type CreateAdyenPaymentSessionMutation_createAdyenPaymentSession_CreateAdyenPaymentSessionPayload_errors_ModelValidationError = { attribute: string, message: string, path: Array<string> | null };

export type CreateAdyenPaymentSessionMutation_createAdyenPaymentSession_CreateAdyenPaymentSessionPayload = { session: CreateAdyenPaymentSessionMutation_createAdyenPaymentSession_CreateAdyenPaymentSessionPayload_session_AdyenPaymentSession | null, errors: Array<CreateAdyenPaymentSessionMutation_createAdyenPaymentSession_CreateAdyenPaymentSessionPayload_errors_ModelValidationError> };

export type CreateAdyenPaymentSessionMutation_Mutation = { createAdyenPaymentSession: CreateAdyenPaymentSessionMutation_createAdyenPaymentSession_CreateAdyenPaymentSessionPayload | null };


export type CreateAdyenPaymentSessionMutationVariables = Exact<{
  paymentToken: string | number;
}>;


export type CreateAdyenPaymentSessionMutation = CreateAdyenPaymentSessionMutation_Mutation;

export type GetCheckoutPaymentStatusQuery_getCheckoutPaymentStatus_CheckoutPaymentStatus = { paymentStatus: Types.PaymentStatusEnum, failureReason: Types.PaymentFailureReasonEnum | null, subscriptionStatus: Types.SubscriptionStatus, successUrl: string | null };

export type GetCheckoutPaymentStatusQuery_Query = { getCheckoutPaymentStatus: GetCheckoutPaymentStatusQuery_getCheckoutPaymentStatus_CheckoutPaymentStatus | null };


export type GetCheckoutPaymentStatusQueryVariables = Exact<{
  paymentToken: string | number;
}>;


export type GetCheckoutPaymentStatusQuery = GetCheckoutPaymentStatusQuery_Query;


export const CreateAdyenPaymentSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createAdyenPaymentSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paymentToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAdyenPaymentSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"paymentToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paymentToken"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"session"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionData"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"clientKey"}},{"kind":"Field","name":{"kind":"Name","value":"environment"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"amountCents"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"successUrl"}},{"kind":"Field","name":{"kind":"Name","value":"cardConfiguration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"holderNameRequired"}}]}},{"kind":"Field","name":{"kind":"Name","value":"googlePayConfiguration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authJWT"}},{"kind":"Field","name":{"kind":"Name","value":"gatewayMerchantId"}},{"kind":"Field","name":{"kind":"Name","value":"merchantId"}},{"kind":"Field","name":{"kind":"Name","value":"merchantName"}},{"kind":"Field","name":{"kind":"Name","value":"merchantOrigin"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ModelValidationErrorFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ModelValidationErrorFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ModelValidationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attribute"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]} as unknown as DocumentNode<CreateAdyenPaymentSessionMutation, CreateAdyenPaymentSessionMutationVariables>;
export const GetCheckoutPaymentStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCheckoutPaymentStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paymentToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCheckoutPaymentStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paymentToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paymentToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptionStatus"}},{"kind":"Field","name":{"kind":"Name","value":"successUrl"}}]}}]}}]} as unknown as DocumentNode<GetCheckoutPaymentStatusQuery, GetCheckoutPaymentStatusQueryVariables>;