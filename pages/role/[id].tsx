import Head from "next/head";
import styles from "@/styles/Roledetailpage.module.sass";
import JdCard from "@/components/role/detail/jobdesc";
import ApplyCard from "@/components/role/apply";
import CompanyCard from "@/components/role/detail/companyinfo";
import Footer from "@/components/overview/footer";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import customer_config from "@/customer_config.json";

import { Role } from "@/bubble_types";
import RoleConditions from "@/components/role/detail/roleconditions";

import FourOhFour from "@/pages/404";
import Loading from "@/components/loading";


import Link from "next/link";
import Image from "next/image";
import "reactjs-popup/dist/index.css";
import { FastAverageColor } from "fast-average-color";

import { GetAllRelevantRoles } from "..";

import { fetch_role_by_id_or_slug } from "@/pages/api/role/[id]"

async function getRoleData(roleid: string): Promise<Role> {
  const parsed = fetch_role_by_id_or_slug(roleid, process.env.BUBBLE_API_PRIVATE_KEY as string);
  return parsed;
}

export interface Props {
  role: Role;
}

export async function getStaticPaths() {

  const roles = await GetAllRelevantRoles();
  const slugs = roles.map(role => role.slug);
  const paths = slugs.map(slug => ({ params: { id: slug } }));

  return {
    paths: paths,
    fallback: true, // can also be true or 'blocking'
  }
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(context: any) {
  const role = await getRoleData(context.params.id);
  return {
    // Passed to the page component as props
    props: { role: role },
    revalidate: 60 * 30, // In seconds
  }
}

export default function Home(props: Props) {

  //Check for fallback
  const router = useRouter()

  const role = props?.role;
  const [logoDark, setLogoDark] = useState<boolean>(false);

  useEffect(() => {
    if (role) {
      const test = new FastAverageColor();
      if (role.company.logo) {
        test.getColorAsync(role.company.logo as string).then((res) => {
          const dist_square: number =
            (res.value[0] - 72) ** 2 +
            (res.value[1] - 31) ** 2 +
            (res.value[2] - 132) ** 2;
          setLogoDark(dist_square < 20000); //TODO(scheuclu): Find a better heuristic here.
        })
      };
    }
  }, [role]);

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return (
      <div className="page">
        <Loading />
      </div>
    )
  }

  if (!role) {
    return;
  }

  if (role.id == "") {
    return FourOhFour();
  }

  return (
    <div>
      <Head>
        <title>{role.company.name + " - " + role.title}</title>

        {/* Preimary meta tags */}
        <meta
          name="title"
          content={role.company.name + " - " + role.title}
        ></meta>
        <meta
          name="description"
          content={role.company.name + " - " + role.title}
        ></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={role.company.name + " - " + role.title}
        />
        <meta
          property="og:description"
          content={role.company.name + " - " + role.title}
        />
        <meta
          property="og:image"
          content={role?.company?.logo.replace("//s3", "https://s3")}
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary" />
        <meta
          property="twitter:title"
          content={role.company.name + " - " + role.title}
        />

        <meta
          property="twitter:description"
          content={role.company.name + " - " + role.title}
        />
        <meta
          property="twitter:image"
          content={role?.company?.logo.replace("//s3", "https://s3")}
        />
      </Head>

      <div className="page">
        <div className="pageContainer">
          <div className={styles.headerContainer}>
            <div className={styles.headerLeftContainer}>
              <Link className={"body16Bold " + styles.headerLink} href="/">
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
                  src={role?.company?.logo.replace("//s3", "https://s3")}
                  alt="Logo"
                  fill={true}
                />
              </div>

              <div className={styles.roleInfoText}>
                <p className={"chapeau " + styles.companyText}>
                  {" "}
                  {role?.company.name}
                </p>
                <h1 className={"h1 " + styles.roleTitleText}>{role?.title}</h1>
                <div className={styles.desktopOnly}>
                  <p className={"body18 " + styles.companyTagLine}>
                    {role?.company.tagline}
                  </p>

                  <RoleConditions role={role} showBounty={false} isInverted={true} />
                </div>
              </div>
            </div>
            <div className={styles.mobileOnly}>
              <p className={"body18 " + styles.companyTagLine}>
                {role?.company.tagline}
              </p>
              <RoleConditions role={role} showBounty={false} isInverted={false} />
            </div>
          </div>
          <div className={styles.JDAndCompanyCardContainer}>
            <JdCard desc={role?.desc as string} />
            {role?.company && <CompanyCard company={role.company} />}
          </div>
          <ApplyCard
            roleid={role.id}
            role_type={role?.type}
            company_name={role?.company.name}
            role_title={role?.title}
            requirements={role?.requirements}
          />

          {/* TODO(scheuclu): replace with candidate_id */}
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
    </div>
  );
}
