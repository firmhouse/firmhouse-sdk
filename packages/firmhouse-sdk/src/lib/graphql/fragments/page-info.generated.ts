import * as Types from '../generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type PageInfoFieldsFragment = { endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null };

export const PageInfoFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PageInfoFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PageInfo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]} as unknown as DocumentNode<PageInfoFieldsFragment, unknown>;