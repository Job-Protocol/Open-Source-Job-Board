import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Roledetailpage.module.css";
import Joblist from "components/joblist";
import JdCard from "components/jdcard";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { RoleDetail } from "../api/role_detail/[id]";

const inter = Inter({ subsets: ["latin"] });

async function getRoleData(roleid: string): Promise<RoleDetail> {
  const result = await fetch("../api/role_detail/" + roleid);
  const parsed = await result.json();
  return parsed;
}

export default function Home() {
  const router = useRouter();
  const id = router.query.id;
  const [jobDetails, setJobDetails] = useState<RoleDetail>();

  useEffect(() => {
    if (id) {
      getRoleData(id as string).then((res) => {
        setJobDetails(res);
      });
    }
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
        <img src={jobDetails?.logo} className={styles.logo} alt="Logo" />
        <h1 className={styles.pagetitle}>{jobDetails?.title}</h1>
        <h3> @ {jobDetails?.company_name}</h3>
      </div>
      <main className={styles.main}>
        <JdCard desc={jobDetails?.desc as string} />
      </main>
    </>
  );
}
