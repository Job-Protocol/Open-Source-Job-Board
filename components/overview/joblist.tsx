import React, { useState } from "react";
import { useEffect } from "react";

import styles from "@/styles/Joblist.module.css";
import JobCard from "@/components/role/jobcard";
import { JobCardProps } from "@/components/role/jobcard";

import { addressstring_to_type } from "@/utils";
import config from "../../config.json";

import SearchBox from "@/components/overview/searchbox";

import JobFilters from "./jobfilters";

import {
  GeographicAddress,
  Role,
  RoleLocation,
  RoleLocationType,
  TimezoneRange,
} from "@/bubble_types";

export interface Props {
  roles: Role[];
}

export default function Joblist(data: Props) {
  const roles: Role[] = data.roles;

  return (
    <div className={styles.jobListContainer}>
      {roles.map((role) => (
        <JobCard role={role} key={role.id} />
      ))}
    </div>
  );
}
