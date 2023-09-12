import { FirmhouseClient } from '@firmhouse/firmhouse';
import { Product } from '@firmhouse/ui-components';
import Link from 'next/link';

export default async function Index() {
  const client = new FirmhouseClient({
    apiToken: process.env.PROJECT_ACCESS_TOKEN ?? '',
  });
  const products = await client.products.fetchAll();
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  return (
    <div className="flex h-full w-full justify-center items-center flex-col">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <Product
            title={product.title ?? ''}
            imageUrl={product.imageUrl}
            price={product.priceCents}
            isRecurring={product.productType === 'recurring'}
          />
        </Link>
      ))}
    </div>
  );
}
