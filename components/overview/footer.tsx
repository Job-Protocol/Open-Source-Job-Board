import React from "react";
import styles from "@/styles/Footer.module.css";

import Link from "next/link";

import Image from "next/image";

export default function Footer() {
  return (
    <div className={"body14 " + styles.footerPoweredBy}>
      <svg
        width="12"
        height="15"
        viewBox="0 0 12 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.4505 5.80674C11.3905 5.69159 11.2988 5.59481 11.1855 5.52701C11.0722 5.45921 10.9417 5.42308 10.8085 5.42273H7.2029V1.23322C7.21063 1.08009 7.16608 0.928706 7.07613 0.802572C6.98619 0.676324 6.85592 0.582341 6.70525 0.535C6.56049 0.488825 6.40426 0.488359 6.25913 0.53348C6.11401 0.578601 5.98749 0.667209 5.89755 0.786323L0.1281 8.46719C0.0559041 8.56831 0.0124393 8.68614 0.00229869 8.80876C-0.00784258 8.93138 0.0156996 9.05447 0.0703902 9.1654C0.120855 9.29235 0.208508 9.40223 0.322476 9.48159C0.436446 9.56096 0.572026 9.60644 0.712308 9.61228H4.31825V13.8018C4.31837 13.9491 4.36642 14.0925 4.45588 14.2116C4.54523 14.3307 4.67115 14.4195 4.8158 14.4652C4.88824 14.4869 4.96345 14.4986 5.03939 14.5C5.27011 14.5006 5.4873 14.3942 5.62348 14.2137L11.3929 6.53285C11.4706 6.42858 11.517 6.30585 11.5273 6.17773C11.5374 6.04961 11.5107 5.92128 11.4505 5.80674Z"
          fill="#EE4C83"
        />
      </svg>
      {/* Powered by
      <Image src={"/Opolis_textonly.svg"} width={90} height={50} alt="Opolis" />
      &
      <Image src={"/JP_black.svg"} width={120} height={50} alt="Opolis" /> */}
      <div className={styles.footerLinks}>
        Created using JobProtocol&apos;s{" "}
        <Link
          className="link"
          href="https://jobprotocol.xyz"
          target="_blank"
          rel="noreferrer"
        >
          Open Source Job Board
        </Link>
      </div>
    </div>
  );
}
