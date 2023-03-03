import React, { useState, useEffect } from "react";
import styles from "@/styles/Curation.module.sass";
import stylesGlobalFormElements from "@/styles/GlobalFormElements.module.sass";
import { Role, Requirement } from "@/bubble_types";
import Joblist from "../overview/joblist";
// import Requirement from "./detail/roleconditions";

import { Company } from "@/bubble_types";
import Loading from "../loading";

import { ActionType } from "../role/jobcard";
import customer_config from "@/customer_config.json";

import { fetchRoles } from "@/pages/api/role";
// export async function GetCompanies(): Promise<Company[]> {
//     const result = await fetch('/api/companies');
//     const parsed = await result.json();
//     return parsed;
// }



export interface Props {
    handleChange: (actiontype: ActionType, role: Role) => void;
    ignoreIDs: string[];
}


export default function CurationModal(data: Props) {

    const [jobprotocolRoles, setJobprotocolRoles] = useState<Role[] | null>(null);
    // const [bubbleCompanies, setBubbleCompanies] = useState<Company[] | null>([]);
    const [customerRoles, setCustomerRoles] = useState<Role[] | null>(null);

    //Load up to 100 roles at a time
    useEffect(() => {
        async function getJPRoles() {
            // const parsed: Role[] = await fetchRoles(process.env.BUBBLE_API_PRIVATE_KEY as string, params, 'Limeacademy');
            const result = await fetch(`/api/role`);
            const parsed = await result.json();
            setJobprotocolRoles(parsed.filter((role: Role) => !data.ignoreIDs.includes(role.id)));
        };
        async function getCustomerRoles() {
            // const parsed: Role[] = await fetchRoles(process.env.BUBBLE_API_PRIVATE_KEY as string, params, 'Limeacademy');
            const user_id = process.env.NEXT_PUBLIC_CONFIG_VERSION == 'production' ? customer_config.bubble_user_id.production : customer_config.bubble_user_id.dev
            console.log("USER ID", user_id);
            const result = await fetch(`/api/role?owner=${user_id}`);
            const parsed = await result.json();
            console.log("XXXXXXXXX", parsed);
            setCustomerRoles(parsed.filter((role: Role) => !data.ignoreIDs.includes(role.id)));
        };
        getJPRoles();
        getCustomerRoles();
    }, [data]);



    return (
        // <div className={styles.modal}>
        <div
            className={stylesGlobalFormElements.modal_content + " gap-y-5"}
            onClick={(e) => e.stopPropagation()}

        >
            <h1 className="text-center">Add roles to the dashboard.</h1>
            <hr></hr>
            <div className="flex flex-col gap-y-1">
                {/* <h2>Roles you have previously created</h2> */}
                {customerRoles !== null && <Joblist
                    title="Roles you have previously created"
                    roles={customerRoles}
                    mode='curation'
                    showBounty={true}
                    handleChange={(a, b) => data.handleChange(a, b)}
                />}
                {customerRoles == null && <Loading />}
            </div>
            <hr></hr>
            <div className="flex flex-col gap-y-1">
                {/* <h2>Joprotocol roles</h2> */}
                {jobprotocolRoles !== null && <Joblist
                    title="Joprotocol roles"
                    roles={jobprotocolRoles}
                    mode='curation'
                    showBounty={true}
                    handleChange={(a, b) => data.handleChange(a, b)}
                />}
                {jobprotocolRoles == null && <Loading />}
            </div>
        </div>
        // </div>
    );
}
