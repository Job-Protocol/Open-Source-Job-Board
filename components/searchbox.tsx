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
    "https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyDvuBJf2DyYDzM_vgjL_r2eYr9H0At_H5M&input=" +
    s;
  const response = await fetch(url);
  console.log("RESPONSE", response);
  const result = await response.json();
  console.log("RESULT", result);
  const final = result.predictions.map((r: any) => {
    return { label: r.description, value: r.description };
  });
  console.log("FINAL", final);
  return final;
}

export default function SearchBox() {
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

  console.log("OPTIONS", options);

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
      // onChange={(value) => console.log("Change", value)} //actually make selection
      // onKeyDown={(value) => console.log("new", value)}
      onInputChange={(value) => setUserInput(value)}
    />
  );
}
