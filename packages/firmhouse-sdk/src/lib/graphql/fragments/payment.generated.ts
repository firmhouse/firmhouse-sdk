/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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

export type PaymentTypeEnum =
  /** Payment used to update a customers payment method. */
  | 'AUTHORIZATION'
  /** An on-session payment performed by a customer to pay for an invoice manually. */
  | 'DIRECT_PAYMENT'
  /** An on-session payment performed by a customer to pay for an invoice manually that stores the payment method for all future subscription payments. */
  | 'DIRECT_PAYMENT_WITH_AUTHORIZATION'
  /** Payment made outside the Firmhouse platform, such as direct transfers from customers to your account, bypassing Firmhouse usual payment flow. */
  | 'EXTERNAL_PAYMENT'
  /** Initial payment made directly during checkout. */
  | 'INITIAL'
  /** Externally created recurring payment. */
  | 'MONTHLY'
  /** Recurring charge made by our billing cycle. */
  | 'RECURRING'
  /** An (automated) retry of a failed payment. */
  | 'RETRY'
  /** A non-recurring, portal or API-triggered payment. */
  | 'SINGLE_CHARGE';

export type RefundStatus =
  /** The refund was canceled. */
  | 'CANCELED'
  /** The refund has failed. For example due to a closed bank or card. The payment service provider will return the amount to your account balance. */
  | 'FAILED'
  /** The refund is sent to the payment service provider. In some payment service providers you can still cancel the refund at this stage. */
  | 'PENDING'
  /** The refund is being processed. */
  | 'PROCESSING'
  /** The refund is queued to be processed. A refund might be in this status when your account balance at the payment provider is not sufficient to initiate the refund at this time. */
  | 'QUEUED'
  /** The refund was succesful and has been settled to your customer. */
  | 'SUCCEEDED';

export type PaymentFieldsFragment_Payment_refunds_Refund = { amountCents: number, id: string, paymentProviderObjectId: string | null, reason: string | null, refundedAt: string | null, status: Types.RefundStatus };

export type PaymentFieldsFragment = { amountCents: number, amountWithSymbol: string, createdAt: string, id: string, paymentId: string | null, paymentStatus: Types.PaymentStatusEnum, paymentType: Types.PaymentTypeEnum, retryPaymentUrl: string | null, token: string, updatedAt: string, refunds: Array<PaymentFieldsFragment_Payment_refunds_Refund> | null };

export const PaymentFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PaymentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amountCents"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentId"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"paymentType"}},{"kind":"Field","name":{"kind":"Name","value":"retryPaymentUrl"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"refunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RefundFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RefundFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Refund"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amountCents"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentProviderObjectId"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"refundedAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<PaymentFieldsFragment, unknown>;