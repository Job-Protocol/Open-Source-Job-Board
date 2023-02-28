import React, { useState, useEffect } from "react";
import styles from "@/styles/Curation.module.sass";
import stylesGlobalFormElements from "@/styles/GlobalFormElements.module.sass";
import { Role, Requirement } from "@/bubble_types";
import Joblist from "../overview/joblist";
// import Requirement from "./detail/roleconditions";

import { Company } from "@/bubble_types";
import Loading from "../loading";

import { ActionType } from "../role/jobcard";
import { signIn } from "next-auth/react"

import { useSession } from "next-auth/react"


export async function GetCompanies(): Promise<Company[]> {
    const result = await fetch('/api/companies');
    const parsed = await result.json();
    return parsed;
}



// export interface Props {
//     handleChange: (actiontype: ActionType, role: Role) => void;
// }

async function loginUser(email: string, password: string): Promise<boolean> {
    const url = `/api/login?email=${email}&password=${password}`;
    const result = await fetch(url);
    if (result.status !== 200) {
        return false;
    }

    console.log("RESULT", result);
    const temp = await result.json();
    console.log("temp", temp);

    return true;
}


export default function Login() {

    const [inputsValid, setInputsValid] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // const { data: session } = useSession();

    useEffect(() => {
        setInputsValid(email.length > 0 && password.length > 0);
    }, [email, password]);

    // const data = useSession()
    // signIn();
    // console.log(data)

    //const test = sessionStorage.getItem("jwt")


    return (
        <div
            className={stylesGlobalFormElements.modal_content}
            onClick={(e) => e.stopPropagation()}

        >
            <div className="flex-col gap-y-2">
                {/* <p>{context}</p> */}
                <p>Valid: {inputsValid ? "yes" : "no"}</p>
                <p>Email: {email}</p>
                <p>Password: {password}</p>
                <h2> Please provide the correct admin user and password for this board. </h2>
                <input
                    type="text"
                    className={
                        stylesGlobalFormElements.input +
                        " " +
                        stylesGlobalFormElements.inputSquare
                    }
                    id="input-email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="text"
                    className={
                        stylesGlobalFormElements.input +
                        " " +
                        stylesGlobalFormElements.inputSquare
                    }
                    id="input-password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="submit"
                    className={inputsValid ?
                        "body16Bold " + stylesGlobalFormElements.primaryButton :
                        "body16Bold " + stylesGlobalFormElements.primaryButton + stylesGlobalFormElements.primaryButtonDisabled}
                    name="button-login"
                    onClick={() => loginUser(email, password)}
                    id="button-login"
                    disabled={inputsValid == false}
                >
                    Login
                </button>

            </div>

        </div>
    );
}


// Page.getInitialProps = async (context) => {
//     const res = await fetch("https://api.com");
//     const data = await res.json();

//     return { data } // this will be passed to the page component as props
// }

