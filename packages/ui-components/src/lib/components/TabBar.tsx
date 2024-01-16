'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface TabBarProps {
  tabs: {
    href: string;
    label: string;
  }[];
}

export function TabBar({ tabs }: TabBarProps) {
  const activePath = usePathname();
  const tabComponents = tabs.map((tab) => (
    <Link
      key={tab.href}
      href={tab.href}
      className={`opacity-75 text-white border-transparent hover:border-white inline-flex items-center whitespace-nowrap px-1 pt-1 pb-5 -mb-5 border-b-2 hover:text-white font-medium hover:no-underline ${
        tab.href === activePath ? 'border-white opacity-100' : ''
      }`}
    >
      {tab.label}
    </Link>
  ));
  return (
    <div className="space-x-8 hidden lg:inline-flex order-3 whitespace-nowrap max-w-2xl mx-auto">
      {tabComponents}
    </div>
  );
}
