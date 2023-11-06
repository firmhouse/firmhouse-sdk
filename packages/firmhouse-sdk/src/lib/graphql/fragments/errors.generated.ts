import * as Types from '../generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type ModelValidationErrorFragmentFragment = { attribute: string, message: string, path: Array<string> | null };

export const ModelValidationErrorFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ModelValidationErrorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ModelValidationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attribute"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]} as unknown as DocumentNode<ModelValidationErrorFragmentFragment, unknown>;