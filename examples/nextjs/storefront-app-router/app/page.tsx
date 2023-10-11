import { redirect } from 'next/navigation';
import {
  getSubscriptionToken,
  removeFromCart,
  updateQuantity,
} from '../lib/actions/subscription';
import { firmhouseClient } from '../lib/firmhouse';
import Cart from '../components/Cart';
import ProductList from '../components/ProductList';

export default async function Index() {
  const pageSize = 2;
  let subscription;
  try {
    subscription = await firmhouseClient.subscriptions.get(
      await getSubscriptionToken()
    );
  } catch (e) {
    // If the subscription does not exist or not in draft state it will throw an error
    // We can safely ignore this error and redirect the user to subscription creation route handler
    return redirect('/subscription/create');
  }
  // We fetch products after we get a subscription to prevent unnecessary API calls
  const {results: products, pageInfo} = await firmhouseClient.products.fetchAll({
    first: pageSize
  });

  // Marking the function explicity with "use server" to be able to pass it down to client component ProductList
  async function loadMoreProducts(endCursor?: string | null) {
    "use server"
    const response = await firmhouseClient.products.fetchAll({
      first: pageSize,
      after: endCursor,
    });
    return {
      products: response.results,
      endCursor: response.pageInfo?.endCursor,
      hasNextPage: response.pageInfo?.hasNextPage
    }
  }

  return (
    <div className="flex h-full w-full justify-start flex-row mt-12 pr-[300px]">
      <div className="p-8 w-full">
        <ProductList products={products} loadMoreProducts={loadMoreProducts} endCursor={pageInfo?.endCursor} hasNextPage={pageInfo?.hasNextPage} pageSize={pageSize}/>
      </div>
      <div className="h-full bg-white w-[300px] fixed top-0 right-0 pt-8">
        <Cart
          subscription={subscription}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
        />
      </div>
    </div>
  );
}
