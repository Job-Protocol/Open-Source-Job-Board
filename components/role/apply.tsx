import React, { SyntheticEvent } from "react";
import { useState } from "react";
//import { postMessages } from "@/utils"; //TODO(scheuclu): Issue with Slack token.
import styles from "@/styles/Applycard.module.css";
import styles_req from "@/styles/Requirements.module.css";
import stylesGlobalFormElements from "@/styles/GlobalFormElements.module.css";
import Swal from "sweetalert2";
import { validateEmail } from "@/utils";
import Image from "next/image";
import FileReader from '@tanker/file-reader';
import { Requirement } from "@/bubble_types";

import RequirementsCard from "@/components/role/requirements";


import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaHome,
  FaUserFriends,
} from "react-icons/fa";

type CandidateData = {
  first_name: string;
  last_name: string;
  email: string;
  github: string;
  linkedin: string;
  role: string;
  resume: File | undefined;
};

export interface ApplyCardProps {
  role_id: string;
  company_name: string;
  tole_title: string;
  handleChange: (sucess: boolean, candidate_id: string) => void;
  requirements: Requirement[];
}

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
  const [resume, setResume] = useState<File | undefined>(undefined);
  const [showApplicationSuccessModal, setShowApplicationSuccessModal] = useState<boolean>(false);
  const [showCandidateDetailModal, setShowCandidateDetailModal] = useState<boolean>(false);
  // const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [candidateId, setCandidateId] = useState<string>("");

  async function sendMail(candidate_id: string) {
    // const url = "../api/candidate/sendmail?id=" + candidate_id;
    // const response = await fetch(url);
  }

  async function storeApplication(data: CandidateData, checkRequirements: boolean) {


    var raw = JSON.stringify({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      personal_website_url: data.github,
      linkedin_url: data.linkedin,
      role: data.role
    });

    var content = "";
    if (data.resume) {
      const reader = new FileReader(data.resume);
      const dataUrl = await reader.readAsDataURL();
      content = dataUrl.split('base64,')[1]
      raw = JSON.stringify({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        personal_website_url: data.github,
        linkedin_url: data.linkedin,
        role: data.role,
        resume_file: {
          "filename": "resume.pdf",
          "contents": content,
          "private": false
        }
      })
    }

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
    //postMessages(msg);
    params.handleChange(true, candidate_id);
    setCandidateId(candidate_id)
    // Swal.fire({
    //   title: "Success!",
    //   text: "You sucessfully submitted an appication. We will be in touch",
    //   icon: "success",
    //   iconColor: "#481f84",
    //   confirmButtonText: "Cool",
    // });

    if (checkRequirements) {
      setShowCandidateDetailModal(true);
    } else {
      setShowApplicationSuccessModal(true);
    }

    //Clear the form
    setFirstName("");
    setLastName("");
    setEmail("");
    setLinkedIn("");
    setGithub("");
    setWalletAddress("");
    setButtonClicked(false);
    setInputsValid(true);
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
    else if (event.target.id === "input-resume") {
      const Tempfile = event.target.files[0]
      if (!Tempfile) {
        return
      }
      // check file size
      const size = parseInt(((Tempfile.size / 1024) / 1024).toFixed(4))
      let file = new File([Tempfile.slice(0, Tempfile.size, 'application/pdf')], event.target.value, { type: 'application/pdf' });
      setResume(file);

    }
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
      resume: resume//TODO Lukas
    }, params.requirements !== undefined);
  };

  const checkInputsValid = () => {
    setInputsValid(
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      validateEmail(email) &&
      linkedIn !== "" &&
      github !== "" &&
      resume != undefined
    );
  };

  return (
    <div className={styles.card}>
      <h2 className={"body18Bold"}>Apply for this position</h2>
      <div className={styles.formContainer}>
        <div className={styles.formItemGroup}>
          <h3 className={"chapeauDark " + styles.formItemGroupTitle}>
            General
          </h3>
          <div className={styles.formItem}>
            <label
              htmlFor="text-1675001302437"
              className={"body16 " + styles.formLabel}
            >
              First Name
            </label>
            <input
              type="text"
              className={
                stylesGlobalFormElements.input +
                " " +
                stylesGlobalFormElements.inputSquare
              }
              name="text-1675001302437"
              onChange={processInput}
              id="input-first-name"
              value={firstName}
            />
          </div>
          <div className={styles.formItem}>
            <label
              htmlFor="text-1675001326031"
              className={"body16 " + styles.formLabel}
            >
              Last Name
            </label>
            <input
              type="text"
              className={
                stylesGlobalFormElements.input +
                " " +
                stylesGlobalFormElements.inputSquare
              }
              name="text-1675001326031"
              onChange={processInput}
              id="input-last-name"
              value={lastName}
            />
          </div>
          <div className={styles.formItem}>
            <label
              htmlFor="text-1675001343960"
              className={"body16 " + styles.formLabel}
            >
              Email
            </label>
            <input
              type="email"
              className={
                stylesGlobalFormElements.input +
                " " +
                stylesGlobalFormElements.inputSquare
                // email && validateEmail(email)
                //   ? stylesGlobalFormElements.input +
                //     " " +
                //     stylesGlobalFormElements.inputSquare
                //   : stylesGlobalFormElements.input +
                //     " " +
                //     stylesGlobalFormElements.inputSquare +
                //     " " +
                //     stylesGlobalFormElements.inputInvalid
              }
              name="text-1675001343960"
              onChange={processInput}
              id="input-email"
              value={email}
            />
          </div>
        </div>

        <div className={styles.formItemGroup}>
          <h3 className={"chapeauDark " + styles.formItemGroupTitle}>
            Credentials
          </h3>
          <div className={styles.formItem}>
            <label
              htmlFor="text-1675001387870"
              className={"body16 " + styles.formLabel}
            >
              <FaLinkedin />
              LinkedIn
            </label>
            <input
              type="text"
              className={
                stylesGlobalFormElements.input +
                " " +
                stylesGlobalFormElements.inputSquare
              }
              name="text-1675001387870"
              onChange={processInput}
              id="input-linkedin"
              value={linkedIn}
            />
          </div>
          <div className={styles.formItem}>
            <label
              htmlFor="text-github"
              className={"body16 " + styles.formLabel}
            >
              <FaGithub />
              Github
            </label>
            <input
              type="text"
              className={
                stylesGlobalFormElements.input +
                " " +
                stylesGlobalFormElements.inputSquare
              }
              onChange={processInput}
              id="input-github"
              value={github}
            />
          </div>
          <div className={styles.formItem}>
            <label
              htmlFor="file-1675001423592"
              className={"body16 " + styles.formLabel}
            >
              Resume
            </label>
            <label
              htmlFor="input-resume"
              className={"body16Bold " + styles.uploadButtonLabel}
            >
              <Image
                src={"/link.svg"}
                alt="LinkIcon"
                width={16}
                height={16}
                style={{ transform: "rotate(-45deg)" }}
              />
              Attach Resume/CV
              <input
                type="file"
                className={styles.uploadButton}
                name="file-1675001423592"
                onChange={processInput}
                id="input-resume"
              />
            </label>
          </div>
          <div className={styles.formItem}>
            <label
              htmlFor="text-1675001555945"
              className={"body16 " + styles.formLabel}
            >
              Wallet Address
            </label>
            <input
              type="text"
              value={walletAddress}
              className={
                stylesGlobalFormElements.input +
                " " +
                stylesGlobalFormElements.inputSquare
              }
              onChange={processInput}
              name="text-1675001555945"
              id="input-wallet-address"
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            className={
              inputsValid
                ? stylesGlobalFormElements.primaryButton
                : stylesGlobalFormElements.primaryButton +
                " " +
                styles.primaryButtonDisabled
            }
            name="button-1675001572178"
            // style="default"
            onClick={submitApplication}
            id="button-apply"
          >
            Submit Application
          </button>
        </div>
      </div>


      {showCandidateDetailModal && (
        <div className={styles_req.modal}>
          <div className={styles_req.modal_content}>
            <h1>We have already saved your application!</h1>
            <h3>
              In order to better match you with the role, please answer a
              few more questions...
            </h3>
            <h3>
              Tick the checkboxes of the requirements you meet (leave open
              the ones you do not), and give a short explanation.{" "}
            </h3>
            <RequirementsCard
              requirements={params.requirements}
              candidateId={candidateId as string}
              handleChange={(success: boolean) => {
                setShowCandidateDetailModal(false);
                setShowApplicationSuccessModal(true);
              }}
            />
          </div>
        </div>
      )}

      {showApplicationSuccessModal && (
        <div className={styles_req.modal}>
          <div className={styles_req.modal_content}>
            <h1>Thanks for applying! We will be in touch soon.</h1>
          </div>
        </div>
      )}




    </div>
  );
}
