import React from "react";
import styles from "@/styles/Jobcard.module.css";
import { Role } from "@/bubble_types";
import RoleConditions from "./detail/roleconditions";
import Image from "next/image";
import Link from "next/link";

import { RoleState } from "@/bubble_types";


export enum ActionType {
  Apply,
  View,
  Add,
  Remove
}

export interface JobCardProps {
  role: Role;
  mode: "application" | "curation" | "remove";
  handleChange: (id: string, action: ActionType) => void;
}


function content(data: JobCardProps) {
  const role = data.role;
  const link: string = "/role/" + role.slug;


  async function curateRole(id: string, method: "remove" | "add") {
    if (method == "add") {
      const result = await fetch("/api/curate/" + id + "?method=add")
      return result;
    }
    const result = await fetch("/api/curate/" + id + "?method=remove")
    return result;
  }


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
        // className={styles.applyContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {data.mode == 'application' &&
          <button
            type="submit"
            className={"body16Bold " + styles.applyButton}
            name="button-1675001572178"
            onClick={() => data.handleChange(role.id, ActionType.Apply)}
            id="button-apply"
          >
            Apply
          </button>}
        {data.mode == 'remove' &&
          <button
            type="submit"
            className={"body16Bold " + styles.applyButton}
            name="button-1675001572178"
            onClick={() => {
              console.log("removing Role");
              curateRole(role.id, "remove");
              data.handleChange(role.id, ActionType.Remove)
            }
            }
            id="button-apply"
          >
            Remove
          </button>}
        {data.mode == 'curation' &&
          <div className="flex flex-col gap-y-1">
            <Link href={"role/" + role.slug} target="_blank" rel="noopener noreferrer">
              <button
                type="submit"
                className={"body16Bold " + styles.applyButton}
                name="button-1675001572178"
                onClick={() => data.handleChange(role.id, ActionType.View)}
                id="button-apply"
              >
                View
              </button>
            </Link>

            <button
              type="submit"
              className={"body16Bold " + styles.applyButton}
              name="button-1675001572178"
              onClick={() => {
                console.log("adding Role");
                curateRole(role.id, "add");
                data.handleChange(role.id, ActionType.Add)
              }}
              id="button-apply2"
            >
              Add
            </button>
          </div>
        }

        {/* <div id="apply button" className={styles.horizontal_flow}>
          
        </div> */}
      </div>
    </div >
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
