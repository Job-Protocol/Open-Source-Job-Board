import Head from "next/head";
import styles from "@/styles/Roledetailpage.module.css";
import JdCard from "@/components/role/detail/jobdesc";
import ApplyCard from "@/components/role/apply";
import CompanyCard from "@/components/role/detail/companyinfo";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { Role } from "@/bubble_types";
import RoleConditions from "@/components/role/detail/roleconditions";

async function getRoleData(roleid: string): Promise<Role> {
  const result = await fetch("../api/role/" + roleid);
  const parsed = await result.json();
  return parsed;
}

export default function Home() {
  const router = useRouter();
  const id = router.query.id;
  const [role, setRole] = useState<Role>();

  useEffect(() => {
    if (id) {
      getRoleData(id as string).then((res) => {
        setRole(res);
      });
    }
  }, [id]);

  if (!role) {
    return;
  }
  return (
    <div>
      <a href={"https://app.jobprotocol.xyz/version-test/role/" + id}>
        <h1>[Admin] Click here to edit role on jobprotocol</h1>
      </a>
      <Head>
        <title>ETH Denver Jobs</title>
        <meta name="description" content="Jobboard for ETHDenver 2023" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/faviconV2.png" />
      </Head>

      <div className={styles.headercard}>
        <div id="header-top" className={styles.flexbox_container}>
          <div className={styles.flex_child}>
            <img src={role?.company?.logo} className={styles.logo} alt="Logo" />
          </div>
          <div className={styles.flex_child}>
            <h1 className={styles.pagetitle}>{role?.title}</h1>
            <p> @{role?.company.name}</p>
            <RoleConditions role={role} />
          </div>
        </div>

        <div id="header-bottom">
          <h3> @ {role?.company?.name}</h3>
        </div>
      </div>
      <main className={styles.main}>
        {role?.company && <CompanyCard company={role.company} />}
        <JdCard desc={role?.desc as string} />
        <ApplyCard
          roleid={id}
          company_name={role?.company.name}
          role_title={role?.title}
        />
      </main>
    </div>
  );
}
