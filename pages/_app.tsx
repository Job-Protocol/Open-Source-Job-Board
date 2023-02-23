import Head from "next/head";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* Facebook */}
        <meta property="og:title" content="ETH Denver Opportunity Zone" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/social_banner.png" />
        {/* Twitter */}
        <meta name="twitter:title" content="ETH Denver Opportunity Zone" />
        <meta
          name="twitter:description"
          content="Job Board for ETH Denver - a fast-track to the best jobs in Web3 🔥"
        />
        <meta property="twitter:image" content="/social_banner.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
