import React from "react";
import styles from "@/styles/Searchbox.module.css";
import { useState, useEffect } from "react";

import Select from "react-select";

async function getOptions(s: string) {
  const url: string = "../api/complete?s=" + s;
  const response = await fetch(url);
  const result = await response.json();
  return result;
}

export default function SearchBox({
  handleChange,
}: {
  handleChange: (v: string) => void;
}) {
  const [options, setOptions] = useState<any[]>([{}]);
  const [userInput, setUserInput] = useState<string>("A");

  useEffect(() => {
    getOptions(userInput).then((res) => {
      setOptions(res);
    });
  }, [userInput]);

  if (!options) {
    return <p> Loading... </p>;
  }

  return (
    <Select
      // Doing it inline to make sure it doesn't get overwritten...
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          borderRadius: '32px',
        }),
      }}
      // classNames={{
      //   control: (state) => styles.select__control,
      //   valueContainer: (state) => styles.select__valueContainer,
      //   container: (state) => styles.select__container,
      //   input: (state) => styles.select__input
      // }}
      // classNamePrefix="select"
      defaultValue="blue"
      isDisabled={false}
      isLoading={false}
      isClearable={false}
      isRtl={false}
      isSearchable={true}
      name="color"
      options={options}
      onChange={(value) => {
        handleChange(value as string);
      }} //actually make selection
      // onKeyDown={(value) => console.log("new", value)}
      onInputChange={(value) => {
        setTimeout(function () {
          setUserInput(value);
        }, 1000);
      }}
      components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
    />
  );
}

// TODO comparing the 2 will actually be a fairly complicated endavor
// We probalby need to compare the address components:
// https://maps.googleapis.com/maps/api/geocode/json?place_id=<GOOGLE API KEY>
// https://maps.googleapis.com/maps/api/geocode/json?place_id=<GOOGLE API KEY>
