import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import SearchBox from "@/components/overview/searchbox";
import Joblist from "@/components/overview/joblist";
import Companylist from "@/components/overview/companylist";
import SwitchRolesCompanies from "@/components/overview/switch_roles_companies";

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
      <div className={styles.page}>
        <div className={styles.pageContainer}>
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
          </div>

          <div className={styles.filtersContainer}>
            <div className={styles.row}>
              <SwitchRolesCompanies />
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
            <div className={styles.row}>Role:</div>
          </div>
        </div>
      </div>

      <main className={styles.main}>
        {/* <p> User address: {userAddress?.address}</p>
        <p> Remote only: {remoteOnly}</p> */}

        <label>
          <span>Show companies</span>
          <Switch
            onChange={(v: any) => setByCompanies(v)}
            checked={byCompanies}
            offColor="#ff0000"
            onColor="#00ff00"
            uncheckedIcon={<p>Roles</p>}
            checkedIcon={<p>Companies</p>}
            width={200}
          />
        </label>

        {!byCompanies && (
          <JobFilters
            handleChange={(userAddress, remoteOnly) => {
              setUserAddress(userAddress);
              setRemoteOnly(remoteOnly == true);
            }}
          />
        )}
        {!byCompanies && <Joblist roles={filteredRoles} />}
        {byCompanies && <Companylist />}
      </main>
    </>
  );
}
