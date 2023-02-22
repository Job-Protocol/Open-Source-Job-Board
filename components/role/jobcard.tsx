import React from "react";
import styles from "@/styles/Jobcard.module.css";
import { Role } from "@/bubble_types";
import RoleConditions from "./detail/roleconditions";
import Image from "next/image";
import Link from "next/link";

import { RoleState } from "@/bubble_types";


enum ActionType {
  Apply,
  View,
  Add,
}

export interface JobCardProps {
  role: Role;
  mode: "application" | "curation";
  handleChange: (action: ActionType) => void;
}


function content(data: JobCardProps) {
  const role = data.role;
  const link: string = "/role/" + role.slug;
  return (
    <div className={styles.card}>
      <div className={styles.roleInfo}>
        <div className={styles.roleInfoImage}>
          <Image
            src={role.company.logo.replace("//s3", "https://s3")}
            alt="Logo"
            // width={100}
            // height={100}
            fill={true}
            // style={{ objectFit: 'fill' }}
            className={styles.logo}
          />
        </div>

        <div className={styles.roleInfoText}>
          {/* {role.state != RoleState.Live && process.env.NEXT_PUBLIC_ADMIN && <p className="admin">This role is not yet live</p>} */}
          <div className={styles.roleInfoCompanyAndRoleTitleContainer}>
            <p className={"chapeau"}> {role.company.name} </p>
            <h2 className={"body18Bold"}>{role.title}</h2>
          </div>

          <div className={styles.roleConditionsDesktop}>
            <h3 className={"body16"}>{role.company.tagline}</h3>
            <RoleConditions role={role} />
          </div>
        </div>
      </div>

      <div className={styles.roleConditionsMobile}>
        <h3 className={"body16"}>{role.company.tagline}</h3>
        <RoleConditions role={role} />
      </div>
      <div
        className={styles.applyContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {data.mode == 'application' &&
          <button
            type="submit"
            className={"body16Bold " + styles.applyButton}
            name="button-1675001572178"
            onClick={() => data.handleChange(ActionType.Apply)}
            id="button-apply"
          >
            Apply
          </button>}
        {data.mode != 'application' &&
          <div className="flex flex-col">
            <button
              type="submit"
              className={"body16Bold " + styles.applyButton}
              name="button-1675001572178"
              onClick={() => data.handleChange(ActionType.View)}
              id="button-apply"
            >
              View
            </button>
            <button
              type="submit"
              className={"body16Bold " + styles.applyButton}
              name="button-1675001572178"
              onClick={() => data.handleChange(ActionType.Add)}
              id="button-apply"
            >
              Add
            </button>
          </div>
        }

        {/* <div id="apply button" className={styles.horizontal_flow}>
          
        </div> */}
      </div>
    </div>
  );
}

export default function JobCard(data: JobCardProps) {
  const role = data.role;
  const link: string = "/role/" + role.slug;
  return (data.mode == 'application' ?
    <Link href={link}>
      {content(data)}
    </Link> :
    content(data)
  );
}
