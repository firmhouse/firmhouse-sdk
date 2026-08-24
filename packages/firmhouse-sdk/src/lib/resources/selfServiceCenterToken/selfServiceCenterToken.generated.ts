/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../../graphql/generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CreateSelfServiceCenterLoginTokenMutation_createSelfServiceCenterLoginToken_CreateSelfServiceCenterLoginTokenPayload = { error: string | null, status: string | null };

export type CreateSelfServiceCenterLoginTokenMutation_Mutation = { createSelfServiceCenterLoginToken: CreateSelfServiceCenterLoginTokenMutation_createSelfServiceCenterLoginToken_CreateSelfServiceCenterLoginTokenPayload | null };


export type CreateSelfServiceCenterLoginTokenMutationVariables = Exact<{
  email: string;
  returnUrl: string;
}>;


export type CreateSelfServiceCenterLoginTokenMutation = CreateSelfServiceCenterLoginTokenMutation_Mutation;


export const CreateSelfServiceCenterLoginTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSelfServiceCenterLoginToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"returnUrl"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSelfServiceCenterLoginToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"returnUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"returnUrl"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CreateSelfServiceCenterLoginTokenMutation, CreateSelfServiceCenterLoginTokenMutationVariables>;