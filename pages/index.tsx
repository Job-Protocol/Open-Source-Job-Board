import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import customer_config from "../customer_config.json";
import styles from "@/styles/Home.module.sass";
import stylesGlobalFormElements from "@/styles/GlobalFormElements.module.sass";
import Joblist from "@/components/overview/joblist";
import Companylist from "@/components/overview/companylist";
import SwitchRolesCompanies from "@/components/overview/switch_roles_companies";

import React, { useState, useEffect } from "react";

import { Company, getDefaultRole, Role } from "@/bubble_types";
import JobFilters from "@/components/overview/jobfilters";
import Footer from "@/components/overview/footer";

import { GeographicAddress } from "@/bubble_types";
import RoleFilter from "../components/overview/filter";
import { CompanyFilter } from "../components/overview/filter";
import { RoleType } from "@/bubble_types";
import CurationModal from "@/components/admin/Curation";
import CustomRole from "@/components/admin/CustomRole";
import Login from "@/components/admin/Login";
import { useRouter } from 'next/router'
import { fetchRoles } from "@/pages/api/role";

import { ActionType } from "@/components/role/jobcard";
import RoleConditions from "@/components/role/detail/roleconditions";

import { revalidate_page } from "../utils";

export async function GetAllRelevantRoles(): Promise<Role[]> {

  const params = {
    constraints: `[{"key":"Partner_boards","constraint_type":"contains","value":"${customer_config.jobprotocol_key}"}]`
  }
  const parsed: Role[] = await fetchRoles(process.env.BUBBLE_API_PRIVATE_KEY as string, params);

  const parsed_filtered = parsed.filter((role) => { role.slug != undefined && role.company.name != undefined && role.company.slug != undefined });
  return parsed;
}

export interface Props {
  sortedRoles: Role[];
  companies: Company[];
}


function getCompaniesFromRoles(roles: Role[]): Company[] {
  return [];
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
  console.log("Get static props is running");

  const response = await GetAllRelevantRoles();
  const sortedRoles = response.sort((a, b) => {
    if (!a.company.priority) return 1;
    if (!b.company.priority) return 1;
    return a.company.priority < b.company.priority ? 1 : -1;
  });
  console.log("Get static props has finished");


  // const sortedRoles = await GetAllRelevantRoles().then((res) => {
  //   const aaa = res.sort((a, b) => {
  //     if (!a.company.priority) return 1;
  //     if (!b.company.priority) return 1;
  //     return a.company.priority < b.company.priority ? 1 : -1;
  //   });
  //   return aaa;
  // });

  const filteredRoles = sortedRoles;
  console.log("NOw having numroles: " + filteredRoles.length);

  const companies = sortedRoles.map((role) => role.company);
  // const companies: Company[] = [];

  return {
    props: {
      sortedRoles,
      companies,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 15 minuts
    revalidate: 60 * 15, // In seconds
  };
}

export default function Home(data: Props) {

  const router = useRouter()
  const params = router.query;

  const [companies, setCompanies] = useState<Company[]>(data.companies);
  const [byCompanies, setByCompanies] = useState<boolean>(false);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[] | null>(null);
  const [userAddress, setUserAddress] = useState<GeographicAddress | null>(null);
  const [remoteOnly, setRemoteOnly] = useState<boolean>(false);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>(new RoleFilter());
  const [companyFilter, setCompanyFilter] = useState<CompanyFilter>(new CompanyFilter());
  const [roleType, setRoleType] = useState<RoleType | null>(null);
  const [searchterm, setSearchterm] = useState<string | null>(null);

  const [showCuration, setShowCuration] = useState<boolean>(false);
  const [showCustomRole, setShowCustomRole] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [adminMode, setAdminMode] = useState<boolean>(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [variableRoles, setVariableRoles] = useState<Role[]>(data.sortedRoles);

  const [revalidationNeccessary, setRevalidationNeccessary] = useState<boolean>(false);


  function updateCompanies() {
    setCompanies(variableRoles.map((role) => role.company));
  }

  useEffect(() => {
    if (params.mode && params.mode == 'admin') {//TODO(scheuclu): Remove hard coded password
      setShowLogin(true);
    }
  }, [params]);


  useEffect(() => {
    if (revalidationNeccessary === true) {
      console.log("About to call revalidation");
      revalidate_page('/');
      setRevalidationNeccessary(false);
    }
  }, [revalidationNeccessary]);



  useEffect(() => {
    if (roleFilter) {
      setFilteredRoles(roleFilter.getFilteredRoles(variableRoles, userAddress, remoteOnly, roleType, searchterm));
    }
    if (companyFilter) {
      setFilteredCompanies(companyFilter.getFilteredCompanies(companies, searchterm));
    }
  }, [variableRoles, userAddress, remoteOnly, roleFilter, companyFilter, roleType, searchterm, companies]);

  function handleChange(val: boolean) {
    setByCompanies(val);
  }

  return (
    <>
      <Head>
        <title>{customer_config.title}</title>
        <meta name="description" content="Jobboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={"page"}>
        <div className={"pageContainer"}>
          <div className={styles.coverImageContainer}>
            <Image
              src={customer_config.branding.banner}
              alt="Header image"
              fill
              className={styles.headerImage}
            />
          </div>
          <div className={styles.headerContainer}>
            <div className={styles.logoImageContainer}>
              <Image
                src={customer_config.branding.logo}
                alt="Header image"
                fill
              //style={{borderRadius: 8}}
              // objectFit="cover"
              />
            </div>
            <div className={styles.headerTextContainer}>
              <h1 className={"h1"}>{customer_config.title}</h1>
              <h2 className={"body18"}>{customer_config.subtitle}</h2>
              <div className={styles.headerIconsContainer}>

                {/* <p>{aaa}</p> */}
                {Object.keys(customer_config.socials).map(social => {
                  // @ts-ignore
                  if (!customer_config.socials[social]) return null;
                  // @ts-ignore
                  const socialUrl: string = 'https://' + customer_config.socials[social];
                  return (
                    <div key={social}>
                      <Link href={socialUrl} target="_blank" rel="noopener noreferrer">
                        <Image
                          src={`/socials/${social}.svg`}
                          alt="icon"
                          width={16}
                          height={16}
                        />
                      </Link>
                    </div>
                  )
                })}

              </div>
            </div>



            {/* {!adminMode &&
              <div className={"marginBottom8 " + styles.headerRightContainer}>
                <div className={styles.headerListRolesContianer + " gap-x-1.5"}>
                  <button
                    type="submit"
                    className={"body16Bold " + stylesGlobalFormElements.primaryButton}
                    name="button-admin-mode"
                    onClick={() => setShowLogin(true)}
                    id="button-admin-mode"
                  >
                    Admin Mode
                  </button>
                </div>
              </div>
            } */}


            {/* <RoleConditions role={filteredRoles[0]} showBounty={true} /> */}




            {adminMode &&
              <div className={"marginBottom8 " + styles.headerRightContainer}>
                <div className={styles.headerListRolesContianer + " gap-x-1.5"}>

                  <button
                    type="submit"
                    className={"body16Bold " + stylesGlobalFormElements.primaryButton}
                    name="button-admin-mode"
                    onClick={() => setAdminMode(false)}
                    id="button-admin-mode"
                  >
                    Exit Admin Mode
                  </button>


                  <button
                    type="submit"
                    className={"body16Bold " + stylesGlobalFormElements.primaryButton}
                    name="button-1675001572178"
                    onClick={() => setShowCuration(true)}
                    id="button-apply"
                  >
                    Add Jobprotocol Role
                  </button>

                  <button
                    type="submit"
                    className={"body16Bold " + stylesGlobalFormElements.primaryButton}
                    name="button-1675001572178"
                    onClick={() => setShowCustomRole(true)}
                    id="button-apply"
                  >
                    Add Custom Role
                  </button>




                </div>
              </div>
            }


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

              {/* <RoleConditions role={filteredRoles[0]} showBounty={true} /> */}
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


          {showLogin &&
            <div
              className={stylesGlobalFormElements.modal + " z-50"}
              onClick={() => {
                setShowLogin(false);
                // refreshData();
              }}
            >
              <Login handleChange={(success) => {
                if (success) {

                  //setVariableRoles([...variableRoles, data])
                  setShowLogin(false);
                  setAdminMode(true);
                }
              }} />
            </div>
          }


          {showCuration &&
            <div
              className={stylesGlobalFormElements.modal + " z-50"}
              onClick={() => {
                setShowCuration(false);
                setRevalidationNeccessary(true);
                // refreshData();
              }}
            >
              <CurationModal
                ignoreIDs={filteredRoles.map((role) => role.id)}
                handleChange={(actionType, data) => {
                  if (actionType == ActionType.Add) {

                    setVariableRoles([...variableRoles, data])
                    updateCompanies();
                  }
                }} />
            </div>
          }
          {showCustomRole &&
            <div
              className={stylesGlobalFormElements.modal}
              onClick={() => {
                setShowCustomRole(false);
                // refreshData();
              }}
            >
              <CustomRole handleChange={(actionType, data) => {
                if (actionType == ActionType.Add) {
                  setVariableRoles([...variableRoles, data])
                  updateCompanies();
                }
              }} />
            </div>
          }


          {/* <RoleConditions role={filteredRoles[0]} showBounty={true} /> */}
          {!byCompanies && !adminMode && <Joblist
            roles={filteredRoles}
            mode="application"
            showBounty={false}
            handleChange={(actiontype, role) => { }}
          />}
          {!byCompanies && adminMode && <Joblist
            roles={filteredRoles}
            mode="remove"
            showBounty={false}
            handleChange={(actiontype, role) => {
              if (actiontype == ActionType.Remove) {
                setVariableRoles(variableRoles.filter(vrole => vrole.id != role.id));
                setRevalidationNeccessary(true);
              }
            }}
          />}
          {byCompanies && <Companylist companies={filteredCompanies} />}

          <Footer />
        </div>
      </div>
    </>
  );
}
