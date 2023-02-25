import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaHome,
  FaUserFriends,
} from "react-icons/fa";
import styles from "@/styles/Companyinfo.module.sass";
import styles_role_detail from "@/styles/Roledetailpage.module.sass";
import { Company } from "@/bubble_types";

import Image from "next/image";
import Link from "next/link";

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
    <div className={styles_role_detail.card + " " + styles.gap24}>
      <h3 className={"body18Bold"}>About {data.company.name}</h3>

      {data.company.mission && <div className={styles.section}>
        <h4 className={"chapeauDark"}>Mission</h4>
        <p className={"body16"}>{data.company.mission}</p>
      </div>
      }

      {(data.company.num_employees || data.company.headquarters) && (
        <div className={styles.section}>
          <h4 className={"chapeauDark"}>About</h4>
          <div className={styles.aboutItems}>
            <div className={"body16 " + styles.aboutItem}>
              <FaUserFriends />
              <p>{data.company.num_employees} employees</p>
            </div>

            <div className={"body16 " + styles.aboutItem}>
              <FaHome />
              <p>{data.company.headquarters}</p>
            </div>
          </div>
        </div>
      )}

      {data.company.socials && (data.company.socials.linkedin || data.company.socials.twitter) && (
        <div className={styles.section}>
          <h4 className={"chapeauDark"}>Socials</h4>
          <div className={styles.socials}>
            {data.company.socials && data.company.socials.twitter && (
              <Link href={data.company.socials.twitter}>
                <FaTwitter />
              </Link>
            )}
            {data.company.socials && data.company.socials.linkedin && (
              <Link href={data.company.socials.linkedin}>
                <FaLinkedin />
              </Link>
            )}
          </div>
        </div>
      )}

      {data.company.press_article_links && (
        <div className={styles.section}>
          <h4 className={"chapeauDark"}>Press</h4>
          <div className={styles.pressLinksContainer}>
            {data.company.press_article_links &&
              data.company.press_article_links.map((link) => (
                <a
                  className={"body16 " + styles.pressLink}
                  href={link.link}
                  key={link.display_name}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>
                    {link.display_name}
                    <Image
                      src={"/external_link.svg"}
                      className={styles.pressLinkIcon}
                      width={16}
                      height={16}
                      alt="external link"
                    />
                  </span>
                </a>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
