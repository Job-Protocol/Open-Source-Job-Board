import React, { useState, useEffect } from "react";
import styles from "@/styles/Requirements.module.css";
import stylesGlobalFormElements from "@/styles/GlobalFormElements.module.css";

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
    // author: "ethdenver", //TODO(scheuclu): Should we hardcode the ETH-DENVER user here?
    argument: data.answer.argument,
    candidate: data.candidate_id,
    is_requirement_satisfied: data.answer.answer,
    is_required: data.requirement.is_required,
    requirement: data.requirement.id,
  }); //TODO(scheuclu): Check if other fields are needed.

  const requestOptions: RequestInit = {
    method: "POST",
    body: raw,
    redirect: "follow",
  };

  const response = await fetch(
    "../api/requirement_argument/create",
    requestOptions
  );
  if (response.status != 200) {
    postMessage("URGENT: 'storeRequirementArgument' failed with status code " + response.status.toString());
  }
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
  // Swal.fire({
  //     title: "Success!",
  //     text: "You sucessfully answered out questions. We will be in touch",
  //     icon: "success",
  //     iconColor: "#481f84",
  //     confirmButtonText: "Cool",
  // });
}

export interface CardProps {
  requirements: Requirement[] | undefined;
  candidateId: string;
  handleChange: (success: boolean) => void;
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
      setAnswers(
        requirements.map((req, index) => {
          return { argument: "", answer: false };
        })
      ); //TODO(scheuclu): Default answers should be "undefined"
    }
  }, [requirements]);

  //TODO useeffects via handle change functions

  if (!requirements) {
    return <p>No data on requirements</p>;
    //TODO(scheuclu): Log errors.
  }
  if (!data.candidateId) {
    return <p>No candidate ID provided</p>;
    //TODO(scheuclu): Log errors.
  }
  return (
    <div>
      <div className={styles.requirementsContainer}>
        {requirements.map((req, index) => (
          <RequirementCheck
            key={req.desc + "_req_list"}
            requirement={req}
            handleChange={(a) => {
              const newAnswers = [...answers];
              newAnswers[index] = a;
              setAnswers(newAnswers);
            }}
          />
        ))}
      </div>
      <div className={"marginTop32 " + styles.submitButtonContainer}>
        <button
          type="submit"
          className={stylesGlobalFormElements.primaryButton}
          name="button-1675001572178"
          onClick={() => {
            requirements.forEach((req, index) => {
              storeRequirementArgument({
                answer: answers[index],
                requirement: req,
                candidate_id: data.candidateId,
              });
            });
            // Reset the state, just in case a user sends multiple applications
            setAnswers([]);
            data.handleChange(true);
          }}
          id="button-apply"
        >
          Finish application
        </button>
        <a
          className={"body14 " + styles.skipLink}
          onClick={() => data.handleChange(true)}
        >
          Skip
        </a>
      </div>
    </div>
  );
}
