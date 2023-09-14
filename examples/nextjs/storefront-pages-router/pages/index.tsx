import { InferGetStaticPropsType, GetStaticProps } from 'next';
import { useSubscription } from '../lib/hooks/subscription';
import { firmhouseClient } from '../firmhouse';
import { ProductsType } from '@firmhouse/firmhouse-sdk';
import ProductList from '../components/ProductList';
import Cart from '../components/Cart';

export const getStaticProps = (async () => {
  const products = await firmhouseClient.products.fetchAll();
  return { props: { products } };
}) satisfies GetStaticProps<{
  products: ProductsType;
}>;

export default function Index({
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const {
    subscription,
    addToCart,
    removeFromCart,
    updateOrderedProductQuantity,
  } = useSubscription();

  return (
    <div className="flex h-full w-full justify-center items-center flex-col">
      <div className="flex h-full w-full justify-start flex-row mt-12 pr-[300px]">
        <div className="p-8 w-full">
          <ProductList products={products} addToCart={addToCart} />
        </div>
        <div className="h-full bg-white fixed right-0 w-[300px]">
          {subscription !== null && (
            <Cart
              subscription={subscription}
              onRemove={removeFromCart}
              onUpdateQuantity={updateOrderedProductQuantity}
            />
          )}
        </div>
      </div>
    </div>
  );
}
