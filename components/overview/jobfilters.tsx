import React, { useState } from "react";
import { useEffect } from "react";

import styles from "@/styles/Jobfilters.module.css";
import { selectStyles } from "./selectStyles";

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
      <div className={"body16 " + styles.roleFilterContainer}>
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
          placeholder="All roles"
          styles={selectStyles}
          classNames={{
            placeholder: (state) => "body16",
            option: (state) => "body16",
          }}
        />
      </div>
      <div className={"body16 " + styles.roleFilterContainer}>
        Location
        <div className={styles.locationInputsContainer}>
          <SearchBox
            disabled={remoteOnly}
            handleChange={(val) => {
              setUserLocation(val.value);
            }}
          />
          <div className={"body16 " + styles.includeRemoteContainer}>
            <input
              className={styles.inputCheckbox}
              type="checkbox"
              onChange={(value) => setRemoteOnly(!remoteOnly)}
            />
            Remote Only
          </div>
        </div>
      </div>
    </div>
  );
}
