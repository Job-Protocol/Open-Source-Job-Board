import React, { useState, useEffect } from "react";
import styles from "@/styles/Curation.module.sass";
import styles2 from "@/styles/Home.module.sass";
import stylesGlobalFormElements from "@/styles/GlobalFormElements.module.sass";
import { Role, Requirement } from "@/bubble_types";
import Joblist from "../overview/joblist";
import Loading from "../loading";

import { ActionType } from "../role/jobcard";
import customer_config from "@/customer_config.json";


export interface Props {
    handleChange: (actiontype: ActionType, role: Role) => void;
    ignoreIDs: string[];
}


export default function CurationModal(data: Props) {

    const [jobprotocolRoles, setJobprotocolRoles] = useState<Role[] | null>(null);
    // const [bubbleCompanies, setBubbleCompanies] = useState<Company[] | null>([]);
    const [customerRoles, setCustomerRoles] = useState<Role[] | null>(null);
    // const [searchTerm, setSearchterm] = useState<string | null>(null);
    // const [filteredJPRoles, setFilteredJPRoles] = useState<Role[]>([]);

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
            const result = await fetch(`/api/role?owner=${user_id}`);
            const parsed = await result.json();
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
            <h2 className="text-center">You can add both your own roles as well as generatl Jobprotocol roles to your jobboard here. </h2>
            <hr></hr>

            <div className="flex flex-col gap-y-1">
                {/* <h2>Roles you have previously created </h2> */}
                {customerRoles !== null && <Joblist
                    // title="Roles you have previously created"
                    title={`Roles you have previously created (${customerRoles.length})`}
                    roles={customerRoles}
                    mode='curation'
                    showBounty={true}
                    handleChange={(a, b) => data.handleChange(a, b)}
                />}
                {customerRoles == null && <Loading />}
            </div>
            <hr></hr>
            <div className="flex flex-col gap-y-1">
                {jobprotocolRoles !== null && <Joblist
                    title={`Other roles from app.jobprotocol.xyz (${jobprotocolRoles.length})`}
                    roles={jobprotocolRoles}
                    mode='curation'
                    showBounty={true}
                    handleChange={(a, b) => data.handleChange(a, b)}
                />}
                {jobprotocolRoles == null && <Loading />}
            </div>
        </div>
    );
}
