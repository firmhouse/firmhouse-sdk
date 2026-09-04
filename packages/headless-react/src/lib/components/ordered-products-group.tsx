export interface OrderedProductsGroupProps {
  children?: React.ReactNode;
  name: string;
  className?: string;
}

export function OrderedProductsGroup({
  children,
  name,
  className,
}: OrderedProductsGroupProps) {
  return (
    <div className={className}>
      <h2>{name}</h2>
      <div>{children}</div>
    </div>
  );
}
