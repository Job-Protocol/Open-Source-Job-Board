import React, { useState } from "react";
import { useEffect } from "react";

import styles from "@/styles/Jobcard.module.css";

import { Inter, Titillium_Web } from "@next/font/google";
const inter = Inter({ subsets: ["latin"] });

import { Role } from "@/bubble_types";

export interface JobCardProps {
  role: Role;
}

export default function JobCard(data: JobCardProps) {
  const role = data.role;
  const link: string = "role/" + role.id;
  return (
    <a
      href={link}
      className={styles.card}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div id="horizontal" className={styles.main}>
        <div id="logo" className={styles.horizontal_flow}>
          <img
            src={role.company.logo as string}
            className={styles.logo}
            alt="Logo"
          />
        </div>
        <div id="content" className={styles.horizontal_flow}>
          <h2 className={inter.className}>
            {role.title} <span>-&gt;</span>
          </h2>
          <p className={inter.className}> {role.company.name} </p>
        </div>
      </div>
    </a>
  );
}
