import React, { useState, useEffect } from "react";
import stylesGlobalFormElements from "@/styles/GlobalFormElements.module.sass";
import { Role } from "@/bubble_types";
import { Company } from "@/bubble_types";
import customer_config from "@/customer_config.json";

export async function GetCompanies(): Promise<Company[]> {
    const result = await fetch('/api/companies');
    const parsed = await result.json();
    return parsed;
}

export interface Props {
    password: string;
    // handleChange: (actiontype: ActionType, role: Role) => void;
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
        <iframe
            className={stylesGlobalFormElements.modal_iframe}
            onClick={(e) => e.stopPropagation()}
            src={process.env.NEXT_PUBLIC_CONFIG_VERSION == "production" ?
                `https://app.jobprotocol.xyz/custom_role?user=${customer_config.bubble_user_email}&password=${data.password}` :
                `https://app.jobprotocol.xyz/version-test/custom_role?user=${customer_config.bubble_user_email}&password=${data.password}`
            }
            allowFullScreen={true}
            width='100%'
            height='100%'
            sandbox='allow-same-origin allow-scripts allow-popups allow-forms'
        >
            Your browser does not support iframes.
        </iframe >

    );
}
