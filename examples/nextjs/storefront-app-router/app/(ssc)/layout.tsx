import { NavBar } from '@firmhouse/ui-components';
import { Inter } from 'next/font/google';

export const metadata = {
  title: 'Firmhouse Storefront Next.js App / App Router',
};

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
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
        <NavBar title={metadata.title} />
        {children}
      </body>
    </html>
  );
}
