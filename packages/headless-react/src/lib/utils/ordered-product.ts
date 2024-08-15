import {
  FirmhouseCart,
  FirmhouseOrderedProduct,
  OrderedProductIntervalUnitOfMeasure,
} from '@firmhouse/firmhouse-sdk';
import { TranslationFunction } from '../hooks/cart';

export function getOrderedProductInfo(
  orderedProduct: FirmhouseOrderedProduct,
  cart: FirmhouseCart,
  t?: TranslationFunction
) {
  const { product } = orderedProduct;
  const shipsOnce =
    orderedProduct.intervalUnitOfMeasure === 'default' &&
    product.intervalUnitOfMeasure === 'only_once';
  const billsOnce =
    (cart.activePlan &&
      orderedProduct.product.productType === 'one_time_purchase') ||
    (!cart.activePlan && shipsOnce);
  const planIntervalUnitOfMeasure =
    cart.subscribedPlan?.billingCycleIntervalUnit;
  let {
    intervalUnitOfMeasure: activeIntervalUnitOfMeasure,
    interval: activeInterval,
  } =
    orderedProduct.intervalUnitOfMeasure === 'default'
      ? product
      : orderedProduct;
  if (
    activeIntervalUnitOfMeasure === 'on_billing_cycle' &&
    planIntervalUnitOfMeasure
  ) {
    activeIntervalUnitOfMeasure = planIntervalUnitOfMeasure;
    activeInterval = cart.subscribedPlan?.billingCycleInterval ?? 1;
  }

  return {
    billingFrequency: billsOnce
      ? ''
      : getFrequency(activeIntervalUnitOfMeasure, activeInterval, t),
    shippingFrequency: shipsOnce
      ? ''
      : getFrequency(activeIntervalUnitOfMeasure, activeInterval, t),
    intervalUnitOfMeasure: activeIntervalUnitOfMeasure as
      | 'only_once'
      | OrderedProductIntervalUnitOfMeasure,
    interval: activeInterval,
    billsOnce,
    shipsOnce,
  };
}

export function getFrequency(
  intervalUnitOfMeasure: string | null,
  interval: number | null,
  t?: TranslationFunction
) {
  if (
    intervalUnitOfMeasure === null ||
    interval === null ||
    intervalUnitOfMeasure === 'only_once' ||
    typeof intervalUnitOfMeasure !== 'string' ||
    typeof interval !== 'number'
  ) {
    return '';
  }
  return (
    t?.(`checkout.interval.${intervalUnitOfMeasure}`, { count: interval }) ?? ''
  );
}
