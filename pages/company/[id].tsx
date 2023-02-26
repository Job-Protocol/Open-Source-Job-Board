import Head from "next/head";
import styles from "@/styles/Roledetailpage.module.css";
import styles_home from "@/styles/Home.module.css";
import JdCard from "@/components/role/detail/jobdesc";
import ApplyCard from "@/components/role/apply";
import CompanyCard from "@/components/role/detail/companyinfo";
import Footer from "@/components/overview/footer";
import React, { useState } from "react";
import { useEffect } from "react";
import { getConfig } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import SwitchRolesCompanies from "@/components/overview/switch_roles_companies";

import { Company, Role } from "@/bubble_types";
import RoleConditions from "@/components/role/detail/roleconditions";
import Joblist from "@/components/overview/joblist";

import JobFilters from "@/components/overview/jobfilters";
import { GeographicAddress } from "@/bubble_types";

import Filter from "@/components/overview/filter";

import {
  GetAllIDs,
  GetCompaniesByCompanyIDs,
  GetRolesByRoleIDs,
} from "@/pages/index";
import CompanyConditions from "@/components/company/companyconditions";

async function getCompanyData(id: string): Promise<Company> {
  const result = await fetch(`${process.env.BASE_URL}/api/company/` + id);
  const parsed = await result.json();
  return parsed;
}

export interface Props {
  company: Company;
  companyroles: Role[];
}

export async function getStaticPaths() {
  const allIDs = await GetAllIDs();
  const companyIDS = allIDs[0];

  const companies: Company[] = await GetCompaniesByCompanyIDs(companyIDS);
  const slugs = companies.map((company) => company.slug);
  const paths = slugs.map((slug) => ({ params: { id: slug } }));

  return {
    paths: paths,
    fallback: false, // can also be true or 'blocking'
  };
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(context: any) {
  const company = await getCompanyData(context.params.id);
  const allIDs = await GetAllIDs(); //TODO(scheuclu) URGENT. Replace this with more efficient query. E.g. query bubble to only return roles for this company.
  const roleIDs = allIDs[1];
  const allRoles = await GetRolesByRoleIDs(roleIDs);
  const companyroles = allRoles.filter(
    (role) => role.company.id === company.id
  );

  return {
    // Passed to the page component as props
    props: { company: company, companyroles: companyroles },
    revalidate: 60 * 30, // In seconds
  };
}

export default function Home(props: Props) {
  const company: Company = props.company;
  const companyroles: Role[] = props.companyroles;

  const [filteredCompanyRoles, setFilteredCompanyRoles] = useState<Role[]>([]);
  const [userAddress, setUserAddress] = useState<GeographicAddress | undefined>(
    undefined
  );
  const [remoteOnly, setRemoteOnly] = useState<boolean>(false);
  const [filter, setFilter] = useState<Filter>();

  useEffect(() => {
    if (companyroles) {
      setFilter(new Filter(companyroles));
    }
  }, [companyroles]);

  useEffect(() => {
    if (filter) {
      setFilteredCompanyRoles(
        filter.getFilteredRoles(userAddress, remoteOnly, undefined, undefined)
      ); //TODO(scheuclu) URGENT. Add role type filter
    }
  }, [userAddress, remoteOnly, filter]);

  if (!company) {
    return null;
  }
  return (
    <>
      <Head>
        <title>{company.name}</title>
        <meta name="description" content={company.name} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/ethdenver-spork-logo-pink2.png" />
        {/* Facebook */}
        <meta property="og:title" content={company.name} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={process.env.NEXT_PUBLIC_BASE_URL + "/social_banner.png"}
        />
        {/* Twitter */}
        <meta name="twitter:title" content={company.name} />
        <meta
          name="twitter:description"
          content="Job Board for ETHDenver - a fast-track to the best jobs in Web3 🔥"
        />
        <meta
          property="twitter:image"
          content={process.env.NEXT_PUBLIC_BASE_URL + "/social_banner.png"}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="page">
        <div className="pageContainer">
          <div className={styles.headerContainer}>
            <div className={styles.headerLeftContainer}>
              <Link className={styles.headerLink} href="/">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.1918 3.29103C12.5833 3.68032 12.5847 4.3129 12.195 4.70395L7.91604 8.99676L12.207 13.291C12.5977 13.6819 12.5977 14.3158 12.207 14.7068C11.8163 15.0977 11.1829 15.0977 10.7923 14.7068L5.84547 9.75621C5.82811 9.74116 5.81114 9.72541 5.7946 9.70897C5.40305 9.31968 5.40162 8.6871 5.7914 8.29605L10.777 3.29422C11.1668 2.90317 11.8002 2.90175 12.1918 3.29103Z"
                    fill="#EE4C83"
                  />
                </svg>
                Back to all positions
              </Link>
            </div>

            <div
              className={
                "body14 " +
                styles.headerRightContainer +
                " " +
                styles.desktopOnly
              }
            >
              ETHDENVER Job Board
            </div>
          </div>
          <div className={styles.roleDetailHeaderContainer}>
            <div className={styles.roleInfo}>
              <div className={styles.logoContainer}>
                <Image
                  src={company?.logo.replace("//s3", "https://s3")}
                  alt="Logo"
                  fill={true}
                />
              </div>
              <div className={styles.roleInfoText}>
                <h1 className={"h1 " + styles.roleTitleText}>
                  {" "}
                  {company.name}
                </h1>
                <p className={"body18 " + styles.companyTagLine}>
                  {" "}
                  {company.tagline}
                </p>
                {/* <RoleConditions role={role} isInverted={true} /> */}
                <div className={styles.desktopOnly}>
                  <CompanyConditions company={company} isInverted={true} />
                </div>
                <div className={styles.mobileOnly}>
                  <CompanyConditions company={company} isInverted={false} />
                </div>
              </div>
            </div>

            {/* TODO(scheuclu) */}
            {/* <div className={styles.roleOptionsContainer}>
              <div className={styles.roleOptionContainer}>
                <div className={styles.roleOptionIconContainer}>
                  <Image
                    src={"/building.svg"}
                    alt="BuildingIcon"
                    width={20}
                    height={20}
                  />
                </div>
                <div className={styles.roleOptionTextAndInfoContainer}>
                  Hybrid work environment
                  <Image
                    src={"/info.svg"}
                    alt="InfoIcon"
                    width={13}
                    height={13}
                  />
                </div>
              </div>
              <div className={styles.roleOptionContainer}>
                <div className={styles.roleOptionIconContainer}>
                  <Image
                    src={"/building.svg"}
                    alt="BuildingIcon"
                    width={20}
                    height={20}
                  />
                </div>
                <div className={styles.roleOptionTextAndInfoContainer}>
                  Hybrid work environment
                  <Image
                    src={"/info.svg"}
                    alt="InfoIcon"
                    width={13}
                    height={13}
                  />
                </div>
              </div>
              <div className={styles.roleOptionContainer}>
                <div className={styles.roleOptionIconContainer}>
                  <Image
                    src={"/building.svg"}
                    alt="BuildingIcon"
                    width={20}
                    height={20}
                  />
                </div>
                <div className={styles.roleOptionTextAndInfoContainer}>
                  Hybrid work environment
                  <Image
                    src={"/info.svg"}
                    alt="InfoIcon"
                    width={13}
                    height={13}
                  />
                </div>
              </div>
            </div> */}
          </div>

          <div
            className={styles_home.filtersContainer + " " + styles.desktopOnly}
          >
            {/* TODO(scheuclu) Disabling Search filters for now */}
            {/* <div className={styles_home.row}>
              <div className={styles_home.inputContainer}>
                <div className={styles_home.inputIconContainer}>
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
                <input
                  className={styles_home.input}
                  placeholder="Search"
                ></input>
              </div>
            </div> */}
            <JobFilters
              handleChange={(userAddress, remoteOnly) => {
                setUserAddress(userAddress);
                setRemoteOnly(remoteOnly == true);
              }}
              // TODO: also enable mobile filters here, requires the 'filters' button to be present as well (see index)
              isModalOpen={false}
              closeModalHandler={() => 1 + 1}
            />
          </div>

          <Joblist roles={filteredCompanyRoles} />

          {/* <div className={styles.headerBackgroundGradientContainer}></div> */}
          <Footer />
        </div>
      </div>
    </>
  );
}
