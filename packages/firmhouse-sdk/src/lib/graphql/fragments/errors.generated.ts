import * as Types from '../generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type ModelValidationErrorFieldsFragment = { attribute: string, message: string, path: Array<string> | null };

export const ModelValidationErrorFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ModelValidationErrorFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ModelValidationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attribute"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]} as unknown as DocumentNode<ModelValidationErrorFieldsFragment, unknown>;