import React, { useState } from "react";
import { useEffect } from "react";

import styles from "@/styles/Companylist.module.css";
import CompanyCard from "../company/companycard";

// import config from "../../config.json";

import SearchBox from "@/components/overview/searchbox";

import { getConfig } from "@/utils";

import { Company, Role } from "@/bubble_types";

async function GetCompanyData(): Promise<Company[]> {
  const results = getConfig()["company-ids"].map(async (companyid: string) => {
    const result = await fetch("api/company/" + companyid);
    const parsed = await result.json();
    return parsed;
  });
  const role_data = await Promise.all(results);

  return role_data;
}

export interface Props {
  companies: Company[];
}

export default function Companylist(data: Props) {

  return (
    <div className={styles.companyListContainer}>
      {data.companies.map((company: Company) => (
        <CompanyCard key={company.name} company={company} />
      ))}
    </div>
  );
}
