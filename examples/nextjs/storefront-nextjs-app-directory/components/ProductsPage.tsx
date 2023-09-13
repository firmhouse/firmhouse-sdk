'use client';
import { type ProductsType } from '@firmhouse/firmhouse';
import { useEffect, useState } from 'react';
import { useSubscription } from '../lib/hooks/subscription';
import { firmhouseClient } from '../lib/firmhouse';
import Cart from './Cart';
import ProductList from './ProductList';

export default function ProductsPage() {
  const [products, setProducts] = useState([] as ProductsType);
  const { subscription, addToCart, removeFromCart } = useSubscription();
  useEffect(() => {
    firmhouseClient.products
      .fetchAll()
      .then((response) => {
        return setProducts(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="flex h-full w-full justify-start flex-row mt-12 pr-[300px]">
      <div className="p-8 w-full">
        <ProductList products={products} addToCart={addToCart} />
      </div>
      <div className="h-full bg-white fixed right-0 w-[300px]">
        {subscription !== null && (
          <Cart subscription={subscription} onRemove={removeFromCart} />
        )}
      </div>
    </div>
  );
}
