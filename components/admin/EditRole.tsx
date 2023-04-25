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
    role: Role;
    // handleChange: (actiontype: ActionType, role: Role) => void;
}

export default function EditRole(data: Props) {


    return (
        <iframe
            className={stylesGlobalFormElements.modal_iframe}
            onClick={(e) => e.stopPropagation()}
            src={process.env.NEXT_PUBLIC_CONFIG_VERSION == "production" ?
                `https://app.jobprotocol.xyz/custom_role_edit/${data.role.slug}` :
                `https://app.jobprotocol.xyz/version-test/custom_role_edit/${data.role.slug}`
            }
            allowFullScreen={true}
            width='100%'
            height='100%'
            sandbox='allow-same-origin allow-scripts allow-popups allow-forms allow-modals'
        >
            Your browser does not support iframes.
        </iframe >

    );
}


// allow-forms	Allows form submission
// allow-modals	Allows to open modal windows
// allow-orientation-lock	Allows to lock the screen orientation
// allow-pointer-lock	Allows to use the Pointer Lock API
// allow-popups	Allows popups
// allow-popups-to-escape-sandbox	Allows popups to open new windows without inheriting the sandboxing
// allow-presentation	Allows to start a presentation session
// allow-same-origin	Allows the iframe content to be treated as being from the same origin
// allow-scripts	Allows to run scripts
// allow-top-navigation	Allows the iframe content to navigate its top-level browsing context
// allow-top-navigation-by-user-activation
