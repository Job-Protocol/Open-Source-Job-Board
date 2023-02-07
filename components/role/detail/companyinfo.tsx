import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaHome,
  FaUserFriends,
} from "react-icons/fa";
import styles from "@/styles/Companyinfo.module.css";
import { Company } from "@/bubble_types";

import Image from "next/image";

export interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard(data: CompanyCardProps) {
  if (!data.company) {
    return <p>Nothing</p>;
  }

  function valid(s: string | undefined) {
    return s && s != "";
  }
  return (
    <div className={styles.card}>
      <h3 className={styles.companyAboutTitle}>About {data.company.name}</h3>
      <div className={styles.section}>
        <h4 className={styles.companyCardSubtitle}>MISSION</h4>
        <p className={styles.companyCardBody}>{data.company.tagline}</p>
      </div>

      <div className={styles.section}>
        <h4 className={styles.companyCardSubtitle}>ABOUT</h4>
        <div className={styles.aboutItem}>
          <FaUserFriends />
          <p>{data.company.num_employees} employees</p>
        </div>

        <div className={styles.aboutItem}>
          <FaHome />
          <p>{data.company.headquarters}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.companyCardSubtitle}>SOCIALS</h4>
        <div className={styles.socials}>
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
      </div>

      <div className={styles.section}>
        <h4 className={styles.companyCardSubtitle}>PRESS</h4>
        <div className={styles.pressLinksContainer}>
          {data.company.press_article_links &&
            data.company.press_article_links.map((link) => (
              <a
                className={styles.pressLink}
                href={link.link}
                key={link.display_name}
              >
                {link.display_name}
                <Image src={"/external_link.svg"} width={16} height={16} alt="external link" />
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}
