import Link from 'next/link';
import { Inter } from 'next/font/google';
import './global.css';
import { NavBar } from '@firmhouse/ui-components';

export const metadata = {
  title: 'Firmhouse Storefront Next.js App / App Router',
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen flex-row bg-slate-50">
        <NavBar title={metadata.title}>
          <Link href="/self-service-center/login">Manage subscription</Link>
        </NavBar>
        {children}
      </body>
    </html>
  );
}
