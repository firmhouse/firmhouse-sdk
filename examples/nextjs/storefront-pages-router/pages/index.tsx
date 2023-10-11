import { InferGetStaticPropsType, GetStaticProps } from 'next';
import { useSubscription } from '../lib/hooks/subscription';
import { firmhouseClient } from '../lib/firmhouse';
import { AllProductsResponse } from '@firmhouse/firmhouse-sdk';
import ProductList from '../components/ProductList';
import Cart from '../components/Cart';

const pageSize = 2;
export const getStaticProps = (async () => {
  const response = await firmhouseClient.products.fetchAll({
    first: pageSize,
  });
  return { props: response };
}) satisfies GetStaticProps<AllProductsResponse>;

export default function Index({
  results: products,
  pageInfo,
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
          <ProductList
            products={products}
            hasNextPage={pageInfo?.hasNextPage}
            endCursor={pageInfo?.endCursor}
            pageSize={pageSize}
            addToCart={addToCart}
          />
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
