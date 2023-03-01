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
}


export default function CustomRole(data: Props) {

    const [bubbleRoles, setBubbleRoles] = useState<Role[] | null>(null);
    // const [bubbleCompanies, setBubbleCompanies] = useState<Company[] | null>([]);

    //Load up to 100 roles at a time
    useEffect(() => {
        async function getRoles() {
            const result = await fetch(`/api/role/`);
            const parsed = await result.json();
            setBubbleRoles(parsed);
        }
        getRoles();
    }, []);



    return (
        // <div className="m-10">
        <iframe
            className={stylesGlobalFormElements.modal_iframe}
            onClick={(e) => e.stopPropagation()}
            src={process.env.NEXT_PUBLIC_CONFIG_VERSION == "production" ? "https://app.jobprotocol.xyz/custom_role" : "https://app.jobprotocol.xyz/version-test/custom_role"}
            allowFullScreen={false}
            width='100%'
            height='100%'
            marginWidth={20}
        >
            Your browser does not support iframes.
        </iframe >
        // </div>


    );
}
