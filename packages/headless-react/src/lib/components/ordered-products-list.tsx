import { FirmhouseOrderedProduct } from '@firmhouse/firmhouse-sdk';
import { useFirmhouseCart } from '../hooks';
import { OrderedProductProps, OrderedProduct } from './ordered-product';
import { useCallback, useMemo } from 'react';
import { getOrderedProductInfo } from '../utils';
import {
  OrderedProductsGroup,
  OrderedProductsGroupProps,
} from './ordered-products-group';
import { TranslationFunction } from '../hooks/cart';

export interface OrderedProductsListProps {
  OrderedProductComponent?: React.ComponentType<OrderedProductProps>;
  filter?: (orderedProduct: FirmhouseOrderedProduct) => boolean;
  groupBy?: (
    orderedProduct: FirmhouseOrderedProduct,
    t?: TranslationFunction
  ) => string;
  OrderedProductsGroupComponent?: React.ComponentType<OrderedProductsGroupProps>;
  onlyOneTimeProducts?: boolean;
  onlyRecurringProducts?: boolean;
  className?: string;
  itemClassName?: string;
}

export function OrderedProductsList({
  OrderedProductComponent = OrderedProduct,
  OrderedProductsGroupComponent = OrderedProductsGroup,
  filter,
  groupBy,
  className,
  onlyOneTimeProducts,
  onlyRecurringProducts,
  itemClassName,
}: OrderedProductsListProps) {
  const { cart, t } = useFirmhouseCart();

  const productFilter = useCallback(
    (op: FirmhouseOrderedProduct) => {
      if (!cart) return false;
      const { shipsOnce, billsOnce } = getOrderedProductInfo(op, cart, t);
      if (onlyOneTimeProducts && (!shipsOnce || !billsOnce)) {
        return false;
      }
      if (onlyRecurringProducts && shipsOnce && billsOnce) {
        return false;
      }
      if (filter && !filter(op)) {
        return false;
      }
      return true;
    },
    [onlyOneTimeProducts, onlyRecurringProducts, filter, cart, t]
  );
  const groups = useMemo(() => {
    if (!groupBy || !cart) {
      return null;
    }
    const groupsObject =
      cart?.orderedProducts
        ?.filter(productFilter)
        .sort((a, b) => a.id.localeCompare(b.id))
        .reduce((acc, orderedProduct) => {
          const group = groupBy(orderedProduct, t);
          if (!acc[group]) {
            acc[group] = [];
          }
          acc[group].push(orderedProduct);
          return acc;
        }, {} as Record<string, FirmhouseOrderedProduct[]>) ?? {};

    return Object.entries(groupsObject).map(([groupName, orderedProducts]) => (
      <OrderedProductsGroupComponent key={groupName} name={groupName}>
        {orderedProducts.map((orderedProduct) => (
          <OrderedProductComponent
            className={itemClassName}
            key={orderedProduct.id}
            orderedProduct={orderedProduct}
            cart={cart}
            t={t}
            {...getOrderedProductInfo(orderedProduct, cart, t)}
          />
        ))}
      </OrderedProductsGroupComponent>
    ));
  }, [
    cart,
    productFilter,
    groupBy,
    itemClassName,
    OrderedProductComponent,
    OrderedProductsGroupComponent,
    t,
  ]);

  if (!cart) {
    return null;
  }

  if (groups) {
    return <div className={className}>{groups}</div>;
  }

  return (
    <div className={`${className}`}>
      {cart.orderedProducts
        ?.filter(productFilter)
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((orderedProduct) => (
          <OrderedProductComponent
            className={itemClassName}
            key={orderedProduct.id}
            orderedProduct={orderedProduct}
            cart={cart}
            t={t}
            {...getOrderedProductInfo(orderedProduct, cart, t)}
          />
        ))}
    </div>
  );
}
