import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Roledetailpage.module.css";
import Joblist from "components/joblist";
import JdCard from "components/jdcard";
import ApplyCard from "components/applycard";
import CompanyCard from "components/companycard";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";

// import { RoleDetail } from "../api/role_detail/[id]";
import { Role } from "@/bubble_types";

const inter = Inter({ subsets: ["latin"] });

async function getRoleData(roleid: string): Promise<Role> {
  const result = await fetch("../api/role/" + roleid);
  const parsed = await result.json();
  return parsed;
}

export default function Home() {
  const router = useRouter();
  const id = router.query.id;
  //const [jobDetails, setJobDetails] = useState<Role>();
  const [role, setRole] = useState<Role>();

  useEffect(() => {
    if (id) {
      getRoleData(id as string).then((res) => {
        setRole(res);
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
        <img src={role?.company?.logo} className={styles.logo} alt="Logo" />
        <h1 className={styles.pagetitle}>{role?.title}</h1>
        <h3> @ {role?.company?.name}</h3>
      </div>
      <main className={styles.main}>
        {/* <CompanyCard company={company} /> */}
        <JdCard desc={role?.desc as string} />
        <ApplyCard
          roleid={id}
          company_name={role?.company.name}
          role_title={role?.title}
        />
      </main>
    </>
  );
}
