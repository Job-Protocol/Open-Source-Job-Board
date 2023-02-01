import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import styles from "@/styles/Companycard.module.css";
import { Company } from "@/bubble_types";

export interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard(data: CompanyCardProps) {
  if (!data.company) {
    return <p>NOthing</p>;
  }

  function valid(s: string) {
    return s && s != "";
  }
  return (
    <div className={styles.card}>
      <h3>About {data.company.name}</h3>
      <h4>Mission</h4>
      <p>{data.company.tagline}</p>

      <h4>About</h4>
      <p>{data.company.name} employees</p>
      <p>{data.company.name} headquarters</p>

      <h4>Socials</h4>
      <div className={styles.social}>
        {valid(data.company.socials.twitter) && (
          <a href={data.company.socials.twitter}>
            <FaTwitter />
          </a>
        )}
        {valid(data.company.socials.github) && (
          <a href={data.company.socials.github}>
            <FaGithub />
          </a>
        )}
        {valid(data.company.socials.linkedin) && (
          <a href={data.company.socials.linkedin}>
            <FaLinkedin />
          </a>
        )}
      </div>

      <h4>Press</h4>
      <div className={styles.column}>
        {data.company.press_article_links.map((link) => (
          <a href={link.link} key={link.name}>
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
}
