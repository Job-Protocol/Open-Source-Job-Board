import React, { SyntheticEvent } from "react";
import { useState } from "react";
//import { postMessages } from "@/utils"; //TODO(scheuclu): Issue with Slack token.
import styles from "@/styles/Applycard.module.css";
import styles_role_detail from "@/styles/Roledetailpage.module.css";
import styles_req from "@/styles/Requirements.module.css";
import stylesGlobalFormElements from "@/styles/GlobalFormElements.module.css";
import Swal from "sweetalert2";
import { validateEmail } from "@/utils";
import Image from "next/image";
import FileReader from "@tanker/file-reader";
import { Requirement, RoleType, GeographicAddress } from "@/bubble_types";
import { getConfig } from "@/utils";
import RequirementsCard from "@/components/role/requirements";
import SearchBox from "../overview/searchbox";
import { GetGeographicAddress } from "../overview/jobfilters";

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
  location: GeographicAddress | undefined;
  eth_wallet_address: string | undefined;
};

export interface ApplyCardProps {
  role_id: string;
  role_type: RoleType;
  company_name: string;
  tole_title: string;
  requirements: Requirement[];
}

export default function ApplyCard(params: any) {
  const ROLEID: string = params.roleid;
  const COMPANY_NAME: string = params.company_name;
  const ROLE_TITLE: string = params.role_title;
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [location, setLocation] = useState<GeographicAddress | undefined>(
    undefined
  );
  const [email, setEmail] = useState<string>("");
  const [linkedIn, setLinkedIn] = useState<string>("");
  const [github, setGithub] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const [inputsValid, setInputsValid] = useState<boolean>(false);
  const [resume, setResume] = useState<File | undefined>(undefined);
  const [showApplicationSuccessModal, setShowApplicationSuccessModal] =
    useState<boolean>(false);
  const [showCandidateDetailModal, setShowCandidateDetailModal] =
    useState<boolean>(false);
  // const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [candidateId, setCandidateId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function sendMail(candidate_id: string) {
    // const url = "../api/candidate/sendmail?id=" + candidate_id;
    // const response = await fetch(url);
  }

  async function storeApplication(
    data: CandidateData,
    checkRequirements: boolean
  ) {
    const referred_by = getConfig()["referred_by"];

    const candidate_location: string | undefined = data.location
      ? data.location.address
      : undefined;

    var raw = JSON.stringify({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      personal_website_url: data.github,
      linkedin_url: data.linkedin,
      role: data.role,
      referred_by: referred_by,
      referral_type: "Link",
      state: "New",
      has_confirmed_interest: true,
      location_new: candidate_location,
      eth_wallet_address: data.eth_wallet_address,
      github: data.github,
    });

    var content = "";
    if (data.resume) {
      const reader = new FileReader(data.resume);

      if (reader._source.size > 10000000) {
        Swal.fire({
          title: "Error!",
          text: "File size is too large. Please upload a file smaller than 10MB",
          icon: "error",
          iconColor: "#481f84",
          confirmButtonText: "Close",
        });
        setIsSubmitting(false);
        return;
      }

      const dataUrl = await reader.readAsDataURL();
      content = dataUrl.split("base64,")[1];
      raw = JSON.stringify({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        personal_website_url: data.github,
        linkedin_url: data.linkedin,
        role: data.role,
        referred_by: referred_by,
        referral_type: "Link",
        state: "New",
        has_confirmed_interest: true,
        location_new: candidate_location,
        resume_file: {
          filename: "resume.pdf",
          contents: content,
          private: false,
        },
        eth_wallet_address: data.eth_wallet_address,
        github: data.github,
      });
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
      postMessage("URGENT: 'candidate creation' failed with status code " + response.status.toString());
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
    // params.handleChange(true, candidate_id);
    setCandidateId(candidate_id);
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
    // setInputsValid(true);
    setIsSubmitting(false);
  }

  const processInput = (event: any) => {
    if (event.target.id === "input-first-name") {
      setFirstName(event.target.value);
    } else if (event.target.id === "input-last-name") {
      setLastName(event.target.value);
    } else if (event.target.id === "input-location") {
      setLocation(event.target.value);
    } else if (event.target.id === "input-email") {
      setEmail(event.target.value);
    } else if (event.target.id === "input-linkedin") {
      setLinkedIn(event.target.value);
    } else if (event.target.id === "input-github") {
      setGithub(event.target.value);
    } else if (event.target.id === "input-wallet-address") {
      setWalletAddress(event.target.value);
    } else if (event.target.id === "input-resume") {
      const Tempfile = event.target.files[0];
      if (!Tempfile) {
        return;
      }
      // check file size
      const size = parseInt((Tempfile.size / 1024 / 1024).toFixed(4));
      let file = new File(
        [Tempfile.slice(0, Tempfile.size, "application/pdf")],
        event.target.value,
        { type: "application/pdf" }
      );
      setResume(file);
    }
    checkInputsValid();
  };

  const submitApplication = (e: SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setButtonClicked(true);
    storeApplication(
      {
        first_name: firstName,
        last_name: lastName,
        email: email,
        linkedin: linkedIn,
        github: github,
        role: ROLEID,
        resume: resume,
        location: location,
        eth_wallet_address: walletAddress,
      },
      params.requirements !== undefined
    );
  };

  const checkInputsValid = () => {
    setInputsValid(
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      location != undefined &&
      validateEmail(email) &&
      (linkedIn !== "" || resume != undefined)
    );
  };

  return (
    <div className={styles_role_detail.card}>
      <h2 className={"body18Bold"}>Apply for this position</h2>
      <div className={styles.formContainer}>
        <div className={styles.formItemGroup}>
          <div>
            <h3 className={"chapeauDark " + styles.formItemGroupTitle}>
              General
            </h3>
            <p className="body14">Required fields</p>
          </div>

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
            // placeholder={"Required, e.g. Vitalik"}
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
            // placeholder={"Required, e.g. Buterin"}
            />
          </div>
          <div className={styles.formItem}>
            <label
              htmlFor="input-location"
              className={"body16 " + styles.formLabel} //TODO
            >
              Location
            </label>
            <SearchBox
              id="input-location"
              disabled={false}
              customHeight="48px"
              handleChange={(val) => {
                GetGeographicAddress(val.value).then((res) => {
                  setLocation(res);
                });
              }}
            />
            {/* <input
              type="text"
              className={
                stylesGlobalFormElements.input +
                " " +
                stylesGlobalFormElements.inputSquare
              }
              name="input-location"
              onChange={processInput}
              id="input-location"
              value={location}
            // placeholder={"Required, e.g. Buterin"}
            /> */}
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
                email && !validateEmail(email)
                  ? stylesGlobalFormElements.inputInvalid +
                  " " +
                  stylesGlobalFormElements.inputSquare
                  : stylesGlobalFormElements.input +
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
            // placeholder={"Required, e.g. vitalik@ethereum.org"}
            />
          </div>
        </div>

        <div className={styles.formItemGroup}>
          <div>
            <h3 className={"chapeauDark " + styles.formItemGroupTitle}>
              Resume
            </h3>
            <p className="body14">
              Please provide at least one of the following
            </p>
          </div>

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
                stylesGlobalFormElements.inputSquare +
                " " +
                styles.fullwidth
              }
              name="text-1675001387870"
              onChange={processInput}
              id="input-linkedin"
              value={linkedIn}
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
            <p> &nbsp;{resume?.name.split('\\')[resume?.name.split('\\').length - 1]}</p>
          </div>
        </div>
        <div className={styles.formItemGroup}>
          <div>
            <h3 className={"chapeauDark " + styles.formItemGroupTitle}>
              Other Credentials
            </h3>
            <p className="body14">Optional</p>
          </div>

          {(params.role_type === RoleType.Engineering ||
            params.role_type === undefined) && (
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
            )}
          <div className={styles.formItem}>
            <label
              htmlFor="text-1675001555945"
              className={"body16 " + styles.formLabel}
            >
              ETH Wallet Address / ENS
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
              isSubmitting
                ? stylesGlobalFormElements.primaryButton +
                " " +
                stylesGlobalFormElements.primaryButtonDisabled
                : inputsValid
                  ? stylesGlobalFormElements.primaryButton
                  : stylesGlobalFormElements.primaryButton +
                  " " +
                  stylesGlobalFormElements.primaryButtonDisabled
            }
            name="button-1675001572178"
            // style="default"
            onClick={submitApplication}
            id="button-apply"
            disabled={!inputsValid}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </div>

      {showCandidateDetailModal && (
        <div
          className={styles_req.modal}
          onClick={() => {
            setShowCandidateDetailModal(false);
            setShowApplicationSuccessModal(true);
          }}
        >
          <div
            className={styles_req.modal_content}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles_req.confirmation_message_container}>
              <p className="body16">Application submitted successfullly</p>
              <Image
                width={24}
                height={24}
                src={"/check-circle-fill.svg"}
                alt="Check icon"
              />
            </div>

            <h2 className="h1 center marginTop24">Want to stand out?</h2>

            <p className="body16 marginTop4">
              To make your application stand out, tick the checkboxes of the
              requirements you meet and highlight any relevant experience in a
              few words.
            </p>
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
        <div
          className={styles_req.modal}
          onClick={() => setShowApplicationSuccessModal(false)}
        >
          <div
            className={
              styles_req.modal_content + " " + styles_req.modal_content_success
            }
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              width={64}
              height={64}
              src={"/check-circle-fill.svg"}
              alt="Check icon"
            />
            <h2 className="h1 marginTop16">Application Submitted!</h2>

            <p className="body14 marginTop4">
              You’ll hear about next steps through email in the next few days.
            </p>
            {/* <button
              type="submit"
              className={stylesGlobalFormElements.primaryButton}
              name="button-1675001572178"
              onClick={() => setShowApplicationSuccessModal(false)}
              id="button-close-success-modal"
            >
              close
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
}
