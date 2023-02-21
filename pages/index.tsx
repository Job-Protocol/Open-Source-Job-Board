import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import stylesGlobalFormElements from "@/styles/GlobalFormElements.module.css";
import SearchBox from "@/components/overview/searchbox";
import Joblist from "@/components/overview/joblist";
import Companylist from "@/components/overview/companylist";
import SwitchRolesCompanies from "@/components/overview/switch_roles_companies";
import Select from "react-select";

import React, { useState, useEffect, useReducer } from "react";

import { Company, Role } from "@/bubble_types";
import JobFilters from "@/components/overview/jobfilters";
import Footer from "@/components/overview/footer";

import { GeographicAddress } from "@/bubble_types";
import RoleFilter from "../components/overview/filter";
import { CompanyFilter } from "../components/overview/filter";
import Switch from "react-switch";
import { getConfig } from "@/utils";
import { RoleType } from "@/bubble_types";

export async function GetAllIDs(): Promise<string[][]> {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/role/all`
  );
  const parsed = await result.json();
  return parsed;
}

export async function GetCompaniesByCompanyIDs(
  ids: string[]
): Promise<Company[]> {
  const response: Promise<Response>[] = ids.map((id) =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/company/${id}`)
  );
  const reponses: Response[] = await Promise.all(response);
  const roles = reponses.map((result) => result.json());
  const final = await Promise.all(roles);
  return final;
}

export async function GetRolesByRoleIDs(ids: string[]): Promise<Role[]> {
  const response: Promise<Response>[] = ids.map((id) =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/role/${id}`)
  );
  const reponses: Response[] = await Promise.all(response);

  const roles = reponses.map((result) => result.json());
  const final = await Promise.all(roles);
  return final;
}

export interface Props {
  sortedRoles: Role[];
  companies: Company[];
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
  const res = await GetAllIDs();
  const companyIDs = res[0];
  const roleIDs = res[1];

  const sortedRoles = await GetRolesByRoleIDs(roleIDs).then((res) => {
    const aaa = res.sort((a, b) => {
      if (!a.company.priority) return 1;
      if (!b.company.priority) return 1;
      return a.company.priority < b.company.priority ? 1 : -1;
    });
    return aaa;
  });
  const filteredRoles = sortedRoles;

  const companies = await GetCompaniesByCompanyIDs(companyIDs);

  return {
    props: {
      sortedRoles,
      companies,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 60 * 30, // In seconds
  };
}

export default function Home(data: Props) {
  // const sortedRoles = data.sortedRoles;
  const companies = data.companies;
  const roles = data.sortedRoles;

  const [byCompanies, setByCompanies] = useState<boolean>(false);
  const [filteredRoles, setFilteredRoles] = useState<Role[] | undefined>(
    undefined
  );
  const [filteredCompanies, setFilteredCompanies] = useState<Company[] | undefined>(
    undefined
  );

  const [userAddress, setUserAddress] = useState<GeographicAddress | undefined>(
    undefined
  );
  const [remoteOnly, setRemoteOnly] = useState<boolean>(false);
  const [roleFilter, setRoleFilter] = useState<RoleFilter | undefined>(undefined);
  const [companyFilter, setCompanyFilter] = useState<CompanyFilter | undefined>(undefined);
  const [roleType, setRoleType] = useState<RoleType | undefined>(undefined);
  const [searchterm, setSearchterm] = useState<string | undefined>(undefined);


  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setRoleFilter(new RoleFilter(roles));
    setCompanyFilter(new CompanyFilter(companies));
  }, [roles, companies]);

  useEffect(() => {
    if (roleFilter) {
      setFilteredRoles(
        roleFilter.getFilteredRoles(userAddress, remoteOnly, roleType, searchterm)
      );
    }
    if (companyFilter) {
      setFilteredCompanies(
        companyFilter.getFilteredCompanies(searchterm)
      );
    }
  }, [userAddress, remoteOnly, roleFilter, companyFilter, roleType, searchterm]);

  function handleChange(val: boolean) {
    setByCompanies(val);
  }

  return (
    <>
      <Head>
        <title>ETH Denver Jobs</title>
        <meta name="description" content="Jobboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={"page"}>
        <div className={"pageContainer"}>
          <div className={styles.coverImageContainer}>
            <Image
              src={"/limeacademy_banner.png"}
              alt="Header image"
              fill
              className={styles.headerImage}
            />
          </div>
          <div className={styles.headerContainer}>
            <div className={styles.logoImageContainer}>
              <Image
                src={"/limeacademy_lime_only.png"}
                alt="Header image"
                fill
              //style={{borderRadius: 8}}
              // objectFit="cover"
              />
            </div>
            <div className={styles.headerTextContainer}>
              <h1 className={"h1"}>Lime Academy Job Board</h1>
              <h2 className={"body18"}>We help experienced developers transition to the blockchain space.</h2>
              <div className={styles.headerIconsContainer}>
                {process.env.NEXT_PUBLIC_socials_website &&
                  <Link href={'https://' + process.env.NEXT_PUBLIC_socials_website} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={"/globe.svg"}
                      alt="Globe icon"
                      width={16}
                      height={16}
                    />
                  </Link>}
                {process.env.NEXT_PUBLIC_socials_ &&
                  <Link href={'https://' + process.env.NEXT_PUBLIC_socials_website} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={"/twitter.svg"}
                      alt="Twitter icon"
                      width={16}
                      height={16}
                    //style={{borderRadius: 8}}
                    // objectFit="cover"
                    />
                  </Link>}
                {process.env.NEXT_PUBLIC_socials_facebook &&
                  <Link href={'https://' + process.env.NEXT_PUBLIC_socials_website} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={"/facebook.svg"}
                      alt="Twitter icon"
                      width={16}
                      height={16}
                    //style={{borderRadius: 8}}
                    // objectFit="cover"
                    />
                  </Link>}
                {process.env.NEXT_PUBLIC_socials_linkedin &&
                  <Link href={'https://' + process.env.NEXT_PUBLIC_socials_linkedin} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={"/linkedin-square-colored.svg"}
                      alt="Linkedin icon"
                      width={16}
                      height={16}
                    //style={{borderRadius: 8}}
                    // objectFit="cover"
                    />
                  </Link>}
                {process.env.NEXT_PUBLIC_socials_discord &&
                  <Link href={'https://' + process.env.NEXT_PUBLIC_socials_discord} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={"/Discord_Logo_sans_texte 1.svg"}
                      alt="Discord icon"
                      width={16}
                      height={16}
                    //style={{borderRadius: 8}}
                    // objectFit="cover"
                    />
                  </Link>}
                {process.env.NEXT_PUBLIC_socials_medium &&
                  <Link href={'https://' + process.env.NEXT_PUBLIC_socials_medium} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={"/medium.svg"}
                      alt="Medium icon"
                      width={16}
                      height={16}
                    //style={{borderRadius: 8}}
                    // objectFit="cover"
                    />
                  </Link>}
                {process.env.NEXT_PUBLIC_socials_youtube &&
                  <Link href={'https://' + process.env.NEXT_PUBLIC_socials_youtube} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={"/youtube.svg"}
                      alt="YouTube icon"
                      width={16}
                      height={16}
                    //style={{borderRadius: 8}}
                    // objectFit="cover"
                    />
                  </Link>}
                {process.env.NEXT_PUBLIC_socials_instagram &&
                  <Link href={'https://' + process.env.NEXT_PUBLIC_socials_instagram} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={"/instagram.svg"}
                      alt="Instagram icon"
                      width={16}
                      height={16}
                    //style={{borderRadius: 8}}
                    // objectFit="cover"
                    />
                  </Link>}
                {process.env.NEXT_PUBLIC_socials_meetup &&
                  <Link href={'https://' + process.env.NEXT_PUBLIC_socials_meetup} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={"/meetup.svg"}
                      alt="Meetup icon"
                      width={16}
                      height={16}
                    //style={{borderRadius: 8}}
                    // objectFit="cover"
                    />
                  </Link>}

              </div>
            </div>

            <div className={"marginBottom8 " + styles.headerRightContainer}>
              <div className={styles.headerListRolesContianer}>
                <Link
                  className={
                    "marginTop16 " +
                    stylesGlobalFormElements.primaryButton +
                    " " +
                    styles.desktopOnly
                  }
                  href={"https://app.jobprotocol.xyz/ethdenver_onboarding"}
                  target="_blank"
                  rel="noreferrer"
                >
                  List your roles
                </Link>
                <Link
                  className={"marginTop16 body16Bold link " + styles.mobileOnly}
                  href={"https://app.jobprotocol.xyz/ethdenver_onboarding"}
                  target="_blank"
                  rel="noreferrer"
                >
                  List your roles
                </Link>
              </div>
            </div>
          </div>

          <div className={styles.filtersContainer}>
            <div className={styles.sliderAndSearch}>
              <div className={styles.companySwitchAndFiltersButton}>
                <SwitchRolesCompanies
                  onChange={(v: any) => setByCompanies(v)}
                  checked={byCompanies}
                />
                <button
                  className={
                    stylesGlobalFormElements.outlineButton +
                    " " +
                    styles.mobileFiltersButton
                  }
                  name="mobile-filters-button"
                  // style="default"
                  onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
                  id="mobile-filters-button"
                >
                  <svg
                    width="14"
                    height="10"
                    viewBox="0 0 14 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 2H13"
                      stroke="#1F2534"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                    <circle cx="2" cy="2" r="2" fill="#1F2534" />
                    <path
                      d="M1 8H13"
                      stroke="#1F2534"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                    <circle cx="12" cy="8" r="2" fill="#1F2534" />
                  </svg>
                  Add Filter
                </button>
              </div>

              {true && (
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
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.2356 13.765C14.3658 13.6348 14.3658 13.4237 14.2357 13.2935L10.876 9.93327C11.602 9.0026 12 7.86589 12 6.66659C12 5.24194 11.4447 3.90389 10.4373 2.89591C9.43002 1.88794 8.09132 1.33325 6.66668 1.33325C5.24203 1.33325 3.90268 1.88794 2.89601 2.89591C1.88803 3.90389 1.33334 5.24194 1.33334 6.66659C1.33334 8.09123 1.88803 9.43058 2.89601 10.4373C3.90268 11.4452 5.24203 11.9999 6.66668 11.9999C7.86598 11.9999 9.0027 11.6026 9.93336 10.8765L13.293 14.2362C13.4232 14.3664 13.6342 14.3664 13.7644 14.2362L14.2356 13.765ZM9.49464 9.49528C8.73935 10.2506 7.73471 10.6666 6.66668 10.6666C5.59799 10.6666 4.594 10.2506 3.83871 9.49528C3.08269 8.73991 2.66668 7.73527 2.66668 6.66659C2.66668 5.59855 3.08269 4.59391 3.83871 3.83862C4.594 3.0826 5.59799 2.66659 6.66668 2.66659C7.73471 2.66659 8.73935 3.0826 9.49464 3.83862C10.2507 4.59391 10.6667 5.59855 10.6667 6.66659C10.6667 7.73527 10.2507 8.73991 9.49464 9.49528Z"
                        fill="#1F2534"
                      />
                    </svg>
                  </div>

                  <input
                    className={"body16 " + styles.input}
                    placeholder="Search"
                    onChange={(value) =>
                      setTimeout(function () {
                        setSearchterm(value.target.value.replace(/\s+$/, ""));
                      }, 1000)
                    }
                  ></input>
                </div>
              )}
            </div>
            {!byCompanies && (
              <JobFilters
                handleChange={(userAddress, remoteOnly, roleType) => {
                  setUserAddress(userAddress);
                  setRemoteOnly(remoteOnly == true);
                  setRoleType(roleType);
                  setSearchterm(searchterm);
                }}
                isModalOpen={isFilterModalOpen}
                closeModalHandler={() => setIsFilterModalOpen(false)}
              />
            )}
          </div>
          {!byCompanies && <Joblist roles={filteredRoles} />}
          {byCompanies && <Companylist companies={filteredCompanies} />}
          <Footer />
        </div>
      </div>
    </>
  );
}
