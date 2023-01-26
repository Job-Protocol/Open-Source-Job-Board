import React, { useState } from "react";
import { useEffect } from "react";

import styles from "@/styles/Home.module.css";

import { Inter, Titillium_Web } from "@next/font/google";
const inter = Inter({ subsets: ["latin"] });

interface JobCardProps {
  title: string;
  company_name: string;
}

export default function JobCard({ title, company_name }: JobCardProps) {
  const link: string = "role/" + title;
  return (
    <a
      href={link}
      className={styles.card}
      target="_blank"
      rel="noopener noreferrer"
    >
      <h2 className={inter.className}>
        {title} <span>-&gt;</span>
      </h2>
      <p className={inter.className}> {company_name} </p>
    </a>
  );
}
