/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type InvoiceStatusEnum =
  /** The invoice payment was cancelled. */
  | 'CANCELLED'
  /** The invoice payment has been charged back. */
  | 'CHARGED_BACK'
  /** The invoice payment has expired. */
  | 'EXPIRED'
  /** The invoice payment has failed. */
  | 'FAILED'
  /** The invoice payment is open. */
  | 'OPEN'
  /** The invoice has been successfully paid in full. */
  | 'PAID'
  /** The invoice has been successfully paid in full. */
  | 'PAIDOUT'
  /** The invoice has been partially paid. */
  | 'PARTIALLY_PAID'
  /** The invoice has been partially refunded. */
  | 'PARTIALLY_REFUNDED'
  /** The invoice payment is pending. */
  | 'PENDING'
  /** The invoice has been refunded in full. */
  | 'REFUNDED'
  /** The invoice has been deemed uncollectible. */
  | 'UNCOLLECTIBLE';

export type InvoiceFieldsFragment = { city: string | null, companyName: string | null, country: string | null, createdAt: string, currency: string | null, description: string | null, detailsUrl: string, externalUrl: string | null, fullAddress: string | null, fullName: string | null, id: string, invoiceNumber: string, invoiceStatus: Types.InvoiceStatusEnum, invoicedAt: string | null, phoneNumber: string | null, salutation: string | null, state: string | null, subscriptionId: string, taxPercentage: number | null, totalAmountCents: number, totalTaxAmountCents: number, zipcode: string | null };

export const InvoiceFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvoiceFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Invoice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"companyName"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"detailsUrl"}},{"kind":"Field","name":{"kind":"Name","value":"externalUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceNumber"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceStatus"}},{"kind":"Field","name":{"kind":"Name","value":"invoicedAt"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"salutation"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"taxPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmountCents"}},{"kind":"Field","name":{"kind":"Name","value":"totalTaxAmountCents"}},{"kind":"Field","name":{"kind":"Name","value":"zipcode"}}]}}]} as unknown as DocumentNode<InvoiceFieldsFragment, unknown>;