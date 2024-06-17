import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { NavBar } from '@firmhouse/ui-components';
import Link from 'next/link';

function CustomApp({ Component, pageProps }: AppProps) {
  const title = 'Firmhouse Storefront Next.js App / Pages Router';
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="min-h-screen bg-slate-50">
        <NavBar title={title}>
          {Component.displayName === 'Index' && (
            <Link href="/self-service-center/login">Manage subscription</Link>
          )}
        </NavBar>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
