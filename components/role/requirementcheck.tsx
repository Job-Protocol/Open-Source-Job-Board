import React, { useState, useEffect } from "react";
import styles from "@/styles/Jobcard.module.css";
import { Role, Requirement } from "@/bubble_types";
// import Requirement from "./detail/roleconditions";

export interface CardProps {
    requirement: Requirement | undefined;
    handleChange: (answer: Answer) => void;
}

// export default function JobFilters({
//     handleChange,
// }: {
//     handleChange: (userAddress: GeographicAddress | undefined, remoteOnly: boolean | undefined) => void;
// }) {


export interface Answer {
    argument: string;
    answer: boolean;
}


export default function RequirementCheck(data: CardProps,) {
    const [answer, setAnswer] = useState<boolean>(false);
    const [argument, setArgument] = useState<string>("");
    const req: Requirement | undefined = data.requirement;
    // const link: string = "role/" + role.id;

    if (!req) {
        return (<p>No data on requirement</p>)
    }
    return (
        <div key="asdas">
            <div key={req.desc} className={styles.flexbox_container}>
                <input type="checkbox" className={styles.flexbox_child} onChange={value => {
                    setAnswer(!answer);
                    data.handleChange({ argument: "vvv", answer: !answer });
                }} />
                <p key={req.desc}>{req.desc} className={styles.flexbox_child} </p>
            </div>
            <input type="text" />
        </div>
    );
}
