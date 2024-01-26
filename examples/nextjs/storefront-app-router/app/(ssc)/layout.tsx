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
    <>
      <NavBar title={metadata.title} />
      {children}
    </>
  );
}
