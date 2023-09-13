import ProductsPage from '../components/ProductsPage';

export default async function Index() {
  // const products = await firmhouseClient.products.fetchAll();

  return (
    <div className="flex h-full w-full justify-center items-center flex-col">
      <ProductsPage />
    </div>
  );
}
