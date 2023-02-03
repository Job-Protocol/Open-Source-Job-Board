import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Joblist from "@/components/overview/joblist";
import Companylist from "@/components/overview/companylist";

import React, { useState, useEffect } from "react";

import { Role } from "@/bubble_types";
import JobFilters from "@/components/overview/jobfilters";

import { GeographicAddress } from "@/bubble_types";
import Filter from "../components/overview/filter"
import Switch from "react-switch";
import { getConfig } from "@/utils";


async function GetRoleData(): Promise<Role[]> {
  const results = getConfig()["job-ids"].map(async (roleid: string) => {
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
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [userAddress, setUserAddress] = useState<GeographicAddress | undefined>(undefined);
  const [remoteOnly, setRemoteOnly] = useState<boolean>(false);
  const [filter, setFilter] = useState<Filter>();


  useEffect(() => {
    GetRoleData().then((res) => {
      setRoles(res);
      setFilteredRoles(res);
    });
  }, []);

  useEffect(() => {
    if (roles) {
      setFilter(new Filter(roles));
    }
  }, [roles]);

  useEffect(() => {
    if (filter) {
      setFilteredRoles(filter.getFilteredRoles(userAddress, remoteOnly))
    }
  }, [userAddress, remoteOnly, filter]);



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
        {/* <p> User address: {userAddress?.address}</p>
        <p> Remote only: {remoteOnly}</p> */}

        <label>
          <span>Show companies</span>
          <Switch
            onChange={(v: any) => setByCompanies(v)}
            checked={byCompanies}
            offColor="#ff0000"
            onColor="#00ff00"
            uncheckedIcon={<p>Roles</p>}
            checkedIcon={<p>Companies</p>}
            width={200}
          />
        </label>

        {!byCompanies && <JobFilters handleChange={(userAddress, remoteOnly) => {
          setUserAddress(userAddress);
          setRemoteOnly(remoteOnly == true);
        }} />}
        {!byCompanies && <Joblist roles={filteredRoles} />}
        {byCompanies && <Companylist />}
      </main>
    </>
  );
}
