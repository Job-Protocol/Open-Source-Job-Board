import React, { useState } from "react";
import { useEffect } from "react";

import styles from "@/styles/Joblist.module.css";
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
  roles: Role[] | null;
  mode: "application" | "curation" | "remove";
}

export default function Joblist(data: Props) {

  var allroles = data.roles;

  var [variableRoles, setVariableRoles] = useState<Role[]>([]);

  // const [flip, setFlip] = useState(false);

  const [removeIDs, setRemoveIDs] = useState<string[]>([]);

  useEffect(() => {
    if (allroles) {
      console.log("Setting variable roles");
      setVariableRoles(allroles.filter((val, index) => !removeIDs.includes(val.id)));
    }
  }, [allroles, removeIDs]);

  // useEffect(() => {


  //   setVariableRoles(variableRoles.filter((value, index) => index != actionIndex));
  // }, [flip, actionIndex, allroles]);





  if (!data.roles) return (<Loading />);
  // if (data.roles.length == 0) return (<p>N data</p>);

  var roles: Role[] = data.roles;

  return (
    <div className={styles.jobListContainer}>
      <p>{removeIDs}</p>
      {variableRoles.map((role, index) => (
        <JobCard
          role={role}
          key={role.id}
          mode={data.mode}
          handleChange={(id, actiontype) => {
            console.log("id", id);
            console.log("actiontype", actiontype);
            if (actiontype == ActionType.Remove) {
              setRemoveIDs(removeIDs.concat(id));
            }

          }} />
      ))}
    </div>
  );
}
