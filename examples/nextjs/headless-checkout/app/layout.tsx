import './global.css';

export const metadata = {
  title: 'Firmhouse headless checkout',
  description: 'A checkout built with @firmhouse/headless-react',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
