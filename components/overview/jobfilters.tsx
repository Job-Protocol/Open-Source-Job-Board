import React, { useState } from "react";
import { useEffect } from "react";

import styles from "@/styles/Jobfilters.module.css";

import SearchBox from "@/components/overview/searchbox";
import { GeographicAddress } from "@/bubble_types";
import Select from "react-select";

async function GetGeographicAddress(s: string): Promise<GeographicAddress> {
  const result = await fetch("/api/places/details/fromstring/" + s);
  const parsed = await result.json();
  return parsed;
}

export default function JobFilters({
  handleChange,
}: {
  handleChange: (
    userAddress: GeographicAddress | undefined,
    remoteOnly: boolean | undefined
  ) => void;
}) {
  const [remoteOnly, setRemoteOnly] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<string>("");
  const [userAddress, setUserAddress] = useState<GeographicAddress | undefined>(
    undefined
  );

  useEffect(() => {
    if (userLocation) {
      GetGeographicAddress(userLocation).then((res) => {
        setUserAddress(res);
      });
    } else {
      setUserAddress(undefined);
    }
  }, [userLocation]);

  useEffect(() => {
    handleChange(userAddress, remoteOnly);
  }, [userAddress, remoteOnly, handleChange]);

  return (
    <div className={styles.row}>
      <div className={styles.roleFilterContainer}>
        Role
        <Select
          options={[
            { value: "chocolate", label: "Chocolate" },
            { value: "strawberry", label: "Strawberry" },
            { value: "vanilla", label: "Vanilla" },
          ]}
          components={{
            IndicatorSeparator: () => null,
          }}
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              borderColor: "#E2E2E2",
              width: "272px",
              borderRadius: "8px",
              boxShadow: "none",
            }),
            placeholder: (baseStyles, state) => ({
              ...baseStyles,
              color: "#1F2534CC",
              fontWeight: 400,
              fontSize: "16px",
            }),
            dropdownIndicator: (baseStyles, state) => ({
              ...baseStyles,
              color: "#05192D",
            }),
          }}
        />
      </div>
      <div className={styles.roleFilterContainer}>
        Location
        <div className={styles.locationInputsContainer}>
          <SearchBox
            handleChange={(val) => {
              setUserLocation(val.value);
            }}
          />
          <label className={styles.label}>
            <input
              type="checkbox"
              onChange={(value) => setRemoteOnly(!remoteOnly)}
            />
            Include Remote
          </label>
        </div>
      </div>
    </div>
  );
}
