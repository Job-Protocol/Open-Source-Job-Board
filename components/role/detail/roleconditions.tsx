import styles from "@/styles/Roleconditions.module.css";
import { Role } from "@/bubble_types";
import { rolelocation_to_string } from "@/utils";

export interface RoleConditionsProps {
  role: Role;
}

export default function RoleConditions(data: RoleConditionsProps) {
  if (!data.role) {
    return <div></div>;
  }

  return (
    <div className={styles.roleConditionsContainer}>
      <p>Full time</p>
      <p>•</p>
      {data.role.location && <p>•</p> && (
        <p>{rolelocation_to_string(data.role.location)}</p>
      )}
      <p>•</p>
      {data.role.salary_min && data.role.salary_max ? (
        <p>
          {data.role.salary_min / 1000}-{data.role.salary_max / 1000}K USD/y
        </p>
      ) : (
        <p>Competitive Package</p>
      )}

      <p>•s</p>
      {data.role.equity_pct_min && data.role.equity_pct_max ? (
        <p>
          {data.role.equity_pct_min * 100}%-{data.role.equity_pct_max * 100}%
          equity
        </p>
      ) : (
        <p>possible equity</p>
      )}
    </div>
  );
}
