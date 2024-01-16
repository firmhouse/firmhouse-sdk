import Link, { LinkProps } from 'next/link';

export interface LinkButtonProps extends LinkProps {
  children: React.ReactNode;
}

export function LinkButton(props: LinkButtonProps) {
  return (
    <Link
      {...props}
      className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-6 font-medium text-gray-700 shadow-sm cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:border-gray-600 focus:outline-none focus:no-underline active:bg-white"
    />
  );
}
