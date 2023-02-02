import Head from "next/head";
import Image from 'next/image'
import styles from "@/styles/Home.module.css";
import Joblist from "@/components/overview/joblist";
import Companylist from "@/components/overview/companylist";
import Switch from "react-switch";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [byCompanies, setByCompanies] = useState<boolean>(false);

  function handleChange(val: boolean) {
    setByCompanies(val);
  }

  return (
    <>
      <Head>
        <title>ETH Denver Jobs</title>
        <meta name="description" content="Jobboard for ETHDenver 2023" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/faviconV2.png" />
      </Head>
      <div className={styles.page}>
        <div className={styles.pageContainer}>
          <div className={styles.coverImageContainer}>
            <Image
              src={"/background_eth_3.jpg"}
              alt="Header image"
              fill
              style={{borderBottomLeftRadius: 16, borderBottomRightRadius: 16}}
              objectFit="cover"
            />
          </div>
          <div className={styles.headerContainer}>
            <div className={styles.logoImageContainer}>
              <Image
                  src={"/EDEN22Logo_Black.svg"}
                  alt="Header image"
                  fill
                  //style={{borderRadius: 8}}
                  // objectFit="cover"
                />
            </div>
            <div className={styles.headerTextContainer}>
              <h1 className={styles.h1}>ETH Denver Job Board</h1>
              <h2 className={styles.subTitle}>The best jobs in crypto</h2>
              <div className={styles.headerIconsContainer}>
                <Image
                    src={"/globe.svg"}
                    alt="Globe icon"
                    width={16}
                    height={16}
                    //style={{borderRadius: 8}}
                    // objectFit="cover"
                  />
                  <Image
                    src={"/twitter.svg"}
                    alt="Twitter icon"
                    width={16}
                    height={16}
                    //style={{borderRadius: 8}}
                    // objectFit="cover"
                  />
                  <Image
                    src={"/facebook.svg"}
                    alt="Twitter icon"
                    width={16}
                    height={16}
                    //style={{borderRadius: 8}}
                    // objectFit="cover"
                  />
                  <Image
                    src={"/linkedin-square-colored.svg"}
                    alt="Twitter icon"
                    width={16}
                    height={16}
                    //style={{borderRadius: 8}}
                    // objectFit="cover"
                  />
                  <Image
                    src={"/Discord_Logo_sans_texte 1.svg"}
                    alt="Twitter icon"
                    width={16}
                    height={16}
                    //style={{borderRadius: 8}}
                    // objectFit="cover"
                  />
              </div>
            </div>
          </div>
          
          <div className={styles.filtersContainer}>
            <div className={styles.toggleButton}>
              <div className={styles.toggleOn}>
                Roles
              </div>
              <div className={styles.toggleOff}>
                Companies
              </div>
            </div>
          </div>

        </div>
      </div>
      

      <main className={styles.main}>
        <label>
          {/* <span>Show companies</span> */}
          <Switch
            onChange={handleChange}
            checked={byCompanies}
            offColor="#ff0000"
            onColor="#00ff00"
            uncheckedIcon={<p>Roles</p>}
            checkedIcon={<p>Companies</p>}
            width={200}
          />
          {/* <span>Show roles</span> */}
        </label>
        {!byCompanies && <Joblist />}
        {byCompanies && <Companylist />}
      </main>
    </>
  );
}
