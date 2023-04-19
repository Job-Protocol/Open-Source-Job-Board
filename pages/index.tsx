import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import customer_config from "../customer_config.json";
import styles from "@/styles/Home.module.sass";
import stylesGlobalFormElements from "@/styles/GlobalFormElements.module.sass";
import Joblist from "@/components/overview/joblist";
import Companylist from "@/components/overview/companylist";
import SwitchRolesCompanies from "@/components/overview/switch_roles_companies";

import React, { useState, useEffect, Component } from "react";
import { Company, getDefaultRole, Role } from "@/bubble_types";
import JobFilters from "@/components/overview/jobfilters";
import Footer from "@/components/overview/footer";

import { GeographicAddress } from "@/bubble_types";
import RoleFilter from "../components/overview/filter";
import { CompanyFilter } from "../components/overview/filter";
import { RoleType } from "@/bubble_types";
import CurationModal from "@/components/admin/Curation";
import CustomRole from "@/components/admin/CustomRole";
import EditRole from "@/components/admin/EditRole";
import Login from "@/components/admin/Login";
import { useRouter } from 'next/router'
import { fetchRoles, Constraint } from "@/pages/api/role";

import { ActionType } from "@/components/role/jobcard";

import { revalidate_page } from "../utils";



import IconLinkedin from '@/public/linkedin.svg'
import IconGlobe from '@/public//globe.svg'
import IconTwitter from '@/public//twitter.svg'
import IconDiscord from '@/public//globe.svg'
import IconYouTube from '@/public//youtube.svg'
import IconInstagram from '@/public//instagram.svg'
import IconFacebook from '@/public/facebook.svg'


let iconmap = new Map<string, Component>([
  ["linkedin", IconGlobe],
  ["website", IconGlobe],
  ["twitter", IconGlobe],
  ["discord", IconGlobe],
  ["youtube", IconGlobe],
  ["instagram", IconGlobe],
  ["facebook", IconGlobe],
]);


export async function GetAllRelevantRoles(): Promise<Role[]> {



  const constraints: Constraint[] = [
    { key: 'partner_boards', constraint_type: 'contains', value: customer_config.jobprotocol_key },
    // { key: 'Private_owner', constraint_type: 'equals', value: customer_config.bubble_user_id.production },
    { key: 'State', constraint_type: 'equals', value: "Live" }
  ]


  const parsed: Role[] = await fetchRoles(process.env.BUBBLE_API_PRIVATE_KEY as string, constraints);

  const parsed_filtered = parsed.filter((role) => { role.slug != undefined && role.company.name != undefined && role.company.slug != undefined });
  return parsed;
}

export interface Props {
  sortedRoles: Role[];
  companies: Company[];
}


function getCompaniesFromRoles(roles: Role[]): Company[] {
  const unfiltered = roles.map((role) => role.company);
  const ids = unfiltered.map((company) => company.id);
  const result = unfiltered.filter((value, index) => {
    return ids.indexOf(value.id) === index

  });
  return result;
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {

  const response = await GetAllRelevantRoles();
  const sortedRoles = response.sort((a, b) => {
    if (!a.company.priority) return 1;
    if (!b.company.priority) return 1;
    return a.company.priority < b.company.priority ? 1 : -1;
  });

  const filteredRoles = sortedRoles;

  const companies = getCompaniesFromRoles(sortedRoles);
  // const companies: Company[] = [];

  return {
    props: {
      sortedRoles,
      companies,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 15 minuts
    revalidate: 60 * 60 * 24, // In seconds
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
  const [showEditRole, setShowEditRole] = useState<boolean>(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [adminMode, setAdminMode] = useState<boolean>(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  const [variableRoles, setVariableRoles] = useState<Role[]>(data.sortedRoles);
  const [variableCompanies, setVariableCompanies] = useState<Company[]>(data.companies);

  const [revalidationNeccessary, setRevalidationNeccessary] = useState<boolean>(false);


  // function updateCompanies() {
  //   setCompanies(variableRoles.map((role) => role.company));
  //   // [...new Set(array)];
  // }

  useEffect(() => {
    if (params.mode && params.mode == 'admin') {//TODO(scheuclu): Remove hard coded password
      setShowLogin(true);
    }
  }, [params]);


  useEffect(() => {
    if (revalidationNeccessary === true) {
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
        <title >{customer_config.title}</title>
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
              <h1 className={customer_config.fancy ? "board_title_fancy text-4xl" : "board_title text-4xl"}>{customer_config.title}</h1>
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
                      {/* <Test /> */}
                      <Link href={socialUrl} target="_blank" rel="noopener noreferrer">
                        {/* <svg className="red" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M1.33334 7.99992C1.33334 4.31803 4.31813 1.33325 8.00001 1.33325C9.76816 1.33325 11.4638 2.03564 12.714 3.28589C13.9643 4.53613 14.6667 6.23177 14.6667 7.99992C14.6667 9.76807 13.9643 11.4637 12.714 12.7139C11.4638 13.9642 9.76816 14.6666 8.00001 14.6666C6.23186 14.6666 4.53622 13.9642 3.28598 12.7139C2.03574 11.4637 1.33334 9.76807 1.33334 7.99992ZM2.66668 7.99992C2.66668 7.53955 2.72503 7.09277 2.83473 6.66659H5.14422C5.09295 7.104 5.06666 7.54907 5.06666 8.00024C5.06666 8.448 5.09319 8.89307 5.14527 9.33325H2.83603C2.72446 8.90137 2.66668 8.45361 2.66668 7.99992ZM3.3812 10.6666C3.61223 11.0668 3.89633 11.4387 4.22877 11.7712C4.80291 12.3453 5.49448 12.775 6.247 13.0369C5.87265 12.2823 5.58318 11.4873 5.38461 10.6666H3.3812ZM6.76189 10.6666C7.03191 11.6428 7.44915 12.5736 8.00001 13.4263C8.55087 12.5736 8.96803 11.6428 9.23813 10.6666H6.76189ZM10.6152 10.6666C10.4165 11.4873 10.1268 12.2824 9.75237 13.0371C10.5051 12.7752 11.197 12.3455 11.7713 11.7712C12.1037 11.4387 12.3878 11.0668 12.6188 10.6666H10.6152ZM13.164 9.33325H10.8547C10.9069 8.89307 10.9334 8.448 10.9334 8.00024C10.9334 7.55225 10.9068 7.10702 10.8547 6.66659H13.164C13.2756 7.09847 13.3333 7.54622 13.3333 7.99992C13.3333 8.45361 13.2756 8.90137 13.164 9.33325ZM9.51083 9.33325H6.48919C6.4301 8.89388 6.39999 8.44865 6.39999 8.00024C6.39999 7.5481 6.43002 7.10286 6.48813 6.66659H9.51075C9.56992 7.1062 9.60003 7.55168 9.60003 8.00024C9.60003 8.44865 9.56992 8.89388 9.51083 9.33325ZM5.38209 5.33325H3.38014C4.01507 4.2356 5.02988 3.38525 6.24488 2.96208C5.87346 3.70939 5.58212 4.5035 5.38209 5.33325ZM6.75945 5.33325H9.23788C8.96762 4.35669 8.55022 3.42562 7.99936 2.57292C7.45452 3.41423 7.03273 4.34294 6.75945 5.33325ZM10.6152 5.33325H12.6188C12.3878 4.93302 12.1037 4.56112 11.7713 4.22868C11.197 3.65438 10.5051 3.22453 9.75229 2.96265C10.1267 3.71737 10.4164 4.51253 10.6152 5.33325Z" />
                        </svg> */}
                        {social == "linkedin" && <IconLinkedin className="red" width="16px" height="16px" />}
                        {social == "website" && <IconGlobe className="red" width="16px" height="16px" />}
                        {social == "twitter" && <IconTwitter className="red" width="16px" height="16px" />}
                        {social == "discord" && <IconDiscord className="red" width="16px" height="16px" />}
                        {social == "youtube" && <IconYouTube className="red" width="16px" height="16px" />}
                        {social == "instagram" && <IconInstagram className="red" width="16px" height="16px" />}
                        {social == "facebook" && <IconFacebook className="red" width="16px" height="16px" />}



                        {/* <Image
                          src={`/socials/${social}.svg`}
                          alt="icon"
                          width={16}
                          height={16}
                          className="red"
                        /> */}


                      </Link>
                    </div>
                  )
                })}

              </div>
            </div>



            {adminMode &&
              <div className={"marginBottom8 " + styles.headerRightContainer}>
                <div className={styles.headerListRolesContianer + " gap-x-1.5"}>

                  <button
                    type="submit"
                    className={"body16Bold " + stylesGlobalFormElements.primaryButton}
                    name="button-admin-mode"
                    onClick={() => {
                      setAdminMode(false);
                      router.replace('/', undefined, { shallow: true });
                    }}
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
                    Add role to board
                  </button>

                  <button
                    type="submit"
                    className={"body16Bold " + stylesGlobalFormElements.primaryButton}
                    name="button-1675001572178"
                    onClick={() => setShowCustomRole(true)}
                    id="button-apply"
                  >
                    Create new role
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
                    fill={customer_config.colors.text.dark}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 2H13"
                      stroke={customer_config.colors.text.dark}
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                    <circle cx="2" cy="2" r="2" fill={customer_config.colors.text.dark} />
                    <path
                      d="M1 8H13"
                      stroke={customer_config.colors.text.dark}
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                    <circle cx="12" cy="8" r="2" fill={customer_config.colors.text.dark} />
                  </svg>
                  Add Filter
                </button>
              </div>

              <div className={styles.inputContainer}>
                <div className={styles.inputIconContainer}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    // fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14.2356 13.765C14.3658 13.6348 14.3658 13.4237 14.2357 13.2935L10.876 9.93327C11.602 9.0026 12 7.86589 12 6.66659C12 5.24194 11.4447 3.90389 10.4373 2.89591C9.43002 1.88794 8.09132 1.33325 6.66668 1.33325C5.24203 1.33325 3.90268 1.88794 2.89601 2.89591C1.88803 3.90389 1.33334 5.24194 1.33334 6.66659C1.33334 8.09123 1.88803 9.43058 2.89601 10.4373C3.90268 11.4452 5.24203 11.9999 6.66668 11.9999C7.86598 11.9999 9.0027 11.6026 9.93336 10.8765L13.293 14.2362C13.4232 14.3664 13.6342 14.3664 13.7644 14.2362L14.2356 13.765ZM9.49464 9.49528C8.73935 10.2506 7.73471 10.6666 6.66668 10.6666C5.59799 10.6666 4.594 10.2506 3.83871 9.49528C3.08269 8.73991 2.66668 7.73527 2.66668 6.66659C2.66668 5.59855 3.08269 4.59391 3.83871 3.83862C4.594 3.0826 5.59799 2.66659 6.66668 2.66659C7.73471 2.66659 8.73935 3.0826 9.49464 3.83862C10.2507 4.59391 10.6667 5.59855 10.6667 6.66659C10.6667 7.73527 10.2507 8.73991 9.49464 9.49528Z"
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
                    setVariableCompanies(getCompaniesFromRoles(variableRoles));
                  }
                }} />
            </div>
          }
          {showCustomRole &&
            <div
              className={stylesGlobalFormElements.modal}
              onClick={() => {
                setShowCustomRole(false);
              }}
            >
              <CustomRole password={"asd"} />
            </div>
          }

          {showEditRole && editRole &&
            <div
              className={stylesGlobalFormElements.modal}
              onClick={(a) => {
                console.log(a);
                setShowEditRole(false);
                setEditRole(null);
                setRevalidationNeccessary(true);
              }}
            >
              <EditRole role={editRole} password={"asd"} />
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
              if (actiontype == ActionType.Edit) {
                setEditRole(role);
                setShowEditRole(true);
                // setRevalidationNeccessary(true);
              }
            }}
          />}
          {byCompanies && <Companylist companies={variableCompanies} />}

          <Footer />
        </div>
      </div>
    </>
  );
}
