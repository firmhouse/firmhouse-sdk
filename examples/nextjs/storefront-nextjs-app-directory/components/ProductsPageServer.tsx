import {
  getSubscriptionToken,
  addToCart,
  removeFromCart,
  isInitialized,
  updateQuantity
} from '../lib/actions/subscription';
import { firmhouseClient } from '../lib/firmhouse';
import CartServer from './CartServer';
import ProductListServer from './ProductListServer';

export default async function ProductsPageServer() {
  const products = await firmhouseClient.products.fetchAll();
  let subscription = null;
  if (await isInitialized()) {
    subscription = await firmhouseClient.subscriptions.get(
      await getSubscriptionToken()
    );
  }

  return (
    <div className="flex h-full w-full justify-start flex-row mt-12 pr-[300px]">
      <div className="p-8 w-full">
        <ProductListServer products={products} addToCart={addToCart} />
      </div>
      <div className="h-full bg-white fixed right-0 w-[300px]">
        <CartServer
          subscription={subscription}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
        />
      </div>
    </div>
  );
}
