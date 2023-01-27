import React, { useState } from "react";
import { useEffect } from "react";

import styles from "@/styles/Home.module.css";
import JobCard from "components/jobcard";
import { JobCardProps } from "components/jobcard";

import { Inter } from "@next/font/google";
const inter = Inter({ subsets: ["latin"] });
import config from "../config.json";

// interface C {
//   title: string;
//   company_name: string;
// }

async function GetRoleData() {
  const results = config["job-ids"].map(async (roleid) => {
    const result = await fetch("api/role/" + roleid);
    const parsed = await result.json();
    return parsed;
  });
  const role_data = await Promise.all(results);

  // Now resolve the other promises
  const company_data = await Promise.all(
    role_data.map(async (rd) => {
      const result = await fetch("api/company/" + rd.company_id);
      const parsed = await result.json();
      return parsed;
    })
  );

  //Now zip the two arrays
  const zip = (role_data: any, company_data: any) =>
    role_data.map((k: any, i: any) => {
      const carddata: JobCardProps = {
        title: k.title,
        company_name: company_data[i].name,
        role_id: k.id,
      };
      return carddata;
    });

  const card_data = zip(role_data, company_data);

  return card_data;
}

export default function Joblist() {
  const [cardDataList, setCardDataList] = useState<JobCardProps[]>([]);

  useEffect(() => {
    GetRoleData().then((res) => {
      setCardDataList(res);
    });
  }, []);

  return (
    <div className={styles.grid}>
      {cardDataList.map((carddata) => (
        <JobCard
          key={carddata.role_id}
          title={carddata.title}
          company_name={carddata.company_name}
        />
      ))}
    </div>
  );
}
