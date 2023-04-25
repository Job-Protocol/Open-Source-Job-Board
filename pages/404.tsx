// 404.js
import Link from 'next/link'
import Image from "next/image";
import styles from "@/styles/Home.module.sass";

import customer_config from "@/customer_config.json";

import stylesGlobalFormElements from "@/styles/GlobalFormElements.module.sass";

export default function FourOhFour() {
    return <>
        <div className={"page"}>
            <div className={"pageContainer"}>
                <div className={styles.coverImageContainer}>
                    <Image
                        src={customer_config.branding.banner}
                        alt="Header image"
                        fill
                        className={styles.headerImage + " grayscale brightness-50"}
                    />
                    <h1> Test </h1>
                    <div className="flex-col  text-center  items-center  justify-center  w-full  h-full  absolute  top-20  left-0 gap-y-1.5">
                        <h1 className="text-2xl  text-white decoration-4"> Oops. Something went wrong. We can not find the page you are looking for. </h1>
                        <Link href="/" className="text-l text-white underline link_primary">
                            Click here to go back home ...
                        </Link>

                    </div>
                </div>
            </div>
        </div>
    </>
}