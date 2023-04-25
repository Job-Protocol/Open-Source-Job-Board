import React, { useState, useEffect } from "react";
import styles from "@/styles/Requirements.module.sass";
import stylesGlobalFormElements from "@/styles/GlobalFormElements.module.sass";
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

export default function RequirementCheck(data: CardProps) {
  const [answer, setAnswer] = useState<boolean>(false);
  const [argument, setArgument] = useState<string>("");
  const req: Requirement | undefined = data.requirement;
  // const link: string = "role/" + role.id;

  if (!req) {
    return <p>No data on requirement</p>;
  }
  return (
    <div key="asdas">
      <div key={req.id} className={styles.requirementCheckboxLabelContainer}>
        <input
          type="checkbox"
          className={stylesGlobalFormElements.checkbox}
          onChange={(value) => {
            setAnswer(!answer);
            data.handleChange({ argument: argument, answer: !answer });
          }}
        />
        <p key={req.desc} className={"body16 marginLeft8"}>
          {" "}
          {req.desc}{" "}
        </p>
      </div>
      <input
        className={
          "marginTop4 " +
          stylesGlobalFormElements.input +
          " " +
          stylesGlobalFormElements.inputSquare
        }
        type="text"
        placeholder="A few words on how you meet this requirement"
        onChange={(event) => {
          setArgument(event?.target.value);
          data.handleChange({ argument: argument, answer: answer });
        }}
      />
    </div>
  );
}
