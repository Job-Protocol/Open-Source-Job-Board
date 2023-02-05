import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import SearchBox from "@/components/overview/searchbox";
import Joblist from "@/components/overview/joblist";
import Companylist from "@/components/overview/companylist";
import SwitchRolesCompanies from "@/components/overview/switch_roles_companies";
import Select from "react-select";

import React, { useState, useEffect } from "react";

import { Role } from "@/bubble_types";
import JobFilters from "@/components/overview/jobfilters";

import { GeographicAddress } from "@/bubble_types";
import Filter from "../components/overview/filter";
import Switch from "react-switch";
import { getConfig } from "@/utils";

async function GetRoleData(): Promise<Role[]> {
  const results = getConfig()["job-ids"].map(async (roleid: string) => {
    const result = await fetch("/api/role/" + roleid);
    const parsed = await result.json();
    return parsed;
  });
  const role_data = await Promise.all(results);
  return role_data;
}

export default function Home() {
  const [byCompanies, setByCompanies] = useState<boolean>(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [userAddress, setUserAddress] = useState<GeographicAddress | undefined>(
    undefined
  );
  const [remoteOnly, setRemoteOnly] = useState<boolean>(false);
  const [filter, setFilter] = useState<Filter>();

  useEffect(() => {
    GetRoleData().then((res) => {
      setRoles(res);
      setFilteredRoles(res);
    });
  }, []);

  useEffect(() => {
    if (roles) {
      setFilter(new Filter(roles));
    }
  }, [roles]);

  useEffect(() => {
    if (filter) {
      setFilteredRoles(filter.getFilteredRoles(userAddress, remoteOnly));
    }
  }, [userAddress, remoteOnly, filter]);

  function handleChange(val: boolean) {
    setByCompanies(val);
  }

  return (
    <>
      <Head>
        <title>ETH Denver Jobs</title>
        <meta name="description" content="Jobboard for ETHDenver 2023" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/faviconV2.png" />
      </Head>
      <div className={"page"}>
        <div className={"pageContainer"}>
          <div className={styles.coverImageContainer}>
            <Image
              src={"/background_eth_3.jpg"}
              alt="Header image"
              fill
              style={{
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
              }}
              objectFit="cover"
            />
          </div>
          <div className={styles.headerContainer}>
            <div className={styles.logoImageContainer}>
              <Image
                src={"/EDEN22Logo_Black.svg"}
                alt="Header image"
                fill
                //style={{borderRadius: 8}}
                // objectFit="cover"
              />
            </div>
            <div className={styles.headerTextContainer}>
              <h1 className={styles.h1}>ETH Denver Job Board</h1>
              <h2 className={styles.subTitle}>The best jobs in crypto</h2>
              <div className={styles.headerIconsContainer}>
                <Image
                  src={"/globe.svg"}
                  alt="Globe icon"
                  width={16}
                  height={16}
                  //style={{borderRadius: 8}}
                  // objectFit="cover"
                />
                <Image
                  src={"/twitter.svg"}
                  alt="Twitter icon"
                  width={16}
                  height={16}
                  //style={{borderRadius: 8}}
                  // objectFit="cover"
                />
                <Image
                  src={"/facebook.svg"}
                  alt="Twitter icon"
                  width={16}
                  height={16}
                  //style={{borderRadius: 8}}
                  // objectFit="cover"
                />
                <Image
                  src={"/linkedin-square-colored.svg"}
                  alt="Twitter icon"
                  width={16}
                  height={16}
                  //style={{borderRadius: 8}}
                  // objectFit="cover"
                />
                <Image
                  src={"/Discord_Logo_sans_texte 1.svg"}
                  alt="Twitter icon"
                  width={16}
                  height={16}
                  //style={{borderRadius: 8}}
                  // objectFit="cover"
                />
              </div>
            </div>

            <div className={styles.headerPoweredByContainer}>
              <svg
                width="12"
                height="15"
                viewBox="0 0 12 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.4505 5.80674C11.3905 5.69159 11.2988 5.59481 11.1855 5.52701C11.0722 5.45921 10.9417 5.42308 10.8085 5.42273H7.2029V1.23322C7.21063 1.08009 7.16608 0.928706 7.07613 0.802572C6.98619 0.676324 6.85592 0.582341 6.70525 0.535C6.56049 0.488825 6.40426 0.488359 6.25913 0.53348C6.11401 0.578601 5.98749 0.667209 5.89755 0.786323L0.1281 8.46719C0.0559041 8.56831 0.0124393 8.68614 0.00229869 8.80876C-0.00784258 8.93138 0.0156996 9.05447 0.0703902 9.1654C0.120855 9.29235 0.208508 9.40223 0.322476 9.48159C0.436446 9.56096 0.572026 9.60644 0.712308 9.61228H4.31825V13.8018C4.31837 13.9491 4.36642 14.0925 4.45588 14.2116C4.54523 14.3307 4.67115 14.4195 4.8158 14.4652C4.88824 14.4869 4.96345 14.4986 5.03939 14.5C5.27011 14.5006 5.4873 14.3942 5.62348 14.2137L11.3929 6.53285C11.4706 6.42858 11.517 6.30585 11.5273 6.17773C11.5374 6.04961 11.5107 5.92128 11.4505 5.80674Z"
                  fill="#EE4C83"
                />
              </svg>
              Powered by
              <Image
                src={"/Opolis_textonly.svg"}
                width={90}
                height={50}
                alt="Opolis"
              />
              &
              <Image
                src={"/JP_black.svg"}
                width={120}
                height={50}
                alt="Opolis"
              />
            </div>
          </div>

          <div className={styles.filtersContainer}>
            <div className={styles.row}>
              <SwitchRolesCompanies
                onChange={(v: any) => setByCompanies(v)}
                checked={byCompanies}
              />
              <div className={styles.inputContainer}>
                <div className={styles.inputIconContainer}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M14.2356 13.765C14.3658 13.6348 14.3658 13.4237 14.2357 13.2935L10.876 9.93327C11.602 9.0026 12 7.86589 12 6.66659C12 5.24194 11.4447 3.90389 10.4373 2.89591C9.43002 1.88794 8.09132 1.33325 6.66668 1.33325C5.24203 1.33325 3.90268 1.88794 2.89601 2.89591C1.88803 3.90389 1.33334 5.24194 1.33334 6.66659C1.33334 8.09123 1.88803 9.43058 2.89601 10.4373C3.90268 11.4452 5.24203 11.9999 6.66668 11.9999C7.86598 11.9999 9.0027 11.6026 9.93336 10.8765L13.293 14.2362C13.4232 14.3664 13.6342 14.3664 13.7644 14.2362L14.2356 13.765ZM9.49464 9.49528C8.73935 10.2506 7.73471 10.6666 6.66668 10.6666C5.59799 10.6666 4.594 10.2506 3.83871 9.49528C3.08269 8.73991 2.66668 7.73527 2.66668 6.66659C2.66668 5.59855 3.08269 4.59391 3.83871 3.83862C4.594 3.0826 5.59799 2.66659 6.66668 2.66659C7.73471 2.66659 8.73935 3.0826 9.49464 3.83862C10.2507 4.59391 10.6667 5.59855 10.6667 6.66659C10.6667 7.73527 10.2507 8.73991 9.49464 9.49528Z"
                      fill="#1F2534"
                    />
                  </svg>
                </div>
                <input className={styles.input} placeholder="Search"></input>
              </div>
            </div>
            {!byCompanies && (
              <JobFilters
                handleChange={(userAddress, remoteOnly) => {
                  setUserAddress(userAddress);
                  setRemoteOnly(remoteOnly == true);
                }}
              />
            )}
          </div>
          {!byCompanies && <Joblist roles={filteredRoles} />}
          {byCompanies && <Companylist />}
          <div className={styles.footerPoweredBy}>
            <svg
              width="12"
              height="15"
              viewBox="0 0 12 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.4505 5.80674C11.3905 5.69159 11.2988 5.59481 11.1855 5.52701C11.0722 5.45921 10.9417 5.42308 10.8085 5.42273H7.2029V1.23322C7.21063 1.08009 7.16608 0.928706 7.07613 0.802572C6.98619 0.676324 6.85592 0.582341 6.70525 0.535C6.56049 0.488825 6.40426 0.488359 6.25913 0.53348C6.11401 0.578601 5.98749 0.667209 5.89755 0.786323L0.1281 8.46719C0.0559041 8.56831 0.0124393 8.68614 0.00229869 8.80876C-0.00784258 8.93138 0.0156996 9.05447 0.0703902 9.1654C0.120855 9.29235 0.208508 9.40223 0.322476 9.48159C0.436446 9.56096 0.572026 9.60644 0.712308 9.61228H4.31825V13.8018C4.31837 13.9491 4.36642 14.0925 4.45588 14.2116C4.54523 14.3307 4.67115 14.4195 4.8158 14.4652C4.88824 14.4869 4.96345 14.4986 5.03939 14.5C5.27011 14.5006 5.4873 14.3942 5.62348 14.2137L11.3929 6.53285C11.4706 6.42858 11.517 6.30585 11.5273 6.17773C11.5374 6.04961 11.5107 5.92128 11.4505 5.80674Z"
                fill="#EE4C83"
              />
            </svg>
            Powered by
            <Image
              src={"/Opolis_textonly.svg"}
              width={90}
              height={50}
              alt="Opolis"
            />
            &
            <Image src={"/JP_black.svg"} width={120} height={50} alt="Opolis" />
          </div>
        </div>
      </div>
    </>
  );
}
