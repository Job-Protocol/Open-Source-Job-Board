import React from "react";
import styles from "@/styles/Switch_role_companies.module.css";

import { useState, useEffect } from "react";

export interface Props {
  onChange: (v: boolean) => void;
  checked: boolean;
}

export default function SwitchRolesCompanies(data: Props) {
  const [byCompanies, setByCompanies] = useState<boolean>(data.checked);

  const toggle = () => {
    const newByCompanies = !byCompanies;
    setByCompanies(newByCompanies);
    data.onChange(newByCompanies);
  };

  return (
    <div className={styles.toggleButton}>
      <div
        className={
          byCompanies
            ? "body16 " + styles.toggleOff
            : "body16Bold " + styles.toggleOn
        }
        onClick={toggle}
      >
        Roles
      </div>
      <div
        className={
          byCompanies
            ? "body16Bold " + styles.toggleOn
            : "body16 " + styles.toggleOff
        }
        onClick={toggle}
      >
        Companies
      </div>
    </div>
  );
}
