import Head from "next/head";
import styles from "@/styles/Roledetailpage.module.css";
import JdCard from "@/components/role/detail/jobdesc";
import ApplyCard from "@/components/role/apply";
import CompanyCard from "@/components/role/detail/companyinfo";
import RequirementsCard from "@/components/role/requirements";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { Role, Requirement } from "@/bubble_types";
import RoleConditions from "@/components/role/detail/roleconditions";


import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

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
  const [candidate_id, setCandidateId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (id) {
      getRoleData(id as string).then((res) => {
        setRole(res);
      });
    }
  }, [id]);

  if (!role) {
    return;
  }
  return (
    <div>
      <a href={"https://app.jobprotocol.xyz/version-test/role/" + id}>
        <h1>[Admin] Click here to edit role on jobprotocol</h1>
      </a>
      <Head>
        <title>ETH Denver Jobs</title>
        <meta name="description" content="Jobboard for ETHDenver 2023" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/faviconV2.png" />
      </Head>

      <div className={styles.headercard}>
        <div id="header-top" className={styles.flexbox_container}>
          <div className={styles.flex_child}>
            <img src={role?.company?.logo} className={styles.logo} alt="Logo" />
          </div>
          <div className={styles.flex_child}>
            <h1 className={styles.pagetitle}>{role?.title}</h1>
            <p> @{role?.company.name}</p>
            <RoleConditions role={role} />
          </div>
        </div>

        <div id="header-bottom">
          <h3> @ {role?.company?.name}</h3>
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
        {/* show only after the initial applicaion has been successfulll */}
        {showCandidateDetailModal &&
          < div className={styles.modal}>
            <div className={styles.modal_content}>
              <h1>Were already saved your application!</h1>
              <h2>AAA asdasd aslkdjasd aksdljals dkaj</h2>
              <RequirementsCard requirements={role.requirements} candidate_id="1675170251217x255982004984656160" />
            </div>
          </div>
        }

      </main >

    </div >
  );
}
