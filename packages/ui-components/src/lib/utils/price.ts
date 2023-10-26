import { OrderedProductType } from '@firmhouse/firmhouse-sdk';

export function formatCentsToEuros(cents: number, decimalPoints = 2): string {
  return `${(cents / 100).toFixed(decimalPoints)}€`;
}

export function formatCentsWithCurrency(
  cents: number,
  currency: string,
  locale?: string | null,
  decimalPoints = 2
): string {
  return Intl.NumberFormat(locale ?? undefined, {
    currency,
    style: 'currency',
    maximumFractionDigits: decimalPoints,
    minimumFractionDigits: decimalPoints,
  }).format(cents / 100);
}

export function getOrderedProductInfo(
  orderedProduct: OrderedProductType,
  currency = 'EUR',
  locale?: string | null
) {
  const isPlanBased = orderedProduct.plan?.id !== undefined;
  const { product, intervalUnitOfMeasure, interval } = orderedProduct;
  const { productType } = product;
  const intervalText = productType === 'one_time_purchase' ? '' : ` / month`;
  const shippingText =
    intervalUnitOfMeasure === 'only_once'
      ? ''
      : getShippingInterval(orderedProduct);
  const totalPrice = orderedProduct.totalAmountIncludingTaxCents ?? 0;
  const formattedPrice = `${formatCentsWithCurrency(
    totalPrice,
    currency,
    locale
  )}${intervalText}`;
  const billingAndShipping = isPlanBased
    ? shippingText
    : `${shippingText ? `Bills & ` : ''}${shippingText}`;

  return {
    billingAndShipping,
    totalPrice: formattedPrice,
  };
}

function getShippingInterval(orderedProduct: OrderedProductType) {
  // If the interval is default just get that from product
  const { intervalUnitOfMeasure, interval } =
    orderedProduct.intervalUnitOfMeasure === 'default'
      ? orderedProduct.product
      : orderedProduct;
  if (
    intervalUnitOfMeasure === 'only_once' ||
    typeof intervalUnitOfMeasure !== 'string' ||
    typeof interval !== 'number'
  ) {
    return 'Ships once';
  }
  const prefix = interval === 1 ? 'every' : `every ${interval}`;
  // interval units are always plural, so we remove the last character
  const periodName = intervalUnitOfMeasure.slice(0, -1);
  const suffix = interval === 1 ? '' : 's';

  return `Ships ${prefix} ${periodName}${suffix}`;
}
