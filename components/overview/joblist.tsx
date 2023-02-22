import React, { useState } from "react";
import { useEffect } from "react";

import styles from "@/styles/Joblist.module.css";
import JobCard from "@/components/role/jobcard";
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
  roles: Role[] | undefined;
  mode: "application" | "curation";
}

export default function Joblist(data: Props) {


  if (!data.roles) return (<Loading />);
  // if (data.roles.length == 0) return (<p>N data</p>);

  const roles: Role[] = data.roles;

  return (
    <div className={styles.jobListContainer}>
      {roles.map((role) => (
        <JobCard
          role={role}
          key={role.id}
          mode={data.mode}
          handleChange={(val) => { console.log(val) }} />
      ))}
    </div>
  );
}
