// Importing global styles from Ant Design.
import "antd/dist/antd.css";
import React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import MainLayout from "../lib/components/MainLayout/MainLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Creating a client for React Query with default options.
const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnReconnect: true,
      staleTime: 1000 * 60 * 60 * 24,
    },
  },
});

const MyApp = ({ Component }: AppProps) => {
  return (
    <>
      {/* Head component for setting the title and meta tags of the page. */}
      <Head>
        <title>Relay Club Checkout</title>
        <meta
          name="description"
          content="Checkout Page for Relay Club Computer Shop!"
        />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      {/* QueryClientProvider to provide the React Query client to the app. */}
      <QueryClientProvider client={client}>
        {/* MainLayout component to apply a consistent layout across the app. */}
        <MainLayout>
          {/* Rendering the current page's component. */}
          <Component />
        </MainLayout>
      </QueryClientProvider>
    </>
  );
};

export default MyApp;
