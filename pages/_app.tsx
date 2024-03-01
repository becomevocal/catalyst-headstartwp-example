/* eslint-disable check-file/filename-naming-convention */
import '../app/globals.css';
import '../app/page.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';

import { getInitialData } from '~/client/queries/get-initial-data';

import { BcDataProvider } from '~/providers/bc-data-provider';

import { HeadlessApp } from '@headstartwp/next';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

type InitialProps = Awaited<ReturnType<typeof App.getInitialProps>>;
type Props = AppProps & InitialProps;

export default function App({ Component, pageProps, bcData }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <main className={`${inter.variable} font-sans`}>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <BcDataProvider value={bcData}>
            <HeadlessApp
              pageProps={pageProps}
              swrConfig={{
                /**
                 * Setting this to true will refetch content whenever the tab is refocused
                 */
                revalidateOnFocus: false,
                /**
                 * Settings this to true will refetch content whenever the connection is reestablished
                 */
                revalidateOnReconnect: false,
                /**
                 * Setting this to true will refetch content after initial load
                 */
                revalidateOnMount: false,
              }}
              settings={{
                  // instruct the framework to use Next.js link component or your own version
                  // linkComponent: Link,
              }}
            >
              <Component {...pageProps} />
            </HeadlessApp>
          </BcDataProvider>
        </QueryClientProvider>
      </SessionProvider>
    </main>
  );
}

App.getInitialProps = async () => {
  const bcData = await getInitialData();

  return {
    bcData,
  };
};
