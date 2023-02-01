import React, { useState } from "react";
import { useEffect } from "react";

import styles from "@/styles/Home.module.css";
import JobCard from "@/components/role/jobcard";
import { JobCardProps } from "@/components/role/jobcard";

import config from "../../config.json";

import SearchBox from "@/components/overview/searchbox";

import { Company, Role } from "@/bubble_types";

async function GetCompanyData(): Promise<Company[]> {
  const results = config["dev"]["job-ids"].map(async (roleid) => {
    const result = await fetch("api/role/" + roleid);
    const parsed = await result.json();
    return parsed;
  });
  const role_data = await Promise.all(results);

  return role_data;
}

export default function Companylist() {
  const [cardDataList, setCardDataList] = useState<JobCardProps[]>([]);
  const [userLocation, setUserLocation] = useState<string>("");
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    GetCompanyData().then((res) => {
      setCompanies(res);
    });
  }, []);

  useEffect(() => {
    setCardDataList(cardDataList.slice(0, cardDataList.length - 1));
  }, [userLocation]);

  return (
    <div className={styles.grid}>
      <label className={styles.label}>
        Filter Location: {userLocation as string}
      </label>
      <SearchBox
        handleChange={(v: any) => {
          setUserLocation(v.value as string);
        }}
      />
      {/* {roles.map((role) => (
        <JobCard role={role} key={role.id} />
      ))} */}
    </div>
  );
}
