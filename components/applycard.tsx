import React, { SyntheticEvent } from "react";
import bbobHTML from "@bbob/html";
import presetHTML5 from "@bbob/preset-html5";
import { useEffect, useState } from "react";

import styles from "@/styles/Applycard.module.css";
import { Inter, Titillium_Web } from "@next/font/google";
const inter = Inter({ subsets: ["latin"] });

// export interface FormApplyProps {
//   desc: string;
// }

async function storeApplication() {
  console.log("Success");
}

export default function ApplyCard() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [linkedIn, setLinkedIn] = useState<string>("");
  const [github, setGithub] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const [inputsValid, setInputsValid] = useState<boolean>(false);

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
    console.log("The link was clicked.");
    alert("test");
    setButtonClicked(true);
  };

  const checkInputsValid = () => {
    setInputsValid(
      firstName !== "" &&
        lastName !== "" &&
        email !== "" &&
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
        />
      </div>
      <div className="formbuilder-text form-group field-text-1675001343960">
        <label htmlFor="text-1675001343960" className={styles.label}>
          Email
        </label>
        <input
          type="email"
          className={styles.input}
          name="text-1675001343960"
          onChange={processInput}
          id="input-email"
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
        />
      </div>
      <div className="formbuilder-file form-group field-file-1675001423592">
        <label htmlFor="file-1675001423592" className="formbuilder-file-label">
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
        />
      </div>
      <div className="formbuilder-text form-group field-text-1675001555945">
        <label htmlFor="text-1675001555945" className={styles.label}>
          Wallet Address
        </label>
        <input
          type="text"
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
          Button
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
