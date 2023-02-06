import styles from "@/styles/Roleconditions.module.css";
import { Role } from "@/bubble_types";
import { rolelocation_to_string } from "@/utils";

export interface RoleConditionsProps {
  role: Role;
  isInverted?: boolean;
}

export default function RoleConditions(data: RoleConditionsProps) {
  if (!data.role) {
    return <div></div>;
  }

  let styleClassName = styles.roleConditionsContainer;

  if (data.isInverted === true) {
    styleClassName += " " + styles.inverted;
  }

  return (
    <div className={styleClassName}>
      <p>Full time</p>
      {data.role.location && (
        <p>&nbsp; • &nbsp;{rolelocation_to_string(data.role.location)}</p>
      )}

      {data.role.salary_min && data.role.salary_max ? (
        <p>
          &nbsp; • &nbsp;
          {data.role.salary_min / 1000}-{data.role.salary_max / 1000}K USD/y
        </p>
      ) : (
        <p>Competitive Package</p>
      )}

      {data.role.equity_pct_min && data.role.equity_pct_max && (
        <p>&nbsp; • &nbsp;
          {data.role.equity_pct_min * 100}%-{data.role.equity_pct_max * 100}%
          equity
        </p>
      )}
    </div>
  );
}
