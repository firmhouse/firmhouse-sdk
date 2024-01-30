import { ChevronIcon } from '@firmhouse/ui-components';
import Link from 'next/link';
import React, { ComponentProps } from 'react';

export interface NavigationLinkProps extends ComponentProps<typeof Link> {
  icon: React.ReactNode;
  supportText?: string;
  label: string;
  children?: never;
  iconContainerClassName?: string;
}
export function NavigationLink({
  icon,
  supportText,
  label,
  iconContainerClassName,
  ...props
}: NavigationLinkProps) {
  return (
    <Link
      {...props}
      className="flex justify-between items-center z-10 bg-white border p-4 mb-4 rounded-md shadow-md cursor-pointer text-gray-900 no-underline relative w-full flex-nowrap"
    >
      <div className="flex items-center">
        <span
          className={`[&>svg]:text-gray-800 [&>svg]:h-5 rounded-full p-3 mr-4 ${
            iconContainerClassName ?? ''
          }`}
        >
          {icon}
        </span>
        <div>
          <p className="font-semibold whitespace-wrap">{label}</p>
          <p className="block font-normal text-xs text-gray-600 whitespace-wrap">
            {supportText ?? ''}
          </p>
        </div>
      </div>
      <ChevronIcon className="h-7 ml-auto text-gray-600" />
    </Link>
  );
}
