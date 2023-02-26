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
  mode: "application" | "curation" | "remove";
  handleChange: (actiontype: ActionType, role: Role) => void;
}

export default function Joblist(data: Props) {

  const [ignoreIDs, setIgnoreIDs] = useState<string[]>([]);

  // var allroles = data.roles;
  if (data.roles.length == 0) return (<p>No roles</p>);

  return (
    <div className={styles.jobListContainer}>
      <p>{data.roles.length}</p>
      {data.roles.filter(role => !ignoreIDs.includes(role.id)).map((role, index) => (
        <JobCard
          role={role}
          key={role.id}
          mode={data.mode}
          handleChange={(actiontype, role) => {
            //It's ignored in this Joblist, because it's being added to another
            if (actiontype == ActionType.Add) {
              setIgnoreIDs([...ignoreIDs, role.id]);
            }
            data.handleChange(actiontype, role);
          }
          } />
      ))}
    </div>
  );
}
