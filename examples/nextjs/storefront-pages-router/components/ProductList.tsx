import { type ProductType } from '@firmhouse/firmhouse-sdk';
import { Button, Product } from '@firmhouse/ui-components';
import { useState } from 'react';
import { firmhouseClient } from '../lib/firmhouse';

export interface ProductListProps {
  products: ProductType[];
  endCursor?: string | null;
  hasNextPage?: boolean;
  pageSize: number;
  addToCart: (productId: string, quantity: number) => void;
}

export default function ProductList({
  addToCart,
  products: initialProducts,
  endCursor: initialEndCursor,
  pageSize,
  hasNextPage: initialHasNextPage,
}: ProductListProps) {
  const [endCursor, setEndCursor] = useState<string | undefined | null>(
    initialEndCursor
  );
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    setLoading(true);
    firmhouseClient.products
      .fetchAll({ after: endCursor, first: pageSize })
      .then((response) => {
        setProducts((prev) => [...prev, ...response.results]);
        setEndCursor(response.pageInfo?.endCursor);
        setHasNextPage(response.pageInfo?.hasNextPage);
      })
      .finally(() => {
        setLoading(false);
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
            <Button
              text="Add to Cart"
              onClick={() => addToCart(product.id, 1)}
            />
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
