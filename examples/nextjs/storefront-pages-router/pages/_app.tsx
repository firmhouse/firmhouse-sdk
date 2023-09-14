import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { NavBar } from '@firmhouse/ui-components';

function CustomApp({ Component, pageProps }: AppProps) {
  const title = 'Firmhouse Storefront Next.js App / Pages Router';
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="min-h-screen bg-slate-50">
        <NavBar title={title} />
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
