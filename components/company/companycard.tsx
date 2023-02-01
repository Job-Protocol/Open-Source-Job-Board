import React from "react";
import styles from "@/styles/Jobcard.module.css";
import { Company } from "@/bubble_types";
import Image from "next/image";
// import RoleConditions from "./detail/roleconditions";

export interface JobCardProps {
  company: Company;
}

export default function CompanyCard(data: JobCardProps) {
  const company = data.company;
  return (
    <a
      href={"TODO"}
      className={styles.card}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div id="horizontal" className={styles.main}>
        <div id="logo" className={styles.horizontal_flow}>
          <img
            // width={150}
            // height={150}
            src={company.logo as string}
            className={styles.logo}
            alt="Logo"
          />
        </div>
        <div id="content" className={styles.horizontal_flow}>
          <p> {company.name} </p>
        </div>

      </div>
    </a>
  );
}
