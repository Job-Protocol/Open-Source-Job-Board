import React, { useState } from "react";
import { useEffect } from "react";

import styles from "@/styles/Joblist.module.sass";
import JobCard, { ActionType } from "@/components/role/jobcard";
import { JobCardProps } from "@/components/role/jobcard";

import { addressstring_to_type } from "@/utils";
import config from "../../config.json";

import SearchBox from "@/components/overview/searchbox";

import JobFilters from "./jobfilters";

import Loading from "@/components/loading"

import {
  GeographicAddress,
  Role,
  RoleLocation,
  RoleLocationType,
  TimezoneRange,
} from "@/bubble_types";

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

  // // var allroles = data.roles;
  // if (roles.length == 0) return (<p>No roles</p>);

  return (
    <div className={styles.jobListContainer}>
      <h2 className="title">{title}</h2>
      {roles.length !== 0 ?

        roles.filter(role => !ignoreIDs.includes(role.id)).map((role, index) => (
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
