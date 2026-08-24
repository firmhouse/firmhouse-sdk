/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type BaseIntervalUnit =
  /** Interval period in days. */
  | 'DAYS'
  /** Interval period in months. */
  | 'MONTHS'
  /** Interval period in weeks. */
  | 'WEEKS'
  /** Interval period in years. */
  | 'YEARS';

export type CommitmentUnit =
  /** The period in days. */
  | 'DAYS'
  /** The period in months. */
  | 'MONTHS'
  /** The period in weeks. */
  | 'WEEKS'
  /** The period in years. */
  | 'YEARS';

export type MaximumCommitmentUnit =
  /** The period in billing cycles */
  | 'BILLING_CYCLES'
  /** The period in days. */
  | 'DAYS'
  /** The period in months. */
  | 'MONTHS'
  /** The period in weeks. */
  | 'WEEKS'
  /** The period in years. */
  | 'YEARS';

export type PlanFieldsFragment_Plan_planProducts_PlanProduct_product_Product = { available: boolean, eligibleForDiscount: boolean, graceCancellationEnabled: boolean | null, graceCancellationPeriod: number | null, graceCancellationUnit: Types.CommitmentUnit | null, id: string, imageUrl: string | null, interval: number | null, intervalUnitOfMeasure: string | null, mandatory: boolean, maximumCommitmentEnabled: boolean | null, maximumCommitmentPeriod: number | null, maximumCommitmentUnit: Types.MaximumCommitmentUnit | null, metadata: unknown, minimumCommitmentEnabled: boolean | null, minimumCommitmentPeriod: number | null, minimumCommitmentUnit: Types.CommitmentUnit | null, nthProductFree: number | null, priceCents: number | null, priceExcludingTaxCents: number | null, priceIncludingTaxCents: number | null, productType: string | null, shopifyProductId: string | null, shopifyVariantId: string | null, sku: string | null, slug: string, supplier: string | null, taxAmountCents: number | null, taxPercentage: number | null, title: string };

export type PlanFieldsFragment_Plan_planProducts_PlanProduct = { quantity: number, product: PlanFieldsFragment_Plan_planProducts_PlanProduct_product_Product };

export type PlanFieldsFragment = { available: boolean, currency: string | null, graceCancellationEnabled: boolean, graceCancellationPeriod: number, graceCancellationUnit: Types.CommitmentUnit, id: string, imageUrl: string | null, initialAmountExcludingTaxCents: number | null, initialAmountIncludingTaxCents: number | null, instalmentIntervalPeriod: number | null, instalmentIntervalUnit: Types.BaseIntervalUnit | null, instalments: number | null, maximumCommitmentEnabled: boolean | null, maximumCommitmentPeriod: number | null, maximumCommitmentUnit: Types.MaximumCommitmentUnit | null, metadata: unknown, minimumCommitmentEnabled: boolean, minimumCommitmentPeriod: number, minimumCommitmentUnit: Types.CommitmentUnit, monthlyAmountCents: number | null, monthlyAmountExcludingTaxCents: number | null, monthlyAmountIncludingTaxCents: number | null, name: string, slug: string, taxAmountCents: number | null, taxPercentage: number | null, planProducts: Array<PlanFieldsFragment_Plan_planProducts_PlanProduct> | null };

export const PlanFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlanFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Plan"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"graceCancellationEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"graceCancellationPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"graceCancellationUnit"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"initialAmountExcludingTaxCents"}},{"kind":"Field","name":{"kind":"Name","value":"initialAmountIncludingTaxCents"}},{"kind":"Field","name":{"kind":"Name","value":"instalmentIntervalPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"instalmentIntervalUnit"}},{"kind":"Field","name":{"kind":"Name","value":"instalments"}},{"kind":"Field","name":{"kind":"Name","value":"maximumCommitmentEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"maximumCommitmentPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"maximumCommitmentUnit"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"minimumCommitmentEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"minimumCommitmentPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"minimumCommitmentUnit"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyAmountCents"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyAmountExcludingTaxCents"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyAmountIncludingTaxCents"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmountCents"}},{"kind":"Field","name":{"kind":"Name","value":"taxPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"planProducts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"eligibleForDiscount"}},{"kind":"Field","name":{"kind":"Name","value":"graceCancellationEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"graceCancellationPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"graceCancellationUnit"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"intervalUnitOfMeasure"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"maximumCommitmentEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"maximumCommitmentPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"maximumCommitmentUnit"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"minimumCommitmentEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"minimumCommitmentPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"minimumCommitmentUnit"}},{"kind":"Field","name":{"kind":"Name","value":"nthProductFree"}},{"kind":"Field","name":{"kind":"Name","value":"priceCents"}},{"kind":"Field","name":{"kind":"Name","value":"priceExcludingTaxCents"}},{"kind":"Field","name":{"kind":"Name","value":"priceIncludingTaxCents"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"shopifyProductId"}},{"kind":"Field","name":{"kind":"Name","value":"shopifyVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"supplier"}},{"kind":"Field","name":{"kind":"Name","value":"taxAmountCents"}},{"kind":"Field","name":{"kind":"Name","value":"taxPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]} as unknown as DocumentNode<PlanFieldsFragment, unknown>;