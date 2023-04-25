import Head from "next/head";
import styles from "@/styles/Roledetailpage.module.sass";
import styles_home from "@/styles/Home.module.sass";
import Footer from "@/components/overview/footer";
import React, { useState } from "react";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import customer_config from "@/customer_config.json";
import { Company, Role } from "@/bubble_types";
import Joblist from "@/components/overview/joblist";
import JobFilters from "@/components/overview/jobfilters";
import { GeographicAddress } from "@/bubble_types";
import Filter from "@/components/overview/filter";
import { GetAllRelevantRoles } from "@/pages/index";
import CompanyConditions from "@/components/company/companyconditions";

export interface Props {
  company: Company;
  companyroles: Role[];
}

// export async function getStaticPaths() {
//   const allIDs = await GetAllIDs();
//   const companyIDS = allIDs[0];

  const roles = await GetAllRelevantRoles();

  const companies: Company[] = roles.map(role => role.company);
  const slugs = companies.map(company => company.slug);
  const paths = slugs.map(slug => ({ params: { id: slug } }));

// // `getStaticPaths` requires using `getStaticProps`
// export async function getStaticProps(context: any) {
//   const company = await getCompanyData(context.params.id);
//   const allIDs = await GetAllIDs(); //TODO(scheuclu) URGENT. Replace this with more efficient query. E.g. query bubble to only return roles for this company.
//   const roleIDs = allIDs[1];
//   const allRoles = await GetRolesByRoleIDs(roleIDs);
//   const companyroles = allRoles.filter(
//     (role) => role.company.id === company.id
//   );

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(context: any) {

  const all_roles = await GetAllRelevantRoles();
  const this_company_roles = all_roles.filter(role => role.company.slug === context.params.id);
  const this_company = this_company_roles[0].company;

  return {
    // Passed to the page component as props
    props: { company: this_company, companyroles: this_company_roles },
    revalidate: 60 * 60 * 24, // In seconds
  }
}


export default function Home(props: Props) {
  const company: Company = props.company;
  const companyroles: Role[] = props.companyroles;

  const [filteredCompanyRoles, setFilteredCompanyRoles] = useState<Role[]>([]);
  const [userAddress, setUserAddress] = useState<GeographicAddress | null>(
    null
  );
  const [remoteOnly, setRemoteOnly] = useState<boolean>(false);
  const [filter, setFilter] = useState<Filter>();

  useEffect(() => {
    if (companyroles) {
      setFilter(new Filter());
    }
  }, [companyroles]);

  useEffect(() => {
    if (filter) {
      setFilteredCompanyRoles(
        filter.getFilteredRoles(companyroles, userAddress, remoteOnly, null, null)
      ); //TODO(scheuclu) URGENT. Add role type filter
    }
  }, [companyroles, userAddress, remoteOnly, filter]);

  if (!company) {
    return null;
  }
  return (
    <>
      <Head>
        <title>{company.name}</title>
        <meta name="description" content={company.name} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
              {customer_config.title}
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
          </div>

          <div
            className={styles_home.filtersContainer + " " + styles.desktopOnly}
          >
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

          <Joblist roles={filteredCompanyRoles} mode='application' showBounty={false} handleChange={(a, b) => { }} />

          <div
            className={
              styles.headerBackgroundGradientContainer +
              " " +
              styles.desktopOnly
            }
          ></div>
          <Footer />
        </div>
      </div>
    </>
  );
}
