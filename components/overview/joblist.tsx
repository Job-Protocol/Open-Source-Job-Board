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

  var allroles = data.roles;
  var [variableRoles, setVariableRoles] = useState<Role[]>(data.roles != null ? data.roles : []);
  // const [removeIDs, setRemoveIDs] = useState<string[]>([]);
  // const [addRoles, setAddRoles] = useState<Role[]>([]);

  // useEffect(() => {
  //   if (allroles) {
  //     console.log("Setting variable roles");
  //     setVariableRoles(allroles.filter((val, index) => !removeIDs.includes(val.id)));
  //   }
  // }, [allroles, removeIDs]);

  // useEffect(() => {
  //   if (allroles) {
  //     console.log("Setting variable roles");
  //     setVariableRoles(allroles.filter((val, index) => !removeIDs.includes(val.id)));
  //   }
  // }, [allroles, addRoles]);

  if (variableRoles.length == 0) return (<Loading />);

  var roles: Role[] = data.roles;

  return (
    <div className={styles.jobListContainer}>
      {/* <p>{removeIDs}</p> */}
      {variableRoles.map((role, index) => (
        <JobCard
          role={role}
          key={role.id}
          mode={data.mode}
          handleChange={(actiontype, role) => {
            console.log("id", role);
            console.log("actiontype", actiontype);
            if (actiontype == ActionType.Remove) {
              console.log("Here I am");
              setVariableRoles(variableRoles.filter(vrole => vrole.id != role.id));

            }
            if (actiontype == ActionType.Add) {
              // setAddRoles(addRoles.concat(role));
              // //setVariableRoles(variableRoles.concat(role))
              data.handleChange(actiontype, role);
            }

          }} />
      ))}
    </div>
  );
}
