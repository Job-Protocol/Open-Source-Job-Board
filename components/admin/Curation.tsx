import React, { useState, useEffect } from "react";
import styles from "@/styles/Curation.module.css";
import stylesGlobalFormElements from "@/styles/GlobalFormElements.module.css";
import { Role, Requirement } from "@/bubble_types";
import Joblist from "../overview/joblist";
// import Requirement from "./detail/roleconditions";

import { Company } from "@/bubble_types";
import Loading from "../loading";


export async function GetCompanies(): Promise<Company[]> {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/companies`
    );
    const parsed = await result.json();
    return parsed;
}



export interface Props {
}


export default function CurationModal(data: Props) {

    const [bubbleRoles, setBubbleRoles] = useState<Role[] | undefined>(undefined);
    const [bubbleCompanies, setBubbleCompanies] = useState<Company[] | undefined>([]);

    //Load up to 100 roles at a time
    useEffect(() => {
        async function getRoles() {
            const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/role/`);
            const parsed = await result.json();
            setBubbleRoles(parsed);
        }
        getRoles();
    }, []);



    return (
        // <div className={styles.modal}>
        <div
            className={stylesGlobalFormElements.modal_content}
            onClick={(e) => e.stopPropagation()}

        >
            <h1>Curate</h1>
            <p>{bubbleRoles?.length}</p>
            {bubbleRoles !== undefined && <Joblist roles={bubbleRoles} mode='curation' />}
            {bubbleRoles == undefined && <Loading />}
        </div>
        // </div>
    );
}
