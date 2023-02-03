import Head from "next/head";
import styles from "@/styles/Roledetailpage.module.css";
import JdCard from "@/components/role/detail/jobdesc";
import ApplyCard from "@/components/role/apply";
import CompanyCard from "@/components/role/detail/companyinfo";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import config from "@/config.json";

import { Company, Role } from "@/bubble_types";
import RoleConditions from "@/components/role/detail/roleconditions";
import Joblist from "@/components/overview/joblist";


async function getCompanyData(id: string): Promise<Company> {

  const result = await fetch("../api/company/" + id);
  const parsed = await result.json();
  return parsed;
};

async function GetRoleData(): Promise<Role[]> {
  const results = config["dev"]["job-ids"].map(async (roleid) => {
    const result = await fetch("/api/role/" + roleid);
    const parsed = await result.json();
    return parsed;
  });
  const role_data = await Promise.all(results);
  return role_data;
};

export default function Home() {
  const router = useRouter();
  const id = router.query.id;
  const [company, setCompany] = useState<Company>();
  const [companyroles, setCompanyRoles] = useState<Role[]>([]);

  useEffect(() => {
    if (id) {
      getCompanyData(id as string).then((res) => {
        setCompany(res);
      });
      GetRoleData().then((res) => {
        const filtered = res.filter((role) => { console.log(role.company.id, id, role.company.id === id); return role.company.id === id; });
        setCompanyRoles(filtered);
      });
    }

  }, [id]);

  if (!company) {
    return <p> No company {id}</p>;
  }
  return (
    <div>
      <a href={"https://app.jobprotocol.xyz/version-test/company/" + id}>
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
            <img src={company.logo} className={styles.logo} alt="Logo" />
          </div>
          <div className={styles.flex_child}>
            <h1 className={styles.pagetitle}>{company.name}</h1>
            {/* <RoleConditions role={role} /> */}
          </div>
        </div>
      </div>

      <main className={styles.main}>
        <Joblist roles={companyroles} />
      </main>


    </div>
  );
}
