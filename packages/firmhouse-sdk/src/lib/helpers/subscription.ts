import { ServerError } from './errors';
import {
  GetSubscriptionQuery,
  OrderedProductIntervalUnitOfMeasure,
} from '../graphql/generated';
import { ResolveObject } from './types';
import { capitalize } from './utils';

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
  BaseOrderedProductType & {
    intervalUnitOfMeasureType: OrderedProductIntervalUnitOfMeasure | null;
  }
>;

/**
 * @public
 * Subscription
 */
export type SubscriptionType = ResolveObject<
  Omit<BaseSubscriptionType, 'orderedProducts' | 'token'> & {
    orderedProducts: OrderedProductType[] | null;
    token: string;
  }
>;

/**
 * @public
 * Extra field answer
 */
export type ExtraFieldAnswerType = SubscriptionType['extraFields'][0];

/**
 * @internal
 */
export function formatOrderedProduct(
  orderedProduct: BaseOrderedProductType
): OrderedProductType {
  const { intervalUnitOfMeasure } = orderedProduct;
  const unit = capitalize(intervalUnitOfMeasure ?? '');
  const formattedOrderedProduct = orderedProduct as OrderedProductType;
  formattedOrderedProduct.intervalUnitOfMeasureType =
    unit in OrderedProductIntervalUnitOfMeasure
      ? OrderedProductIntervalUnitOfMeasure[
          unit as keyof typeof OrderedProductIntervalUnitOfMeasure
        ]
      : null;
  return formattedOrderedProduct;
}

/**
 * @internal
 */
export function formatSubscription(
  subscription: BaseSubscriptionType
): SubscriptionType {
  const { orderedProducts, token, ...rest } = subscription;
  if (!token) {
    throw new ServerError('No token returned from API');
  }
  const response: SubscriptionType = {
    ...rest,
    token,
    orderedProducts:
      orderedProducts === null
        ? null
        : orderedProducts.map(formatOrderedProduct),
  };
  return response;
}

/**
 * @internal
 */
export function formatSubscriptionInResponse<T extends ContainsSubscription>(
  response: T
) {
  return (
    response && {
      ...response,
      subscription: formatSubscription(response.subscription),
    }
  );
}
