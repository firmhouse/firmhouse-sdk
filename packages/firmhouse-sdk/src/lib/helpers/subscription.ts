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
  BaseOrderedProductType & {
    intervalUnitOfMeasureType: OrderedProductIntervalUnitOfMeasure | null;
  }
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
export function _formatSubscription<
  T extends BaseSubscriptionType = BaseSubscriptionType
>(subscription: T): SubscriptionType<T> {
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
        : orderedProducts.map(_formatOrderedProduct),
  };
  return response;
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
