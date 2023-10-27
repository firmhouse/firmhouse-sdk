import { OrderedProductIntervalUnitOfMeasure, ServerError } from '../firmhouse';
import { GetSubscriptionQuery } from '../graphql/generated';
import { ResolveObject } from './types';
import { capitalize } from './utils';

type BaseSubscriptionType = NonNullable<
  GetSubscriptionQuery['getSubscription']
>;

type BaseOrderedProductType = NonNullable<
  BaseSubscriptionType['orderedProducts']
>[0];
type ContainsSubscription = { subscription: BaseSubscriptionType };

export type OrderedProductType = ResolveObject<
  BaseOrderedProductType & {
    intervalUnitOfMeasureType: OrderedProductIntervalUnitOfMeasure | null;
  }
>;
export type SubscriptionType = ResolveObject<
  Omit<BaseSubscriptionType, 'orderedProducts' | 'token'> & {
    orderedProducts?: OrderedProductType[] | null;
    token: string;
  }
>;
export type ExtraFieldAnswerType = SubscriptionType['extraFields'][0];

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

export function formatSubscription(
  subscription: BaseSubscriptionType
): SubscriptionType {
  const { orderedProducts, token, ...rest } = subscription;
  if (!token) {
    throw new ServerError('No token returned from API')
  }
  const response: SubscriptionType = {
    ...rest,
    token
  };
  if (orderedProducts === null || orderedProducts === undefined) {
    return response
  }
  response.orderedProducts = orderedProducts.map(formatOrderedProduct);
  return response
}

export function formatSubscriptionInResponse<T extends ContainsSubscription>(
  response: T
) {
  return (
    response && {
      ...response,
      subscription: formatSubscription(response?.subscription),
    }
  );
}
