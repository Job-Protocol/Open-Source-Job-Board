import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Joblist from "components/joblist";
import JdCard from "components/jdcard";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

async function getRoleData(roleid: string): Promise<string> {
  console.log("roleid", roleid);
  const result = await fetch("../api/role/" + roleid);
  const parsed = await result.json();
  console.log("PARSED", parsed);
  return parsed.desc;
}

export default function Home() {
  const router = useRouter();
  const id = router.query.id;

  const [cardDataList, setCardDataList] = useState<string>();

  useEffect(() => {
    getRoleData(id as string).then((res) => {
      setCardDataList(res);
    });
  }, [id]);
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
        <p>Details for role with ID: {id} </p>
      </div>
      <div className={styles.center}>
        <JdCard desc={cardDataList as string} />
      </div>
    </>
  );
}
