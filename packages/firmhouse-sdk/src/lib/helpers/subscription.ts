import { ServerError } from './errors';
import { GetSubscriptionQuery } from '../resources/subscriptions/subscriptions.generated';
import {
  FirmhouseCart,
  FirmhouseOrderedProduct,
  FirmhouseOrderedProductWithUtils,
  FirmhouseSubscription,
  FirmhouseSubscriptionWithUtils,
  ResolveObject,
} from './types';
import { arrayFilterNulls, capitalize } from './utils';
import { OrderedProductIntervalUnitOfMeasure } from '../graphql/generated';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import { GetCartQuery } from '../resources/carts/carts.generated';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Europe/Amsterdam');

/**
 * @internal
 */
export type { GetSubscriptionQuery, GetCartQuery };

/**
 * @internal
 */
export type BaseCartType = NonNullable<GetCartQuery['getCart']>;

/**
 * @internal
 */
export type BaseSubscriptionType = NonNullable<
  GetSubscriptionQuery['getSubscription']
>;

/**
 * @internal
 */
export type BaseOrderedProductType = NonNullable<
  BaseCartType['orderedProducts']
>[0];

/**
 * @internal
 */
export type _ContainsSubscription = { subscription: BaseCartType };

/**
 * @internal
 * Ordered Product
 */
export type OrderedProductType = ResolveObject<
  NonNullable<BaseCartType['orderedProducts']>[0] & {
    intervalUnitOfMeasureType: OrderedProductIntervalUnitOfMeasure | null;
    followsPlanSchedule: () => boolean;
    shipsOnlyOnce: () => boolean;
  }
>;

/**
 * @internal
 */
export function _formatOrderedProduct(
  orderedProduct: BaseOrderedProductType
): FirmhouseOrderedProduct {
  const { intervalUnitOfMeasure } = orderedProduct;
  const unit = capitalize(intervalUnitOfMeasure ?? '');
  return {
    ...orderedProduct,
    intervalUnitOfMeasureType:
      unit in OrderedProductIntervalUnitOfMeasure
        ? OrderedProductIntervalUnitOfMeasure[
            unit as keyof typeof OrderedProductIntervalUnitOfMeasure
          ]
        : null,
  };
}

/**
 * Checks if the ordered product follows the plan schedule
 * @param orderedProduct - Ordered product
 * @param subscription - Subscription
 * @returns Whether the ordered product follows the plan schedule
 */
function followsPlanSchedule(
  orderedProduct: BaseOrderedProductType,
  subscription: BaseCartType
) {
  return (
    orderedProduct.product.intervalUnitOfMeasure === 'on_billing_cycle' &&
    subscription.subscribedPlan !== null
  );
}

/**
 * Checks if the ordered product ships only once
 * @param orderedProduct - Ordered product
 * @returns Whether the ordered product ships only once
 */
function shipsOnlyOnce(orderedProduct: BaseOrderedProductType): boolean {
  return (
    orderedProduct.intervalUnitOfMeasure ===
      OrderedProductIntervalUnitOfMeasure.Default &&
    orderedProduct.product.intervalUnitOfMeasure === 'only_once'
  );
}

/**
 * @internal
 * Formats fields of a subscription and assigns utils
 * @param subscription - Subscription to format
 * @returns Formatted subscription
 */
export function _formatCart(subscription: BaseCartType): FirmhouseCart {
  const { orderedProducts, token, ...rest } = subscription;
  if (!token) {
    throw new ServerError('No token returned from API');
  }
  return {
    ...rest,
    token,
    orderedProducts:
      orderedProducts === null
        ? null
        : orderedProducts.map((op) => _formatOrderedProduct(op)),
    appliedPromotions: subscription.appliedPromotions
      ? arrayFilterNulls(subscription.appliedPromotions)
      : undefined,
  } as FirmhouseCart;
}

/**
 * @internal
 * Formats fields of a subscription and assigns utils
 * @param subscription - Subscription to format
 * @returns Formatted subscription
 * @typeParam T - Subscription type
 */
export function _formatSubscription(
  subscription: BaseSubscriptionType
): FirmhouseSubscription {
  const { orderedProducts, token, ...rest } = subscription;
  if (!token) {
    throw new ServerError('No token returned from API');
  }

  return {
    ...rest,
    token,
    orderedProducts:
      orderedProducts === null
        ? null
        : orderedProducts.map((op) => _formatOrderedProduct(op)),
    ordersV2: subscription.ordersV2
      ? {
          pageInfo: subscription.ordersV2?.pageInfo ?? undefined,
          total: subscription.ordersV2?.totalCount ?? 0,
          results: subscription.ordersV2?.nodes
            ? []
            : arrayFilterNulls(subscription.ordersV2?.nodes),
        }
      : undefined,
    collectionCases: subscription.collectionCases?.nodes
      ? arrayFilterNulls(subscription.collectionCases?.nodes)
      : undefined,
    invoices: subscription.invoices
      ? arrayFilterNulls(subscription.invoices)
      : undefined,
    appliedPromotions: subscription.appliedPromotions
      ? arrayFilterNulls(subscription.appliedPromotions)
      : undefined,
  } as FirmhouseSubscription;
}

/**
 * Finds the date of the closest upcoming order
 * @param subscription - Subscription with ordered products
 * @returns the date of the closest upcoming order
 * @typeParam T - Subscription type
 */
function getClosestUpcomingOrderDate<
  T extends { orderedProducts: BaseOrderedProductType[] | null }
>(subscription: T) {
  if (subscription.orderedProducts === null) {
    return null;
  }
  const today = dayjs.tz();
  const sortedOrderDates = subscription.orderedProducts
    .map((op) => op.shipmentDate)
    .filter((date) => dayjs.tz(date) > today)
    .sort((a, b) => dayjs.tz(b).diff(dayjs.tz(a)));
  return sortedOrderDates.length > 0
    ? sortedOrderDates[sortedOrderDates.length - 1]
    : null;
}

/**
 * Finds the products that are in the closest upcoming order
 * @param subscription - Subscription with  ordered products
 * @returns the products that are in the closest upcoming order
 * @typeParam T - Subscription type
 */
function getClosestUpcomingOrderOrderedProducts<
  T extends { orderedProducts: BaseOrderedProductType[] | null }
>(subscription: T) {
  if (subscription.orderedProducts === null) {
    return [];
  }
  const closestUpcomingOrderDate = getClosestUpcomingOrderDate(subscription);
  if (closestUpcomingOrderDate === null) return [];
  return subscription.orderedProducts.filter(
    (op) => op.shipmentDate === closestUpcomingOrderDate
  ) as FirmhouseOrderedProduct[];
}

export function assignSubscriptionUtils(
  subscription: FirmhouseSubscription
): FirmhouseSubscriptionWithUtils {
  return {
    ...subscription,
    getClosestUpcomingOrderDate: getClosestUpcomingOrderDate.bind(
      null,
      subscription
    ),
    getClosestUpcomingOrderOrderedProducts:
      getClosestUpcomingOrderOrderedProducts.bind(null, subscription),
  } as FirmhouseSubscriptionWithUtils;
}

export function assignOrderedProductUtils(
  orderedProduct: FirmhouseOrderedProduct,
  subscription: FirmhouseCart | FirmhouseSubscription
): FirmhouseOrderedProductWithUtils {
  return {
    ...orderedProduct,
    followsPlanSchedule: followsPlanSchedule.bind(
      null,
      orderedProduct,
      subscription
    ),
    shipsOnlyOnce: shipsOnlyOnce.bind(null, orderedProduct),
  } as FirmhouseOrderedProductWithUtils;
}
