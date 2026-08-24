/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CollectionCaseStatus =
  /** The collection case is is closed. */
  | 'CLOSED'
  /** The collection case is still open. */
  | 'OPEN';

export type CollectionCaseFieldsFragment = { caseNumber: string, createdAt: string | null, id: string, status: Types.CollectionCaseStatus, updatedAt: string | null };

export const CollectionCaseFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CollectionCaseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CollectionCase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"caseNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CollectionCaseFieldsFragment, unknown>;