import Head from "next/head";
import styles from "@/styles/Roledetailpage.module.css";
import styles_req from "@/styles/Requirements.module.css";
import JdCard from "@/components/role/detail/jobdesc";
import ApplyCard from "@/components/role/apply";
import CompanyCard from "@/components/role/detail/companyinfo";
import RequirementsCard from "@/components/role/requirements";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { Role, Requirement } from "@/bubble_types";
import RoleConditions from "@/components/role/detail/roleconditions";

import Link from "next/link";
import Image from "next/image";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { FastAverageColor } from "fast-average-color"

async function getRoleData(roleid: string): Promise<Role> {
  const result = await fetch("../api/role/" + roleid);
  const parsed = await result.json();
  return parsed;
}

export default function Home() {
  const router = useRouter();
  const id = router.query.id;
  const [role, setRole] = useState<Role>();
  const [showCandidateDetailModal, setShowCandidateDetailModal] = useState(false);
  const [candidateId, setCandidateId] = useState<string | undefined>(undefined);
  const [logoDark, setLogoDark] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      getRoleData(id as string).then((res) => {
        setRole(res);
      });
    }
  }, [id]);

  useEffect(() => {
    if (role) {
      const test = new FastAverageColor();
      test.getColorAsync(role.company.logo as string).then(res => {
        const dist_square: number = (res.value[0] - 72) ** 2 + (res.value[1] - 31) ** 2 + (res.value[2] - 132) ** 2;
        setLogoDark(dist_square < 20000); //TODO(scheuclu): Find a better heuristic here.
      });
    }
  }, [role]);



  if (!role) {
    return;
  }
  return (
    <div>
      <Head>
        <title>ETH Denver Jobs</title>
        <meta name="description" content="Jobboard for ETHDenver 2023" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/faviconV2.png" />
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
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.1918 3.29103C12.5833 3.68032 12.5847 4.3129 12.195 4.70395L7.91604 8.99676L12.207 13.291C12.5977 13.6819 12.5977 14.3158 12.207 14.7068C11.8163 15.0977 11.1829 15.0977 10.7923 14.7068L5.84547 9.75621C5.82811 9.74116 5.81114 9.72541 5.7946 9.70897C5.40305 9.31968 5.40162 8.6871 5.7914 8.29605L10.777 3.29422C11.1668 2.90317 11.8002 2.90175 12.1918 3.29103Z"
                    fill="#EE4C83"
                  />
                </svg>
                Back to all positions
              </Link>
            </div>

            <div className={styles.headerRightContainer}>
              ETHDENVER Job Board
            </div>
          </div>
          <div className={styles.roleDetailHeaderContainer}>
            <div className={styles.roleInfo}>
              {logoDark &&
                <Image
                  className={styles.logo_dark}
                  src={role?.company?.logo.replace("//s3", "https://s3")}
                  alt="Logo"
                  width={122}
                  height={122}
                />
              }
              {!logoDark &&
                <Image
                  className={styles.logo_standard}
                  src={role?.company?.logo.replace("//s3", "https://s3")}
                  alt="Logo"
                  width={122}
                  height={122}
                />
              }
              <div className={styles.roleInfoText}>
                <p className={styles.companyText}> {role?.company.name}</p>
                <h1 className={styles.roleTitleText}>{role?.title}</h1>
                <RoleConditions role={role} isInverted={true} />
              </div>
            </div>
            <div className={styles.roleOptionsContainer}>
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
            </div>
          </div>
        </div>
      </div>

      <main className={styles.main}>
        {role?.company && <CompanyCard company={role.company} />}
        <JdCard desc={role?.desc as string} />
        <ApplyCard
          roleid={id}
          company_name={role?.company.name}
          role_title={role?.title}
          handleChange={(success: boolean, candidate_id: string) => {
            if (success) {
              setCandidateId(candidate_id);
              setShowCandidateDetailModal(true);
            }
          }}
        />
        {/* show only  after the initial applicaion has been successfulll */}
        {showCandidateDetailModal &&
          < div className={styles_req.modal}>
            <div className={styles_req.modal_content}>
              <h1>We have already saved your application!</h1>
              <h3>In order to better match you with the role, please answer a few more questions...</h3>
              <h3>Tick the checkboxes of the requirements you meet (leave open the ones you do not), and give a short explanation. </h3>
              <RequirementsCard
                requirements={role.requirements}
                candidateId={candidateId as string}
                handleChange={(success: boolean) => { setShowCandidateDetailModal(false) }}
              />
              {/* TODO(scheuclu): replace with candidate_id */}
            </div>
          </div>
        }

      </main >

    </div >
  );
}
