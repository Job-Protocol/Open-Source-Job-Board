import React, { useState } from "react";
import { useEffect } from "react";

import styles from "@/styles/Home.module.css";

import { Inter, Titillium_Web } from "@next/font/google";
const inter = Inter({ subsets: ["latin"] });

export interface JobCardProps {
  title: string;
  company_name: string;
  role_id: string;
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
      <h2 className={inter.className}>
        {carddata.title} <span>-&gt;</span>
      </h2>
      <p className={inter.className}> {carddata.company_name} </p>
    </a>
  );
}
