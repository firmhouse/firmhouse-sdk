import * as Types from '../generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type InvoiceReminderFieldsFragment = { id: string, remindOn: string, remindedAt: string | null, reminderNumber: number };

export const InvoiceReminderFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvoiceReminderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvoiceReminder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"remindOn"}},{"kind":"Field","name":{"kind":"Name","value":"remindedAt"}},{"kind":"Field","name":{"kind":"Name","value":"reminderNumber"}}]}}]} as unknown as DocumentNode<InvoiceReminderFieldsFragment, unknown>;