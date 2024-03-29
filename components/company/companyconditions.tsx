import styles from "@/styles/Roleconditions.module.sass";
import { Company, Role } from "@/bubble_types";
import { rolelocation_to_string } from "@/utils";
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaHome,
  FaUserFriends,
} from "react-icons/fa";

import Link from "next/link";

function valid(s: string | undefined) {
  return s && s != "";
}

export interface Props {
  company: Company;
  isInverted?: boolean;
}

function nb_company_socials(company: Company) {
  let nb_socials = 0;

  if (company.socials != null) {

    if (company.socials.linkedin != null) {
      nb_socials += 1;
    } else if (company.socials.twitter != null) {
      nb_socials += 1;
    } else if (company.socials.website != null) {
      nb_socials += 1;
    }
  }

  return nb_socials;
}

export default function CompanyConditions(data: Props) {
  if (!data.company) {
    return <div></div>;
  }

  let styleClassName = "body14 " + styles.roleConditionsContainer;

  if (data.isInverted === true) {
    styleClassName += " " + "body16 " + styles.inverted;
  }


  return (
    <div className={styleClassName}>
      {data.company.headquarters && <p> {data.company.headquarters} </p>}

      {data.company.headquarters && data.company.num_employees && (
        <p>&nbsp;•&nbsp;</p>
      )}
      {data.company.num_employees && (
        <p>{data.company.num_employees} employees</p>
      )}

      {data.company.founding_year && <p>&nbsp;•&nbsp;</p>}
      {data.company.founding_year && (
        <p>Founded in {data.company.founding_year}</p>
      )}

      {nb_company_socials(data.company) > 0 && <p>&nbsp;•&nbsp;</p>}

      {data.company.socials && data.company.socials.twitter && (
        <Link
          href={data.company.socials.twitter}
          rel="noopener noreferrer"
          target="_blank"
        >
          <FaTwitter />
        </Link>
      )}
      {/* {data.company.socials && data.company.socials.github && (
        <Link
          href={data.company.socials.github}
          rel="noopener noreferrer"
          target="_blank"
        >
          <FaGithub />
        </Link>
      )} */}
      {data.company.socials && data.company.socials.linkedin && (
        <Link
          href={data.company.socials.linkedin}
          rel="noopener noreferrer"
          target="_blank"
        >
          <FaLinkedin />
        </Link>
      )}
    </div>
  );
}
