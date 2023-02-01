import Head from "next/head";
import styles from "@/styles/Roledetailpage.module.css";
import JdCard from "@/components/role/detail/jobdesc";
import ApplyCard from "@/components/role/apply";
import CompanyCard from "@/components/role/detail/companyinfo";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { Company } from "@/bubble_types";
import RoleConditions from "@/components/role/detail/roleconditions";

async function getCompanyData(companyid: string): Promise<Company> {

  const result = await fetch("../api/role/" + companyid);
  const parsed = await result.json();
  return parsed;
}

export default function Home() {
  const router = useRouter();
  const id = router.query.id;
  const [role, setRole] = useState<Company>();

  // useEffect(() => {
  //   if (id) {
  //     getRoleData(id as string).then((res) => {
  //       setRole(res);
  //     });
  //   }
  // }, [id]);

  // if (!role) {
  //   return;
  // }
  return (
    <div>
      <p>This page will list all roles for company with id {id}</p>
    </div>
  );
}
