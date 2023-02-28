import Head from "next/head";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* Facebook */}
        <meta property="og:title" content="ETHDenver Opportunity Zone" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={process.env.NEXT_PUBLIC_BASE_URL + "/social_banner.png"}
        />
        {/* Twitter */}
        <meta name="twitter:title" content="ETHDenver Opportunity Zone" />
        <meta
          name="twitter:description"
          content="Job Board for ETHDenver - a fast-track to the best jobs in Web3 🔥"
        />
        <meta
          property="twitter:image"
          content={process.env.NEXT_PUBLIC_BASE_URL + "/social_banner.png"}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
