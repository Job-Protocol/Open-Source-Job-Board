import React from "react";
import { useState, useEffect } from "react";

import Select from "react-select";

async function getOptions(s: string) {
  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "Bearer " + process.env.BUBBLE_API_PRIVATE_KEY
  );
  myHeaders.append("Content-Type", "application/json");

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const url: string =
    "https://cors-anywhere.herokuapp.com/" +
    "https://maps.googleapis.com/maps/api/place/autocomplete/json?key=" +
    process.env.GOOGLE_API_KEY +
    "&input=" +
    s;
  const response = await fetch(url);
  const result = await response.json();
  const final = result.predictions.map((r: any) => {
    return { label: r.description, value: r.description };
  });
  return final;
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
      className="basic-single"
      classNamePrefix="select"
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
        setUserInput(value);
      }}
    />
  );
}

// TODO comparing the 2 will actually be a fairly complicated endavor
// We probalby need to compare the address components:
// https://maps.googleapis.com/maps/api/geocode/json?place_id=<GOOGLE API KEY>
// https://maps.googleapis.com/maps/api/geocode/json?place_id=<GOOGLE API KEY>
