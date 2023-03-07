import React from "react";
import styles from "@/styles/Companycard.module.sass";
import { Company } from "@/bubble_types";
import Image from "next/image";
// import RoleConditions from "./detail/roleconditions";

import Link from "next/link";

export interface JobCardProps {
  company: Company;
}

export default function CompanyCard(data: JobCardProps) {
  const company = data.company;
  return (
    <Link
      href={"company/" + company.slug}
      className={styles.companyCard}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div id="horizontal" className={styles.cardContainer}>
        <div id="logo" className={styles.horizontal_flow}>
          <div className={styles.logoContainer}>
            <Image
              fill={true}
              src={company.logo.replace("//s3", "https://s3")}
              alt="Logo"
              className={styles.logo}
            />
          </div>

          <div id="content" className={styles.cardContents}>
            <h2 className="body18Bold"> {company.name} </h2>
            <div className={styles.cardMainTagline}>
              <p className="body16"> {company.tagline}</p>
            </div>
          </div>
        </div>

        <div className={styles.cardMainContents}>
          <div className={"body14 " + styles.companyFactsContainer}>
            {company.num_employees && (
              <p>{company.num_employees} employees </p>
            )}
            {company.headquarters && <p>•</p>}
            {company.headquarters && <p>{company.headquarters}</p>}
            {company.founding_year && <p>•</p>}
            {company.founding_year && <p>{company.founding_year}</p>}
          </div>
          <button
            type="submit"
            className={styles.discoverButton}
            name="button-1675001572178"
            onClick={() => console.log("Button clicked")}
            id="button-apply"
          >
            Discover
          </button>
        </div>

      </div>
    </Link>
  );
}
