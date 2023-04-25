import bbobHTML from "@bbob/html";
import presetHTML5 from "@bbob/preset-html5";

import styles from "@/styles/Jdcard.module.sass";
import styles_role_detail from "@/styles/Roledetailpage.module.sass";

import customer_config from "@/customer_config.json";

import { Inter, Titillium_Web } from "@next/font/google";
const inter = Inter({ subsets: ["latin"] });

export interface JdCardProps {
  desc: string;
}

export default function JdCard(data: JdCardProps) {
  if (!data.desc) {
    return <p>NOthing</p>;
  }
  let text: string = bbobHTML(data.desc, presetHTML5());

  // Not the most efficient way but it works
  text = text.replaceAll("<h3>", `<h3 class="chapeauDark ${styles.JDTitle}">`);

  return (
    <div className={styles_role_detail.card + " flex-9"}>
      <h2 className={customer_config.fancy ? "body18Bold text_secondary" : "body18Bold text_secondary"}>Job Description</h2>
      <div className={"body16"} dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
}
