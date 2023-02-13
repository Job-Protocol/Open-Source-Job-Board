import React, { useState } from "react";
import { useEffect } from "react";

import styles from "@/styles/Jobfilters.module.css";
import stylesGlobalFormElements from "@/styles/GlobalFormElements.module.css";
import { selectStyles } from "./selectStyles";

import SearchBox from "@/components/overview/searchbox";
import { GeographicAddress, RoleType } from "@/bubble_types";
import Select from "react-select";

export async function GetGeographicAddress(s: string): Promise<GeographicAddress> {
  const result = await fetch("/api/places/details/fromstring/" + s);
  const parsed = await result.json();
  return parsed;
}

export default function JobFilters({
  handleChange,
  isModalOpen,
  closeModalHandler,
}: {
  handleChange: (
    userAddress: GeographicAddress | undefined,
    remoteOnly: boolean | undefined,
    roleType: RoleType | undefined,
    searchterm: string | undefined
  ) => void;
  isModalOpen: boolean;
  closeModalHandler: () => void;
}) {
  // const [openModal, setOpenModal] = useState<boolean>(false);
  const [remoteOnly, setRemoteOnly] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<string>("");
  const [roleType, setRoleType] = useState<RoleType | undefined>(undefined);
  const [userAddress, setUserAddress] = useState<GeographicAddress | undefined>(
    undefined
  );
  const [searchterm, setSearchterm] = useState<string | undefined>(undefined);

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
    handleChange(userAddress, remoteOnly, roleType, searchterm);
  }, [userAddress, remoteOnly, roleType, searchterm, handleChange]);

  return (
    <div
      className={
        isModalOpen
          ? styles.filtersContainerMobileOpen
          : styles.filtersContainerMobileClosed
      }
    >
      <div className={styles.filtersContentContainer}>
        <div className={styles.filtersContentTopContainer}>
          <h3 className={"body18Bold centerText " + styles.showOnlyOnMobile}>
            Set Filters
          </h3>
          <div className={"body16 " + styles.roleFilterContainer}>
            Role
            <Select
              options={[
                { value: undefined, label: "All" },
                { value: RoleType.Design, label: "Design" },
                { value: RoleType.Engineering, label: "Engineering" },
                { value: RoleType.Marketing, label: "Marketing" },
                { value: RoleType.Operations, label: "Operations" },
                { value: RoleType.SalesBD, label: "Sales / BD" },
                { value: RoleType.Product, label: "Product" },
              ]}
              components={{
                IndicatorSeparator: () => null,
              }}
              placeholder="All roles"
              styles={{
                ...selectStyles,
                control: (baseStyles: any, state: any) => ({
                  ...baseStyles,
                  ...selectStyles.control,
                  minWidth: "200px",
                }),
              }}
              classNames={{
                placeholder: (state) => "body16",
                option: (state) => "body16",
              }}
              onChange={(value) => {
                if (value) {
                  setRoleType(value.value);
                }
              }}
            />
          </div>
          <div className={"body16 " + styles.roleFilterContainer}>
            <div className={styles.locationFilterContainer}>
              Location
              <div className={styles.locationInputsContainer}>
                <SearchBox
                  id="searchbox-location"
                  disabled={remoteOnly}
                  handleChange={(val) => {
                    setUserLocation(val.value);
                  }}
                />
              </div>
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
        <button
          type="submit"
          className={
            stylesGlobalFormElements.primaryButton +
            " " +
            styles.showOnlyOnMobile +
            " " +
            styles.submitButtonMobile
          }
          name="set-filters-button"
          // style="default"
          onClick={closeModalHandler}
          id="set-filters-button"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
