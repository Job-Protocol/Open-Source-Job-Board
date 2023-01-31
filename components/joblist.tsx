import React, { useState } from "react";
import { useEffect } from "react";

import styles from "@/styles/Home.module.css";
import JobCard from "components/jobcard";
import { JobCardProps } from "components/jobcard";

import { Inter } from "@next/font/google";
const inter = Inter({ subsets: ["latin"] });
import config from "../config.json";

import SearchBox from "components/searchbox";

import { Role } from "@/bubble_types";

async function GetRoleData(): Promise<Role[]> {
  const results = config["dev"]["job-ids"].map(async (roleid) => {
    const result = await fetch("api/role/" + roleid);
    const parsed = await result.json();
    return parsed;
  });
  const role_data = await Promise.all(results);

  console.log("ROLE DATA", role_data);
  return role_data;
}

export default function Joblist() {
  const [cardDataList, setCardDataList] = useState<JobCardProps[]>([]);
  const [userLocation, setUserLocation] = useState<string>("");
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    GetRoleData().then((res) => {
      setRoles(res);
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
      {roles.map((role) => (
        <JobCard role={role} />
      ))}
    </div>
  );
}
