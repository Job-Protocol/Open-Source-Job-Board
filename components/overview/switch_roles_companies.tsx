import React from "react";
import styles from "@/styles/Switch_role_companies.module.css";

import { useState, useEffect } from "react";

export default function SwitchRolesCompanies() {
  const [isRoles, setIsRoles] = useState<boolean>(true);

  const toggle = () => {
    setIsRoles(!isRoles);
  };

  return (
    <div className={styles.toggleButton}>
      <div
        className={isRoles ? styles.toggleOn : styles.toggleOff}
        onClick={toggle}
      >
        Roles
      </div>
      <div
        className={isRoles ? styles.toggleOff : styles.toggleOn}
        onClick={toggle}
      >
        Companies
      </div>
    </div>
  );
}
