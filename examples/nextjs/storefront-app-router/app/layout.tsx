import './global.css';
import { NavBar } from '@firmhouse/ui-components';

export const metadata = {
  title: 'Firmhouse Storefront Next.js App / App Router',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <NavBar title={metadata.title} />
        {children}
      </body>
    </html>
  );
}
