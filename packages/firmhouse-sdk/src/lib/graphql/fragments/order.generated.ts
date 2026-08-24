/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type OrderStatus =
  /** The order is waiting for pre-confirmation before regular processing continues. */
  | 'AWAITING_CONFIRMATION'
  /** The order was cancelled. */
  | 'CANCELLED'
  /** The order was marked confirmed. */
  | 'CONFIRMED'
  /** The order has a draft state as long as the customer didn't complete their signup. */
  | 'DRAFT'
  /** The order was marked fulfilled. */
  | 'FULFILLED'
  /** The order still needs to be accepted by you or the customer. */
  | 'PENDING'
  /** The order is scheduled for a future date. */
  | 'SCHEDULED'
  /** The order was snoozed to be possibly confirmed at a later moment. */
  | 'SNOOZED';

export type OrderFieldsFragment = { acceptUrl: string | null, amountCents: number, cancelUrl: string | null, createdAt: string | null, discountCents: number | null, discountExclTaxCents: number | null, fulfilledAt: string | null, id: string | null, paid: boolean, shipmentDate: string | null, shippingCostsCents: number | null, shippingCostsExclTaxCents: number | null, shopifyDraftId: string | null, shopifyId: string | null, snoozeUrl: string | null, status: Types.OrderStatus, totalTaxCents: number, trackingCode: string | null, updatedAt: string | null };

export const OrderFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptUrl"}},{"kind":"Field","name":{"kind":"Name","value":"amountCents"}},{"kind":"Field","name":{"kind":"Name","value":"cancelUrl"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"discountCents"}},{"kind":"Field","name":{"kind":"Name","value":"discountExclTaxCents"}},{"kind":"Field","name":{"kind":"Name","value":"fulfilledAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paid"}},{"kind":"Field","name":{"kind":"Name","value":"shipmentDate"}},{"kind":"Field","name":{"kind":"Name","value":"shippingCostsCents"}},{"kind":"Field","name":{"kind":"Name","value":"shippingCostsExclTaxCents"}},{"kind":"Field","name":{"kind":"Name","value":"shopifyDraftId"}},{"kind":"Field","name":{"kind":"Name","value":"shopifyId"}},{"kind":"Field","name":{"kind":"Name","value":"snoozeUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"totalTaxCents"}},{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<OrderFieldsFragment, unknown>;