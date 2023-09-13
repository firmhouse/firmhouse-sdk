import { type ProductsType } from '@firmhouse/firmhouse';
import { Button, Product } from '@firmhouse/ui-components';

export interface ProductListProps {
  products: ProductsType;
  addToCart: (productId: string, quantity: number) => void;
}

export default function ProductList({ addToCart, products }: ProductListProps) {
  return (
    <div className="flex justify-center align-middle flex-wrap">
      {products?.map((product) => (
        <Product
          key={product.id}
          title={product.title ?? ''}
          imageUrl={product.imageUrl}
        >
          <Button text="Add to Cart" onClick={() => addToCart(product.id, 1)} />
        </Product>
      ))}
    </div>
  );
}
