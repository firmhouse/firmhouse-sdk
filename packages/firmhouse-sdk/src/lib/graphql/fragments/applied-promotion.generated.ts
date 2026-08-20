/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AppliedPromotionDeactivationStrategy =
  /** Gets deactivated when used x number or times. */
  | 'TIMES'
  /** Never gets deactivated based on usage. */
  | 'UNLIMITED'
  /** Gets deactivated after a monetary limit has been reached. */
  | 'VALUE';

export type PromotionDiscountTypeEnum =
  /** Uses a fixed amount to calculate the discount. (e.g. €10 off). Requires amount. */
  | 'FIXED_AMOUNT'
  /** Uses percentage value to calculate the discount (e.g 10% off). Used by default. Requires Percent. */
  | 'PERCENTAGE';

export type AppliedPromotionFieldsFragment_AppliedPromotion_promotion_BillingCyclePromotion = { __typename: 'BillingCyclePromotion', activated: boolean, amountCents: number | null, autoApply: boolean, deactivateAfterAmountIncludingTaxCents: number | null, deactivateAfterTimes: number | null, deactivationStrategy: Types.AppliedPromotionDeactivationStrategy, discountType: Types.PromotionDiscountTypeEnum | null, id: string, percentDiscount: number | null, publicName: string | null, title: string };

export type AppliedPromotionFieldsFragment_AppliedPromotion_promotion_OrderDiscountPromotion = { __typename: 'OrderDiscountPromotion', activated: boolean, amountCents: number | null, autoApply: boolean, deactivateAfterAmountIncludingTaxCents: number | null, deactivateAfterTimes: number | null, deactivationStrategy: Types.AppliedPromotionDeactivationStrategy, discountType: Types.PromotionDiscountTypeEnum | null, id: string, percentDiscount: number | null, publicName: string | null, title: string };

export type AppliedPromotionFieldsFragment_AppliedPromotion_promotion =
  | AppliedPromotionFieldsFragment_AppliedPromotion_promotion_BillingCyclePromotion
  | AppliedPromotionFieldsFragment_AppliedPromotion_promotion_OrderDiscountPromotion
;

export type AppliedPromotionFields_AppliedBillingCyclePromotion_Fragment = { active: boolean, amountUsedIncludingTaxCents: number, deactivateAfterAmountIncludingTaxCents: number | null, deactivateAfterTimes: number | null, deactivationStrategy: Types.AppliedPromotionDeactivationStrategy, id: string, timesUsed: number, promotion: AppliedPromotionFieldsFragment_AppliedPromotion_promotion };

export type AppliedPromotionFields_AppliedOrderDiscountPromotion_Fragment = { active: boolean, amountUsedIncludingTaxCents: number, deactivateAfterAmountIncludingTaxCents: number | null, deactivateAfterTimes: number | null, deactivationStrategy: Types.AppliedPromotionDeactivationStrategy, id: string, timesUsed: number, promotion: AppliedPromotionFieldsFragment_AppliedPromotion_promotion };

export type AppliedPromotionFieldsFragment =
  | AppliedPromotionFields_AppliedBillingCyclePromotion_Fragment
  | AppliedPromotionFields_AppliedOrderDiscountPromotion_Fragment
;

export const AppliedPromotionFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AppliedPromotionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AppliedPromotion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"amountUsedIncludingTaxCents"}},{"kind":"Field","name":{"kind":"Name","value":"deactivateAfterAmountIncludingTaxCents"}},{"kind":"Field","name":{"kind":"Name","value":"deactivateAfterTimes"}},{"kind":"Field","name":{"kind":"Name","value":"deactivationStrategy"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timesUsed"}},{"kind":"Field","name":{"kind":"Name","value":"promotion"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PromotionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BillingCyclePromotionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BillingCyclePromotion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activated"}},{"kind":"Field","name":{"kind":"Name","value":"autoApply"}},{"kind":"Field","name":{"kind":"Name","value":"deactivateAfterAmountIncludingTaxCents"}},{"kind":"Field","name":{"kind":"Name","value":"deactivateAfterTimes"}},{"kind":"Field","name":{"kind":"Name","value":"deactivationStrategy"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"percentDiscount"}},{"kind":"Field","name":{"kind":"Name","value":"publicName"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderDiscountPromotionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderDiscountPromotion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activated"}},{"kind":"Field","name":{"kind":"Name","value":"autoApply"}},{"kind":"Field","name":{"kind":"Name","value":"deactivateAfterAmountIncludingTaxCents"}},{"kind":"Field","name":{"kind":"Name","value":"deactivateAfterTimes"}},{"kind":"Field","name":{"kind":"Name","value":"deactivationStrategy"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"percentDiscount"}},{"kind":"Field","name":{"kind":"Name","value":"publicName"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PromotionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Promotion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"activated"}},{"kind":"Field","name":{"kind":"Name","value":"amountCents"}},{"kind":"Field","name":{"kind":"Name","value":"autoApply"}},{"kind":"Field","name":{"kind":"Name","value":"deactivateAfterAmountIncludingTaxCents"}},{"kind":"Field","name":{"kind":"Name","value":"deactivateAfterTimes"}},{"kind":"Field","name":{"kind":"Name","value":"deactivationStrategy"}},{"kind":"Field","name":{"kind":"Name","value":"discountType"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"percentDiscount"}},{"kind":"Field","name":{"kind":"Name","value":"publicName"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BillingCyclePromotion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BillingCyclePromotionFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderDiscountPromotion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderDiscountPromotionFields"}}]}}]}}]} as unknown as DocumentNode<AppliedPromotionFieldsFragment, unknown>;