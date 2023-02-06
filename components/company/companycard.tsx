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
      href={"company/" + company.id}
      className={styles.card}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div id="horizontal" className={styles.main}>
        <div id="logo" className={styles.horizontal_flow}>
          <Image
            width={100}
            height={100}
            src={company.logo.replace("//s3", "https://s3")}
            alt="Logo"
          />
        </div>
        <div id="content" className={styles.horizontal_flow}>
          <h2> {company.name} </h2>
          <p> {company.tagline}</p>
          <div className={styles.test}>
            {company.num_employees && <p>{company.num_employees} employees  </p>}
            {company.headquarters && <p>•</p>}
            {company.headquarters && <p>{company.headquarters}</p>}
            {company.founding_year && <p>•</p>}
            {company.founding_year && <p>{company.founding_year}</p>}
          </div>

        </div>
      </div>

      <div id="discover button">
        <button
          type="submit"
          className={styles.secondary_button}
          name="button-1675001572178"
          onClick={() => console.log("Button clicked")}
          id="button-apply"
        >
          Disconver
        </button>
      </div>
    </a>
  );
}
