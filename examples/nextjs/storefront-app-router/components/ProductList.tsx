import { type ProductsType } from '@firmhouse/firmhouse-sdk';
import { Button, Product } from '@firmhouse/ui-components';

export interface ProductListProps {
  products: ProductsType;
  addToCart: (data: FormData) => void;
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
          <form action={addToCart}>
            <input type="hidden" name="productId" value={product.id} readOnly/>
            <input type="hidden" name="quantity" value={1} readOnly/>
            <Button text="Add to Cart" />
          </form>
        </Product>
      ))}
    </div>
  );
}
