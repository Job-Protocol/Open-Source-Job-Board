import React from "react";
import styles from "@/styles/Searchbox.module.css";
import { useState, useEffect } from "react";

import Select from "react-select";

import { selectStyles } from "./selectStyles";

async function getOptions(s: string) {
  const url: string = "../api/complete?s=" + s;
  const response = await fetch(url);
  const result = await response.json();
  return result;
}

export interface Props {
  handleChange: (v: any) => void;
  disabled: boolean;
  id: string;
}

export default function SearchBox(data: Props) {
  const [options, setOptions] = useState<any[]>([{}]);
  const [userInput, setUserInput] = useState<string>("A");
  const [selectedValue, setSelectedValue] = useState<string>("");

  useEffect(() => {
    getOptions(userInput).then((res) => {
      setOptions(res);
    });
  }, [userInput]);

  if (!options) {
    return <p> Loading... </p>;
  }

  return (
    // <div className={stylesGlobalFormElements.input}>
    <Select
      // className="basic-single"
      // classNamePrefix="select"
      id={data.id}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
      }}
      styles={{
        ...selectStyles,
        control: (baseStyles, state) => ({
          ...selectStyles.control(baseStyles, state),
          cursor: "text",
          minWidth: "300px",
        }),
      }}
      classNames={{
        placeholder: (state) => "body16",
        option: (state) => "body16",
      }}
      placeholder="Enter a location..."
      defaultValue="blue"
      isDisabled={data.disabled}
      isLoading={false}
      isClearable={true}
      isRtl={false}
      isSearchable={true}
      value={selectedValue}
      options={options}
      onChange={(value) => {
        data.handleChange(!value ? "" : (value as string));
        setSelectedValue(value as string);
      }} //actually make selection
      onFocus={() => { setSelectedValue(""); data.handleChange(""); }}
      onInputChange={(value) => {
        console.log("onInputChange");
        setTimeout(function () {
          setUserInput(value);
        }, 1000);
      }}
    />
    // </div>
  );
}

/* <p> User input {userInput}</p>
      <button
        type="submit"

        name="button-1675001572178"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={val => { setUserInput(""), console.log("CHANGE handled"); handleChange("London") }}
        id="button-clear">
        clear selection
      </button> */
