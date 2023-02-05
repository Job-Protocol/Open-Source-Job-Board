import React from "react";
import styles from "@/styles/Jobcard.module.css";
import { Role } from "@/bubble_types";
import RoleConditions from "./detail/roleconditions";
import Image from "next/image";

export interface JobCardProps {
  role: Role;
}

export default function JobCard(data: JobCardProps) {
  const role = data.role;
  const link: string = "role/" + role.id;
  return (
    <a
      href={link}
      className={styles.card}
      // target="_blank"
      rel="alternate"
    >
      <div className={styles.roleInfo}>
        <Image
          src={"https:" + (role.company.logo as string)}
          alt="Logo"
          width={100}
          height={100}
        />

        <div className={styles.roleInfoText}>
          <p className={styles.companyText}> {role.company.name} </p>
          <h2 className={styles.roleTitleText}>{role.title}</h2>
          <RoleConditions role={role} />
        </div>
      </div>
      <div className={styles.applyContainer}>
        <button
          type="submit"
          className={styles.applyButton}
          name="button-1675001572178"
          onClick={() => console.log("Button clicked")}
          id="button-apply"
        >
          Apply
        </button>

        {/* <div id="apply button" className={styles.horizontal_flow}>
          
        </div> */}
      </div>
    </a>
  );
}
