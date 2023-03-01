import React, { useState, useEffect } from "react";
import styles from "@/styles/Curation.module.sass";
import stylesGlobalFormElements from "@/styles/GlobalFormElements.module.sass";
import { Role, Requirement } from "@/bubble_types";
import Joblist from "../overview/joblist";
// import Requirement from "./detail/roleconditions";

import { Company } from "@/bubble_types";
import Loading from "../loading";

import { ActionType } from "../role/jobcard";


export async function GetCompanies(): Promise<Company[]> {
    const result = await fetch('/api/companies');
    const parsed = await result.json();
    return parsed;
}



export interface Props {
    handleChange: (actiontype: ActionType, role: Role) => void;
    ignoreIDs: string[];
}


export default function CurationModal(data: Props) {

    const [bubbleRoles, setBubbleRoles] = useState<Role[] | null>(null);
    const [bubbleCompanies, setBubbleCompanies] = useState<Company[] | null>([]);

    //Load up to 100 roles at a time
    useEffect(() => {
        async function getRoles() {
            const result = await fetch(`/api/role/`);
            const parsed = await result.json();
            setBubbleRoles(parsed.filter((role: Role) => !data.ignoreIDs.includes(role.id)));
        }
        getRoles();
    }, [data]);



    return (
        // <div className={styles.modal}>
        <div
            className={stylesGlobalFormElements.modal_content}
            onClick={(e) => e.stopPropagation()}

        >
            <h1>Add avavailable Jobprotocol roles to your dashboard using this modal.</h1>
            {bubbleRoles !== null && <Joblist
                roles={bubbleRoles}
                mode='curation'
                showBounty={true}
                handleChange={(a, b) => data.handleChange(a, b)}
            />}
            {bubbleRoles == null && <Loading />}
        </div>
        // </div>
    );
}
