import React, { useState, useEffect } from "react";
import styles from "@/styles/Jobcard.module.css";
import { Role, Requirement, RequirementArgument } from "@/bubble_types";
import RequirementCheck, { Answer } from "./requirementcheck";
import Swal from "sweetalert2";

export interface RequirementArgumentData {
    answer: Answer;
    requirement: Requirement;
    candidate_id: string;
}

async function storeRequirementArgument(data: RequirementArgumentData) {
    var raw = JSON.stringify({
        argument: data.answer.argument,
        // author: "unknown", //TODO
        candidate: data.candidate_id,
        // is_author_candidate_itself: true, //TODO
        is_requirement_satisfied: data.answer.answer,
    });

    const requestOptions: RequestInit = {
        method: "POST",
        body: raw,
        redirect: "follow",
    };

    const response = await fetch("../api/requirement_argument/create", requestOptions);
    const result = await response.json();
    const candidate_id: string = result.id;
    if (response.status !== 201) {
        console.log("Error: " + response.status + " " + response.statusText);
        Swal.fire({
            title: "Error!!!!",
            text: "SOmething went wrong. Reach out to us if this is a continous issue",
            icon: "error",
            iconColor: "#481f84",
            confirmButtonText: "Close",
        });
        return;
    }
    // const msg: string[] = [
    //     `Candidate ${firstName} ${lastName} (${email}) has applied for ${ROLE_TITLE} at ${COMPANY_NAME}`,
    //     `    Link to role: https://frontend-zeta-henna.vercel.app/role${ROLEID}`,
    //     `    Link to candidate: https://app.jobprotocol.xyz/version-test/api/1.1/obj/candidate/${candidate_id}`,
    //     ` `,
    // ];
    // postMessages(msg);
    Swal.fire({
        title: "Success!",
        text: "You sucessfully answered out questions. We will be in touch",
        icon: "success",
        iconColor: "#481f84",
        confirmButtonText: "Cool",
    });
}




export interface CardProps {
    requirements: Requirement[] | undefined;
    candidate_id: string;
}
export default function RequirementsCard(data: CardProps) {

    // const [req2answer, setReq2answer] = useState<Map<string, Answer>>();
    const requirements: Requirement[] | undefined = data.requirements;
    const [reqIDs, setReqIDs] = useState<string[]>([]);
    const [answers, setAnswers] = useState<Answer[]>([]);

    //initialize empty Answers
    useEffect(() => {
        if (requirements) {
            // const r2a: Map<string, Answer> = new Map();
            // requirements?.forEach((req: Requirement) => { r2a.set(req.id, { argument: "asdasd", answer: false }) });
            // setReq2answer(r2a);
            setReqIDs(requirements.map((req, index) => req.id));
            setAnswers(requirements.map((req, index) => { return { argument: "asdasd", answer: false } }));
        }
    }, [requirements]);

    //TODO useeffects via handle change functions

    if (!requirements) {
        return (<p>No data on requirements</p>)
    }
    return (
        <div>
            <h3>Recorded answers:</h3>
            {
                answers.map((answer: Answer, index: number) =>
                    <p key={"answer_" + index}>
                        {answer.answer.toString()} {answer.argument}
                    </p>)
            }

            <h3>Tick the checkboxes of the requirements you meet (leave open the ones you do not), and give a short explanation. </h3>
            {
                requirements.map((req, index) => <RequirementCheck
                    key={req.desc + "_req_list"}
                    requirement={req}
                    handleChange={a => {
                        const newAnswers = [...answers];
                        newAnswers[index] = a;
                        setAnswers(newAnswers);
                    }}
                />)
            }
            < button
                type="submit"
                className={styles.primary_button}
                name="button-1675001572178"
                onClick={() => {
                    console.log("Button clicked");
                    storeRequirementArgument({
                        answer: answers[0],
                        requirement: requirements[0],
                        candidate_id: data.candidate_id//TODO
                    });
                }}//TODO this is where we should update the candidate
                id="button-apply"
            >
                Finish application
            </button>
        </div >
    );
}
