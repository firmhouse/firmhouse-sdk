/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type DiscountCodeFieldsFragment = { id: string, promotionId: string, redeemable: boolean, code: string, createdAt: string, expired: boolean, maxTimesUsed: number | null, metadata: unknown, updatedAt: string };

export const DiscountCodeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscountCodeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscountCode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"promotionId"}},{"kind":"Field","name":{"kind":"Name","value":"redeemable"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"expired"}},{"kind":"Field","name":{"kind":"Name","value":"maxTimesUsed"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<DiscountCodeFieldsFragment, unknown>;