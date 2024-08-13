export interface OrderedProductsGroupProps {
  children?: React.ReactNode;
  name: string;
}

export function OrderedProductsGroup({
  children,
  name,
}: OrderedProductsGroupProps) {
  return (
    <div>
      <h2>{name}</h2>
      <div>{children}</div>
    </div>
  );
}
