import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaHome,
  FaUserFriends,
} from "react-icons/fa";
import styles from "@/styles/Companycard.module.css";
import { Company } from "@/bubble_types";

export interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard(data: CompanyCardProps) {
  if (!data.company) {
    return <p>NOthing</p>;
  }

  function valid(s: string | undefined) {
    return s && s != "";
  }
  return (
    <div className={styles.card}>
      <h3>About {data.company.name}</h3>
      <h4>Mission</h4>
      <p>{data.company.tagline}</p>

      <h4>About</h4>
      <div className={styles.social}>
        <FaUserFriends />
        <p>{data.company.num_employees} employees</p>
      </div>

      <div className={styles.social}>
        <FaHome />
        <p>{data.company.headquarters}</p>
      </div>

      <h4>Socials</h4>
      <div className={styles.social}>
        {data.company.socials && valid(data.company.socials.twitter) && (
          <a href={data.company.socials.twitter}>
            <FaTwitter />
          </a>
        )}
        {data.company.socials && valid(data.company.socials.github) && (
          <a href={data.company.socials.github}>
            <FaGithub />
          </a>
        )}
        {data.company.socials && valid(data.company.socials.linkedin) && (
          <a href={data.company.socials.linkedin}>
            <FaLinkedin />
          </a>
        )}
      </div>

      <h4>Press</h4>
      <div className={styles.column}>
        {data.company.press_article_links &&
          data.company.press_article_links.map((link) => (
            <a href={link.link} key={link.display_name}>
              {link.display_name}
            </a>
          ))}
      </div>
    </div>
  );
}
