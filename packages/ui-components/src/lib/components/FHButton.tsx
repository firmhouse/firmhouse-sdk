export interface FHButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function FHButton(props: FHButtonProps) {
  return (
    <button
      {...props}
      className={`${
        props.className ?? ''
      }inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-6 font-medium text-gray-700 shadow-sm cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:border-gray-600 focus:outline-none focus:no-underline active:bg-white`}
    />
  );
}
