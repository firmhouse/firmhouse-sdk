import * as Types from '../generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type SubscriptionIdentityFieldsFragment = { createdAt: string, payload: unknown, serviceProvider: string, status: string, verificationMethod: string | null };

export const SubscriptionIdentityFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubscriptionIdentityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubscriptionIdentity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"payload"}},{"kind":"Field","name":{"kind":"Name","value":"serviceProvider"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"verificationMethod"}}]}}]} as unknown as DocumentNode<SubscriptionIdentityFieldsFragment, unknown>;