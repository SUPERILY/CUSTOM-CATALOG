import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import '../globals.css';
import { Layout } from '../components/Layout';
import { ToastProvider } from '../components/ToastProvider';
import { StockStatusProvider } from '../contexts/StockStatusContext';
import { StoreSettingsProvider } from '../contexts/StoreSettingsContext';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <ToastProvider>
      <StockStatusProvider>
        <StoreSettingsProvider>
          {getLayout(<Component {...pageProps} />)}
        </StoreSettingsProvider>
      </StockStatusProvider>
    </ToastProvider>
  );
}

export default MyApp;
