import React, { SyntheticEvent } from "react";
import { useEffect, useState } from "react";
import { postMessages } from "@/utils";
import config from "../config.json";

import styles from "@/styles/Applycard.module.css";

import Swal from "sweetalert2";

import { validateEmail } from "@/utils";

type CandidateData = {
  first_name: string;
  last_name: string;
  email: string;
  github: string;
  linkedin: string;
  role: string;
};

export default function ApplyCard(params: any) {
  const ROLEID: string = params.roleid;
  const COMPANY_NAME: string = params.company_name;
  const ROLE_TITLE: string = params.role_title;
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [linkedIn, setLinkedIn] = useState<string>("");
  const [github, setGithub] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const [inputsValid, setInputsValid] = useState<boolean>(false);

  async function sendMail(candidate_id: string) {
    // const url = "../api/candidate/sendmail?id=" + candidate_id;
    // const response = await fetch(url);
  }

  async function storeApplication(data: CandidateData) {
    var raw = JSON.stringify({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      personal_website_url: data.github,
      linkedin_url: data.linkedin,
      role: data.role,
    });

    const requestOptions: RequestInit = {
      method: "POST",
      body: raw,
      redirect: "follow",
    };

    const response = await fetch("../api/candidate/create", requestOptions);
    const result = await response.json();
    const candidate_id: string = result.id;
    if (response.status !== 201) {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Reach out to us if this is a continous issue",
        icon: "error",
        iconColor: "#481f84",
        confirmButtonText: "Close",
      });
      return;
    }
    sendMail(candidate_id);
    const msg: string[] = [
      `Candidate ${firstName} ${lastName} (${email}) has applied for ${ROLE_TITLE} at ${COMPANY_NAME}`,
      `    Link to role: https://frontend-zeta-henna.vercel.app/role${ROLEID}`,
      `    Link to candidate: https://app.jobprotocol.xyz/version-test/api/1.1/obj/candidate/${candidate_id}`,
      ` `,
    ];
    postMessages(msg);
    Swal.fire({
      title: "Success!",
      text: "You sucessfully submitted an appication. We will be in touch",
      icon: "success",
      iconColor: "#481f84",
      confirmButtonText: "Cool",
    });

    // //Clear the form
    // setFirstName("");
    // setLastName("");
    // setEmail("");
    // setLinkedIn("");
    // setGithub("");
    // setWalletAddress("");
    // setButtonClicked(false);
    // setInputsValid(true);
  }

  const processInput = (event: any) => {
    if (event.target.id === "input-first-name") {
      setFirstName(event.target.value);
    } else if (event.target.id === "input-last-name") {
      setLastName(event.target.value);
    } else if (event.target.id === "input-email") {
      setEmail(event.target.value);
    } else if (event.target.id === "input-linkedin") {
      setLinkedIn(event.target.value);
    } else if (event.target.id === "input-github") {
      setGithub(event.target.value);
    } else if (event.target.id === "input-wallet-address") {
      setWalletAddress(event.target.value);
    }
    //throw error message if the target is uncldear
    checkInputsValid();
  };

  const submitApplication = (e: SyntheticEvent) => {
    e.preventDefault();
    setButtonClicked(true);
    storeApplication({
      first_name: firstName,
      last_name: lastName,
      email: email,
      linkedin: linkedIn,
      github: "",
      role: ROLEID,
    });
  };

  const checkInputsValid = () => {
    setInputsValid(
      firstName !== "" &&
        lastName !== "" &&
        email !== "" &&
        validateEmail(email) &&
        linkedIn !== "" &&
        github !== ""
    );
  };

  return (
    <div className={styles.card}>
      <div>
        <label htmlFor="text-1675001302437" className={styles.label}>
          First Name
        </label>
        <input
          type="text"
          className={styles.input}
          name="text-1675001302437"
          onChange={processInput}
          id="input-first-name"
          value={firstName}
        />
      </div>
      <div className="formbuilder-text form-group field-text-1675001326031">
        <label htmlFor="text-1675001326031" className={styles.label}>
          Last Name
        </label>
        <input
          type="text"
          className={styles.input}
          name="text-1675001326031"
          onChange={processInput}
          id="input-last-name"
          value={lastName}
        />
      </div>
      <div className="formbuilder-text form-group field-text-1675001343960">
        <label htmlFor="text-1675001343960" className={styles.label}>
          Email
        </label>
        <input
          type="email"
          className={
            email && validateEmail(email) ? styles.input : styles.input_invalid
          }
          name="text-1675001343960"
          onChange={processInput}
          id="input-email"
          value={email}
        />
      </div>
      <div className="formbuilder-text form-group field-text-1675001387870">
        <label htmlFor="text-1675001387870" className={styles.label}>
          LinkedIn
        </label>
        <input
          type="text"
          className={styles.input}
          name="text-1675001387870"
          onChange={processInput}
          id="input-linkedin"
          value={linkedIn}
        />
      </div>
      <div className="formbuilder-file form-group field-file-1675001423592">
        <label htmlFor="file-1675001423592" className={styles.label}>
          Resume
        </label>
        <input
          type="file"
          className={styles.input}
          name="file-1675001423592"
          onChange={processInput}
          id="input-resume"
        />
      </div>
      <div className="formbuilder-text form-group field-text-github">
        <label htmlFor="text-github" className={styles.label}>
          Github
        </label>
        <input
          type="text"
          className={styles.input}
          onChange={processInput}
          id="input-github"
          value={github}
        />
      </div>
      <div className="formbuilder-text form-group field-text-1675001555945">
        <label htmlFor="text-1675001555945" className={styles.label}>
          Wallet Address
        </label>
        <input
          type="text"
          value={walletAddress}
          className={styles.input}
          onChange={processInput}
          name="text-1675001555945"
          id="input-wallet-address"
        />
      </div>
      <div className="formbuilder-button form-group field-button-1675001572178">
        <button
          type="submit"
          className={
            inputsValid ? styles.primary_button : styles.primary_button_disabled
          }
          name="button-1675001572178"
          // style="default"
          onClick={submitApplication}
          id="button-apply"
        >
          Submit
        </button>
      </div>
      <h3> Here is your info</h3>
      <p>First Name {firstName}</p>
      <p>Last Name {lastName}</p>
      <p>Email {email}</p>
      <p>FLinkeIn {linkedIn}</p>
      <p>Github {github}</p>
      <p>wallet {walletAddress}</p>
    </div>
  );
}
