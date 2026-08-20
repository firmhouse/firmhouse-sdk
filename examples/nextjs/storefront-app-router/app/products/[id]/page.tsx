import { Product } from '@firmhouse/ui-components';
import { firmhouseClient } from '../../../lib/firmhouse';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await firmhouseClient.products.fetchById(id);
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
