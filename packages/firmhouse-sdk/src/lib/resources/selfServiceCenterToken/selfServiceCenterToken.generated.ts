import * as Types from '../../graphql/generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CreateSelfServiceCenterLoginTokenMutationVariables = Types.Exact<{
  email: Types.Scalars['String']['input'];
  returnUrl: Types.Scalars['String']['input'];
}>;


export type CreateSelfServiceCenterLoginTokenMutation = { createSelfServiceCenterLoginToken: { error: string | null, status: string | null } | null };


export const CreateSelfServiceCenterLoginTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSelfServiceCenterLoginToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"returnUrl"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSelfServiceCenterLoginToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"returnUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"returnUrl"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CreateSelfServiceCenterLoginTokenMutation, CreateSelfServiceCenterLoginTokenMutationVariables>;