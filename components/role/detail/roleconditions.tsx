import styles from "@/styles/Roleconditions.module.sass";
import { Role } from "@/bubble_types";
import { rolelocation_to_string } from "@/utils";

export interface RoleConditionsProps {
  role: Role;
  isInverted?: boolean;
  showBounty: boolean;
}

export default function RoleConditions(data: RoleConditionsProps) {
  if (!data.role) {
    return <div></div>;
  }

  let styleClassName = "body14 " + styles.roleConditionsContainer;

  if (data.isInverted === true) {
    styleClassName += " " + "body16 " + styles.inverted;
  }


  return (
    <div className={styleClassName}>
      <p>Full time</p>

      {data.role.location && data.role.location.location_type != undefined && (<p>&nbsp; • &nbsp;</p>)}
      {data.role.location && data.role.location.location_type != undefined && (<p> {rolelocation_to_string(data.role.location)}</p>)}

      <p>&nbsp; • &nbsp;</p>
      {
        data.role.salary_min && data.role.salary_max ? (
          <p>{data.role.salary_min / 1000}-{data.role.salary_max / 1000}K USD/y</p>
        ) : (
          <p>Competitive Package</p>
        )
      }

      {data.role.equity_pct_min && data.role.equity_pct_max && (<p>&nbsp; • &nbsp;</p>)}
      {
        data.role.equity_pct_min && data.role.equity_pct_max && (
          <p>
            {data.role.equity_pct_min * 100}%-{data.role.equity_pct_max * 100}%
            equity
          </p>
        )
      }

      {data.showBounty && data.role.bounty && (<p>&nbsp; • &nbsp;</p>)}
      {
        data.showBounty && data.role.bounty && (
          <p>
            {data.role.bounty / 1000}K USD&nbsp;
            bounty
          </p>
        )
      }
    </div >
  );
}
