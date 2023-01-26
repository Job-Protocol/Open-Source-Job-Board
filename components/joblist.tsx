import React, { useState } from "react";
import { useEffect } from "react";

import styles from "@/styles/Home.module.css";
import JobCard from "components/jobcard";

import { Inter } from "@next/font/google";
const inter = Inter({ subsets: ["latin"] });

interface Role {
  title: string;
  company_name: string;
}

async function GetUsers() {
  const result = await fetch("api/listroles");
  const parsed = await result.json();
  return parsed;
}

export default function Joblist() {
  const [userList, setUserList] = useState<Role[]>([]);

  useEffect(() => {
    GetUsers().then((res) => {
      console.log(res);
      setUserList(res);
    });
  }, []);

  console.log("userlist", userList);

  return (
    <div className={styles.grid}>
      {userList.map((role) => (
        <JobCard
          key={role.title}
          title={role.title}
          company_name={role.company_name}
        />
      ))}
    </div>
  );
}
