import React, { useState } from "react";
import { useEffect } from "react";

import styles from "@/styles/Companylist.module.sass";
import CompanyCard from "../company/companycard";

// import config from "../../config.json";

import SearchBox from "@/components/overview/searchbox";

import { getConfig } from "@/utils";

import { Company, Role } from "@/bubble_types";

import Loading from "@/components/loading"

export interface Props {
  companies: Company[] | null;
}

export default function Companylist(data: Props) {

  if (!data.companies) return (<Loading />);

  return (
    <div className={styles.companyListContainer}>
      {data.companies.map((company: Company) => (
        <CompanyCard key={company.name} company={company} />
      ))}
    </div>
  );
}
