import { FirmhouseClient } from '@firmhouse/firmhouse-sdk';
import { Product } from '@firmhouse/ui-components';

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const client = new FirmhouseClient({
    apiToken: process.env.PROJECT_ACCESS_TOKEN ?? '',
  });
  const product = await client.products.fetchById(params.id);
  return (
    <div className="flex h-full w-full justify-center align-middle flex-col">
      {product !== null && (
        <Product
          key={product.id}
          title={product.title ?? ''}
          imageUrl={product.imageUrl}
          price={product.priceCents}
        />
      )}
    </div>
  );
}
