import React, { useState } from "react";
import { useEffect } from "react";

import styles from "@/styles/Jobcard.module.css";

import { Inter, Titillium_Web } from "@next/font/google";
const inter = Inter({ subsets: ["latin"] });

export interface JobCardProps {
  title: string;
  company_name: string;
  role_id: string;
  company_logo: string;
}

export default function JobCard(carddata: JobCardProps) {
  const link: string = "role/" + carddata.role_id;
  return (
    <a
      href={link}
      className={styles.card}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div id="horizontal" className={styles.main}>
        <div id="logo" className={styles.horizontal_flow}>
          <img src={carddata.company_logo} className={styles.logo} alt="Logo" />
        </div>
        <div id="content" className={styles.horizontal_flow}>
          <h2 className={inter.className}>
            {carddata.title} <span>-&gt;</span>
          </h2>
          <p className={inter.className}> {carddata.company_name} </p>
        </div>
      </div>
    </a>
  );
}
