import React from "react";
import styles from "@/styles/Switch_role_companies.module.css";

import { useState, useEffect } from "react";

export default function SwitchRolesCompanies() {
  return (
    <div className={styles.toggleButton}>
      <div className={styles.toggleOn}>Roles</div>
      <div className={styles.toggleOff}>Companies</div>
    </div>
  );
}
