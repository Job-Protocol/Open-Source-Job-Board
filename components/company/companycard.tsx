import React from "react";
import styles from "@/styles/Jobcard.module.css";
import { Role } from "@/bubble_types";
// import RoleConditions from "./detail/roleconditions";

export interface JobCardProps {
  company: Company;
}

export default function CompanyCard(data: JobCardProps) {
  const company = data.company;
  return (
    <a
      href={link}
      className={styles.card}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div id="horizontal" className={styles.main}>
        <div id="logo" className={styles.horizontal_flow}>
          <img
            src={role.company.logo as string}
            className={styles.logo}
            alt="Logo"
          />
        </div>
        <div id="content" className={styles.horizontal_flow}>
          <h2>
            {role.title} <span>-&gt;</span>
          </h2>
          <p> {role.company.name} </p>
        </div>

        <div id="apply button" className={styles.horizontal_flow}>
          <button
            type="submit"
            className={styles.primary_button}
            name="button-1675001572178"
            onClick={() => console.log("Button clicked")}
            id="button-apply"
          >
            Apply Now
          </button>
        </div>
      </div>
    </a>
  );
}
