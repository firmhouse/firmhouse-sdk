'use client';
import {
  FirmhouseClient,
  type Product as ProductT,
} from '@firmhouse/firmhouse';
import { Product } from '@firmhouse/ui-components';
import { useEffect, useState } from 'react';
const client = new FirmhouseClient({
    apiToken: process.env.NEXT_PUBLIC_PROJECT_ACCESS_TOKEN ?? '',
  });
export default function ProductList() {
  const [products, setProducts] = useState([] as ProductT);
  useEffect(() => {
    client.products
      .fetchAll()
      .then((response) => {
        return setProducts(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="flex h-full w-full justify-center align-middle flex-col">
      {products.map((product) => (
        <Product
          key={product.id}
          title={product.title ?? ''}
          imageUrl={product.imageUrl}
        />
      ))}
    </div>
  );
}
