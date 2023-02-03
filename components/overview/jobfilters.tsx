import React, { useState } from "react";
import { useEffect } from "react";

import styles from "@/styles/Home.module.css";
import CompanyCard from "../company/companycard";

import config from "../../config.json";


import SearchBox from "@/components/overview/searchbox";
import { GeographicAddress } from "@/bubble_types";

async function GetGeographicAddress(s: string): Promise<GeographicAddress> {
    const result = await fetch("/api/places/details/fromstring/" + s);
    const parsed = await result.json();
    return parsed;
};

export default function JobFilters({
    handleChange,
}: {
    handleChange: (userAddress: GeographicAddress | undefined, remoteOnly: boolean | undefined) => void;
}) {
    const [remoteOnly, setRemoteOnly] = useState<boolean>(false);
    const [userLocation, setUserLocation] = useState<string>("");
    const [userAddress, setUserAddress] = useState<GeographicAddress | undefined>(undefined);

    useEffect(() => {
        if (userLocation) {
            GetGeographicAddress(userLocation).then((res) => {
                setUserAddress(res);
            });
        }
        else {
            setUserAddress(undefined);
        }
    }, [userLocation]);


    useEffect(() => {
        handleChange(userAddress, remoteOnly);
    }, [userAddress, remoteOnly, handleChange]);


    return (
        <div>

            <label className={styles.label}>
                Show remote jobs only<input type="checkbox" onChange={value => setRemoteOnly(!remoteOnly)} />
            </label>
            <SearchBox handleChange={(val) => { setUserLocation(val.value); }} />
        </div>
    );
}
