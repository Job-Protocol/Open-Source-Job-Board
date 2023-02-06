import Head from "next/head";
import styles from "@/styles/Roledetailpage.module.css";
import JdCard from "@/components/role/detail/jobdesc";
import ApplyCard from "@/components/role/apply";
import CompanyCard from "@/components/role/detail/companyinfo";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { getConfig } from "@/utils";
import Image from "next/image";

import { Company, Role } from "@/bubble_types";
import RoleConditions from "@/components/role/detail/roleconditions";
import Joblist from "@/components/overview/joblist";

import JobFilters from "@/components/overview/jobfilters";
import { GeographicAddress } from "@/bubble_types";

import Filter from "@/components/overview/filter"


async function getCompanyData(id: string): Promise<Company> {

  const result = await fetch("../api/company/" + id);
  const parsed = await result.json();
  return parsed;
};

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
  const router = useRouter();
  const id = router.query.id;
  const [company, setCompany] = useState<Company>();
  const [companyroles, setCompanyRoles] = useState<Role[]>([]);
  const [filteredCompanyroles, setFilteredCompanyRoles] = useState<Role[]>([]);
  const [userAddress, setUserAddress] = useState<GeographicAddress | undefined>(undefined);
  const [remoteOnly, setRemoteOnly] = useState<boolean>(false);
  const [filter, setFilter] = useState<Filter>();



  useEffect(() => {
    if (id) {
      getCompanyData(id as string).then((res) => {
        setCompany(res);
      });
      GetRoleData().then((res) => {
        const filtered = res.filter((role) => { return role.company.id === id; });
        setCompanyRoles(filtered);
      });
    }

  }, [id]);

  useEffect(() => {
    if (companyroles) {
      setFilter(new Filter(companyroles));
    }
  }, [companyroles]);

  useEffect(() => {
    if (filter) {
      setFilteredCompanyRoles(filter.getFilteredRoles(userAddress, remoteOnly))
    }
  }, [userAddress, remoteOnly, filter]);

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
            <Image
              width={150}
              height={150}
              src={company.logo}
              className={styles.logo}
              alt="Logo" />
          </div>
          <div className={styles.flex_child}>
            <h1 className={styles.pagetitle}>{company.name}</h1>
            {/* <RoleConditions role={role} /> */}
          </div>
        </div>
      </div>

      <main className={styles.main}>
        <JobFilters handleChange={(userAddress, remoteOnly) => {
          setUserAddress(userAddress);
          setRemoteOnly(remoteOnly == true);
        }} />
        <Joblist roles={filteredCompanyroles} />
      </main>


    </div>
  );
}
