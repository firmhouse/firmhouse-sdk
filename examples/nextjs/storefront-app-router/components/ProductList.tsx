'use client';
import { FirmhouseProduct } from '@firmhouse/firmhouse-sdk';
import { startTransition, useState } from 'react';
import { addToCart } from '../lib/actions/subscription';
import { Button, Product } from '@firmhouse/ui-components';

export interface ProductListProps {
  products: FirmhouseProduct[];
  endCursor?: string | null;
  hasNextPage?: boolean;
  pageSize: number;
  loadMoreProducts?: (endCursor?: string | null) => Promise<{
    products: FirmhouseProduct[];
    endCursor?: string | null;
    hasNextPage?: boolean;
  }>;
}

export default function ProductList({
  products: initialProducts,
  endCursor: initialEndCursor,
  pageSize,
  hasNextPage: initialHasNextPage,
  loadMoreProducts,
}: ProductListProps) {
  const [endCursor, setEndCursor] = useState<string | undefined | null>(
    initialEndCursor
  );
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    setLoading(true);
    startTransition(() => {
      loadMoreProducts?.(endCursor)
        .then((response) => {
          setProducts((prev) => [...prev, ...response.products]);
          setEndCursor(response.endCursor);
          setHasNextPage(response.hasNextPage);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  return (
    <div className="flex-col justify-center align-middle text-center">
      <div className="flex justify-center align-middle flex-wrap">
        {products?.map((product) => (
          <Product
            key={product.id}
            title={product.title ?? ''}
            imageUrl={product.imageUrl}
          >
            <form action={addToCart}>
              <input
                type="hidden"
                name="productId"
                value={product.id}
                readOnly
              />
              <input type="hidden" name="quantity" value={1} readOnly />
              <Button text="Add to Cart" />
            </form>
          </Product>
        ))}
      </div>
      {hasNextPage && (
        <Button
          onClick={loadMore}
          text={loading ? 'Loading...' : 'Load more'}
          disabled={loading}
        />
      )}
    </div>
  );
}
