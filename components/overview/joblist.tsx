import React, { useState } from "react";
import { useEffect } from "react";

import styles from "@/styles/Home.module.css";
import JobCard from "@/components/role/jobcard";
import { JobCardProps } from "@/components/role/jobcard";

import { addressstring_to_type } from "@/utils";
import config from "../../config.json";

import SearchBox from "@/components/overview/searchbox";

import { GeographicAddress, Role, RoleLocation, RoleLocationType, TimezoneRange } from "@/bubble_types";

async function GetRoleData(): Promise<Role[]> {
  const results = config["dev"]["job-ids"].map(async (roleid) => {
    const result = await fetch("/api/role/" + roleid);
    const parsed = await result.json();
    return parsed;
  });
  const role_data = await Promise.all(results);
  return role_data;
};

async function GetGeographicAddress(s: string): Promise<GeographicAddress> {
  const result = await fetch("/api/places/details/fromstring/" + s);
  const parsed = await result.json();
  console.log("PARSED", parsed);
  return parsed;
};

export default function Joblist() {
  const [userLocation, setUserLocation] = useState<string>("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [userAddress, setUserAddress] = useState<GeographicAddress | undefined>(undefined);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);

  useEffect(() => {
    GetRoleData().then((res) => {
      setRoles(res); setFilteredRoles(res);
    });
  }, []);

  useEffect(() => {
    if (userLocation) {
      GetGeographicAddress(userLocation).then((res) => {
        setUserAddress(res);
      });
    }
  }, [userLocation]);

  //filter the roles based on the user's address
  useEffect(() => {
    function hasCountry(country: string, location_list: GeographicAddress[]) {
      return location_list.map(addr => addr.country).includes(country);
    }
    function hasCity(city: string, location_list: GeographicAddress[]) {
      return location_list.map(addr => addr.city).includes(city);
    }
    function addressMatches(location: GeographicAddress, role_addresses: GeographicAddress[]) {
      return (location.country && hasCountry(location.country, role_addresses)) ||
        (location.city && hasCity(location.city, role_addresses));
    }

    function timezoneMatches(utc_offset: number | undefined, timezone_range: TimezoneRange | undefined) {
      if (!timezone_range) {
        return false;
      }
      if (!utc_offset) {
        return false;
      }
      return utc_offset >= timezone_range.min && utc_offset <= timezone_range.max;
    }

    if (userAddress) {
      roles.forEach((element) => {
        console.log("ELEMENT", element.location);
      });

      setFilteredRoles(roles.filter((role: Role) => {
        const role_addresses: GeographicAddress[] = role.location?.location_list ? role.location.location_list : [];
        return role.location?.location_type === RoleLocationType.Remote ||
          (role.location?.location_type === RoleLocationType.LocationList && addressMatches(userAddress, role_addresses)) ||
          (role.location?.location_type === RoleLocationType.TimezoneRange && timezoneMatches(userAddress.utc_offset, role.location.timezone_range))
      }));
    }
  }, [userAddress, roles]);

  return (
    <div className={styles.grid}>
      <label className={styles.label}>
        Filter Location: {JSON.stringify(userAddress)}
      </label>
      <SearchBox
        handleChange={(v: any) => {
          setUserLocation(v.value as string);
        }}
      />
      {filteredRoles.map((role) => (
        <JobCard role={role} key={role.id} />
      ))}
    </div>
  );
}
