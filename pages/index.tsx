import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Joblist from "components/joblist";

export default function Home() {
  return (
    <>
      <Head>
        <title>ETH Denver Jobs</title>
        <meta name="description" content="Jobboard for ETHDenver 2023" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/faviconV2.png" />
      </Head>
      <div className={styles.center}>
        <h1 className={styles.pagetitle}>ETH Denver Job Board</h1>
        <p>Below is the full list of open roles. Open any role for details.</p>
      </div>

      <main className={styles.main}>
        <Joblist />
      </main>
    </>
  );
}
