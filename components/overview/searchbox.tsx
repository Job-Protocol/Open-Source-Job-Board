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
  handleChange: (v: any) => void;
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
    <div>
      <Select
        className="basic-single"
        classNamePrefix="select"
        defaultValue="blue"
        isDisabled={false}
        isLoading={false}
        isClearable={false}
        isRtl={false}
        isSearchable={true}
        name="color"
        value={userInput}
        options={options}
        onChange={(value) => {
          handleChange(!value ? "" : value as string);
        }} //actually make selection
        // onKeyDown={(value) => console.log("new", value)}
        onInputChange={(value) => {
          setTimeout(function () {
            setUserInput(value);
          }, 1000);
        }}
      />
      <p> User input {userInput}</p>
      <button
        type="submit"

        name="button-1675001572178"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={val => { setUserInput(""), console.log("CHANGE handled"); handleChange("London") }}
        id="button-clear">
        clear selection
      </button>
    </div>

  );
}