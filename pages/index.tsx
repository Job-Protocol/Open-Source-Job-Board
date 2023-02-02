import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Joblist from "@/components/overview/joblist";
import Companylist from "@/components/overview/companylist";
import Switch from "react-switch";
import React, { useState, useEffect } from "react";

import { Role } from "@/bubble_types";
import config from "@/config.json";



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
  const [byCompanies, setByCompanies] = useState<boolean>(false);
  const [roles, setRoles] = useState<Role[]>([]);


  useEffect(() => {
    GetRoleData().then((res) => {
      setRoles(res);
    });
  }, []);

  function handleChange(val: boolean) {
    setByCompanies(val);
  }

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
        <label>
          {/* <span>Show companies</span> */}
          <Switch
            onChange={handleChange}
            checked={byCompanies}
            offColor="#ff0000"
            onColor="#00ff00"
            uncheckedIcon={<p>Roles</p>}
            checkedIcon={<p>Companies</p>}
            width={200}
          />
          {/* <span>Show roles</span> */}
        </label>
        {!byCompanies && <Joblist roles={roles} />}
        {byCompanies && <Companylist />}
      </main>
    </>
  );
}
