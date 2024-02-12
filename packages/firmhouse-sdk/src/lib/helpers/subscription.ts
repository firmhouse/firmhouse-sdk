import { ServerError } from './errors';
import { GetSubscriptionQuery } from '../resources/subscriptions/subscriptions.generated';
import { ResolveObject } from './types';
import { capitalize } from './utils';
import { OrderedProductIntervalUnitOfMeasure } from '../graphql/generated';

/**
 * @public
 */
export type BaseSubscriptionType = NonNullable<
  GetSubscriptionQuery['getSubscription']
>;

/**
 * @public
 */
export type BaseOrderedProductType = NonNullable<
  BaseSubscriptionType['orderedProducts']
>[0];

/**
 * @internal
 */
export type ContainsSubscription = { subscription: BaseSubscriptionType };

/**
 * @public
 * Ordered Product
 */
export type OrderedProductType = ResolveObject<
  ReturnType<typeof _formatOrderedProduct>
>;

/**
 * @public
 * Subscription
 */
export type SubscriptionType<
  T extends BaseSubscriptionType = BaseSubscriptionType
> = Omit<T, 'orderedProducts' | 'token'> & {
  orderedProducts: OrderedProductType[] | null;
  token: string;
};

/**
 * @public
 * Extra field answer
 */
export type ExtraFieldAnswerType =
  SubscriptionType<BaseSubscriptionType>['extraFields'][0];

/**
 * @internal
 */
export function _formatOrderedProduct(
  orderedProduct: BaseOrderedProductType,
  subscription: BaseSubscriptionType
) {
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
    followsPlanSchedule: followsPlanSchedule.bind(
      null,
      orderedProduct,
      subscription
    ),
    shipsOnlyOnce: shipsOnlyOnce.bind(null, orderedProduct),
  };
}

function followsPlanSchedule(
  orderedProduct: BaseOrderedProductType,
  subscription: BaseSubscriptionType
) {
  return (
    orderedProduct.product.intervalUnitOfMeasure === 'on_billing_cycle' &&
    subscription.subscribedPlan !== null
  );
}

function shipsOnlyOnce(orderedProduct: BaseOrderedProductType): boolean {
  return (
    orderedProduct.intervalUnitOfMeasure ===
      OrderedProductIntervalUnitOfMeasure.Default &&
    orderedProduct.product.intervalUnitOfMeasure === 'only_once'
  );
}

/**
 * @internal
 */
export function _formatSubscription<
  T extends BaseSubscriptionType = BaseSubscriptionType
>(subscription: T) {
  const { orderedProducts, token, ...rest } = subscription;
  if (!token) {
    throw new ServerError('No token returned from API');
  }
  const response: SubscriptionType<T> = {
    ...rest,
    token,
    orderedProducts:
      orderedProducts === null
        ? null
        : orderedProducts.map((op) => _formatOrderedProduct(op, subscription)),
  };

  return assignSubscriptionUtils(response);
}

/**
 * @internal
 */
export function _formatSubscriptionInResponse<T extends ContainsSubscription>(
  response: T
) {
  return (
    response && {
      ...response,
      subscription: _formatSubscription(response.subscription),
    }
  );
}

function getClosestUpcomingOrderDate<
  T extends { orderedProducts: OrderedProductType[] | null }
>(subscription: T) {
  if (subscription.orderedProducts === null) {
    return null;
  }
  const today = new Date();
  const sortedOrderDates = subscription.orderedProducts
    .map((op) => op.shipmentDate)
    .filter((date) => new Date(date ?? 0) > today)
    .sort((a, b) => -new Date(a ?? 0).getTime() + new Date(b ?? 0).getTime());
  return sortedOrderDates.length > 0
    ? sortedOrderDates[sortedOrderDates.length - 1]
    : null;
}

function getClosestUpcomingOrderOrderedProducts<
  T extends { orderedProducts: OrderedProductType[] | null }
>(subscription: T) {
  if (subscription.orderedProducts === null) {
    return [];
  }
  const closestUpcomingOrderDate = getClosestUpcomingOrderDate(subscription);
  if (closestUpcomingOrderDate === null) return [];
  return subscription.orderedProducts.filter(
    (op) => op.shipmentDate === closestUpcomingOrderDate
  );
}

export function assignSubscriptionUtils<T extends SubscriptionType>(
  subscription: T
) {
  return {
    ...subscription,
    getClosestUpcomingOrderDate: getClosestUpcomingOrderDate.bind(
      null,
      subscription
    ),
    getClosestUpcomingOrderOrderedProducts:
      getClosestUpcomingOrderOrderedProducts.bind(null, subscription),
  };
}
