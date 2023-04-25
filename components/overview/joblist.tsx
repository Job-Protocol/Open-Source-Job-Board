import React, { useState } from "react";
import { useEffect } from "react";

import styles from "@/styles/Joblist.module.sass";
import styles2 from "@/styles/Home.module.sass";
import JobCard, { ActionType } from "@/components/role/jobcard";

// import SearchBox from "@/components/overview/searchbox";
// import JobFilters from "./jobfilters";
import RoleFilter from "@/components/overview/filter";
import { Role, } from "@/bubble_types";

export interface Props {
  roles: Role[];
  title?: string | undefined;
  mode: "application" | "curation" | "remove";
  showBounty: boolean;
  handleChange: (actiontype: ActionType, role: Role) => void;
}

export default function Joblist({ roles, title = undefined, mode, showBounty, handleChange }: Props) {
  // const { roles, title, mode, showBounty, handleChange } = Props;

  const [ignoreIDs, setIgnoreIDs] = useState<string[]>([]);
  const [searchTerm, setSearchterm] = useState<string>("");
  const [filteredRoles, setFilteredRoles] = useState<Role[]>(roles);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>(new RoleFilter());


  useEffect(() => {//TODO(scheuclu): Remove hard coded password
    setFilteredRoles(roleFilter.getFilteredRoles(roles, null, null, null, searchTerm));
  }, [searchTerm, roleFilter, roles]);


  return (
    <div className={styles.jobListContainer}>
      <h2 className="title">{title}</h2>


      {mode === "curation" &&
        <div className={styles2.inputContainer}>
          <div className={styles2.inputIconContainer}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.2356 13.765C14.3658 13.6348 14.3658 13.4237 14.2357 13.2935L10.876 9.93327C11.602 9.0026 12 7.86589 12 6.66659C12 5.24194 11.4447 3.90389 10.4373 2.89591C9.43002 1.88794 8.09132 1.33325 6.66668 1.33325C5.24203 1.33325 3.90268 1.88794 2.89601 2.89591C1.88803 3.90389 1.33334 5.24194 1.33334 6.66659C1.33334 8.09123 1.88803 9.43058 2.89601 10.4373C3.90268 11.4452 5.24203 11.9999 6.66668 11.9999C7.86598 11.9999 9.0027 11.6026 9.93336 10.8765L13.293 14.2362C13.4232 14.3664 13.6342 14.3664 13.7644 14.2362L14.2356 13.765ZM9.49464 9.49528C8.73935 10.2506 7.73471 10.6666 6.66668 10.6666C5.59799 10.6666 4.594 10.2506 3.83871 9.49528C3.08269 8.73991 2.66668 7.73527 2.66668 6.66659C2.66668 5.59855 3.08269 4.59391 3.83871 3.83862C4.594 3.0826 5.59799 2.66659 6.66668 2.66659C7.73471 2.66659 8.73935 3.0826 9.49464 3.83862C10.2507 4.59391 10.6667 5.59855 10.6667 6.66659C10.6667 7.73527 10.2507 8.73991 9.49464 9.49528Z"
                fill="#1F2534"
              />
            </svg>
          </div>

          <input
            className={"body16 " + styles2.input}
            placeholder="Search"
            onChange={(value) =>
              setTimeout(function () {
                setSearchterm(value.target.value.replace(/\s+$/, ""));
              }, 1000)
            }
          ></input>
        </div>
      }



      {filteredRoles.length !== 0 ?

        filteredRoles.filter(role => !ignoreIDs.includes(role.id)).map((role, index) => (
          <JobCard
            role={role}
            key={role.id}
            showBounty={showBounty}
            mode={mode}
            handleChange={(actiontype, role) => {
              //It's ignored in this Joblist, because it's being added to another
              if (actiontype == ActionType.Add) {
                setIgnoreIDs([...ignoreIDs, role.id]);
              }
              handleChange(actiontype, role);
            }
            } />
        )) :
        <p> - </p>

      }

    </div>
  );
}
