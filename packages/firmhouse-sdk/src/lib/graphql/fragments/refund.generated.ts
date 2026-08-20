/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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

export type RefundFieldsFragment = { amountCents: number, id: string, paymentProviderObjectId: string | null, reason: string | null, refundedAt: string | null, status: Types.RefundStatus };

export const RefundFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RefundFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Refund"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amountCents"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentProviderObjectId"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"refundedAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<RefundFieldsFragment, unknown>;