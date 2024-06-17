import { Inter } from 'next/font/google';
import './global.css';
import { NavBar } from '@firmhouse/ui-components';
import type { Metadata, Viewport } from 'next';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Firmhouse Storefront Next.js App / App Router',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
};

const inter = Inter({
  subsets: ['latin'],
  weight: 'variable',
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex-row bg-slate-50">
        <NavBar title="Firmhouse Storefront Next.js App / App Router" />
        {children}
      </body>
    </html>
  );
}
