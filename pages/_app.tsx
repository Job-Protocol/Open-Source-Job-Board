import Head from "next/head";
import '@/styles/globals.sass'
import type { AppProps } from 'next/app'
import customer_config from "../customer_config.json";
// import { SessionProvider } from 'next-auth/react';
import React, { useState, useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {

  const [token, setToken] = useState<string | undefined>(undefined);

  return (
    <>
      {/* <SessionProvider> */}
      <Head>
        {/* Facebook */}
        <link rel="shortcut icon" href={customer_config.branding.favicon} />

        <meta property="og:title" content={customer_config.title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/social_banner.png" />
        {/* Twitter */}
        <meta name="twitter:title" content={customer_config.title} />
        <meta
          name="twitter:description"
          content={customer_config.title + "-" + customer_config.title}
        />
        {/* <meta property="twitter:image" content="/social_banner.png" /> //TODO */}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Component {...pageProps} />
      {/* </SessionProvider> */}
    </>

  );
}
