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
import PageSelector from "./pageselector";

export interface Props {
  roles: Role[] | undefined;
  numItemsPerPage: number;
}

export default function Joblist(data: Props) {


  const [firstItemIndex, setFirstItemIndex] = useState<number>(0);
  const [lastItemIndex, setLastItemIndex] = useState<number>(data.roles ? data.roles.length - 1 : 0);

  useEffect(() => {
    console.log("Data changed. Reset first item index to 0");
    setFirstItemIndex(0);
    setLastItemIndex((data.roles ? data.roles.length - 1 : 0));
  }, [data]);


  if (!data.roles) return (<Loading />);
  // if (data.roles.length == 0) return (<p>N data</p>);

  const roles: Role[] = data.roles;

  return (
    <div className={styles.jobListContainer}>
      {/* <p>Lenght of role in joblist {data.roles.length} {firstItemIndex} {lastItemIndex}</p> */}

      {roles.slice(firstItemIndex, lastItemIndex + 1).map((role, index) => (
        <div key={index}>
          {/* <p>{index}</p> */}
          <JobCard role={role} key={role.id} />
        </div>
      ))}
      <PageSelector
        numItems={data.roles.length}
        numItemsPerPage={data.numItemsPerPage}
        handlePageChange={(firstItemIndex: number, lastItemIndex: number) => {
          setFirstItemIndex(firstItemIndex);
          setLastItemIndex(lastItemIndex);
        }}
      />
    </div>
  );
}
