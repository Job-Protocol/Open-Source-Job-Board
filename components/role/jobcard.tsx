import React from "react";
import styles from "@/styles/Jobcard.module.sass";
import { Role } from "@/bubble_types";
import RoleConditions from "./detail/roleconditions";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";

import { RoleState } from "@/bubble_types";

export enum ActionType {
  Apply,
  View,
  Add,
  Remove,
}

export interface JobCardProps {
  role: Role;
  mode: "application" | "curation" | "remove";
  showBounty: boolean;
  handleChange: (action: ActionType, role: Role) => void;
}

function content(data: JobCardProps) {
  const role = data.role;
  const link: string = "/role/" + role.slug;

  async function curateRole(id: string, method: "remove" | "add"): Promise<boolean> {
    if (method == "add") {
      const result = await fetch("/api/curate/" + id + "?method=add");
      return result.status == 200;
    }

    const result = await fetch("/api/curate/" + id + "?method=remove");
    return result.status == 200;
  }

  return (
    <div className={styles.card}>
      <div className={styles.roleInfo}>

        <div className={styles.Image}>
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
          <div className={styles.roleInfoCompanyAndRoleTitleContainer}>
            <p className={"chapeau"}> {role.company.name} </p>
            <h2 className={"body18Bold"}>{role.title}</h2>
          </div>

          <div
            className={styles.roleConditionsDesktop}
          //onClick={(e) => e.stopPropagation()}
          //onMouseEnter={(e) => e.stopPropagation()}
          // onClick={(e) => e.stopPropagation()}
          >
            <h3 className={"body16"}>{role.company.tagline}</h3>
            <RoleConditions role={role} showBounty={data.showBounty} />
          </div>
        </div>
      </div>

      <div className={styles.roleConditionsMobile}>
        <h3 className={"body16"}>{role.company.tagline}</h3>
        <RoleConditions role={role} showBounty={data.showBounty} />
      </div>
      <div
        // className={styles.applyContainer}
        onClick={(e) => e.stopPropagation()}
        className={styles.buttonContainer}
      >
        {data.mode == "application" && (
          <button
            type="submit"
            className={"body16Bold " + styles.applyButton}
            name="button-1675001572178"
            onClick={() => data.handleChange(ActionType.Apply, role)}
            id="button-apply"
          >
            Apply
          </button>
        )}
        {data.mode == "remove" && (
          <button
            type="submit"
            className={"body16Bold " + styles.applyButton}
            name="button-1675001572178"
            onClick={() => {
              curateRole(role.id, "remove").then((success) => {
                if (success === true) {
                  data.handleChange(ActionType.Remove, role);
                } else {
                  Swal.fire({
                    title: "Error !",
                    text: "Adding role failes. Reach out to us if this is a continous issue",
                    icon: "error",
                    iconColor: "#481f84",
                    confirmButtonText: "Close",
                  })
                }
              });
            }}
            id="button-apply"
          >
            Remove
          </button>
        )}
        {data.mode == "curation" && (
          <div className="flex flex-col gap-y-1">
            <Link
              href={"role/" + role.slug}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                type="submit"
                className={"body16Bold " + styles.applyButton}
                name="button-1675001572178"
                onClick={() => data.handleChange(ActionType.View, role)}
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

                curateRole(role.id, "add").then((success) => {
                  if (success === true) {
                    data.handleChange(ActionType.Remove, role);
                  } else {
                    Swal.fire({
                      title: "Error !",
                      text: "Adding role failes. Reach out to us if this is a continous issue",
                      icon: "error",
                      iconColor: "#481f84",
                      confirmButtonText: "Close",
                    })
                  }
                });

                data.handleChange(ActionType.Add, role);
              }}
              id="button-apply2"
            >
              Add
            </button>
          </div>
        )}

        {/* <div id="apply button" className={styles.horizontal_flow}>
          
        </div> */}
      </div>
    </div >
  );
}

export default function JobCard(data: JobCardProps) {
  const role = data.role;
  const link: string = "/role/" + role.slug;
  return data.mode == "application" ? (
    <Link href={link}>{content(data)}</Link>
  ) : (
    content(data)
  );
}
