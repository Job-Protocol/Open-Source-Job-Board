import type { NextApiRequest, NextApiResponse } from "next";
import config from "../../config.json";
import * as http from "http";

type Role = {
  title: string;
  company_name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Role[]>
) {
  if (!process.env.BUBBLE_API_PRIVATE_KEY) {
    res.status(500);
    return;
  }
  var constraints = JSON.stringify([
    { key: "_id", constraint_type: "in", value: config["job-ids"] },
  ]);

  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "Bearer ".concat(process.env.BUBBLE_API_PRIVATE_KEY)
  );
  // var requestOptions = {
  //   method: "GET",
  //   headers: myHeaders,
  //   redirect: "follow",
  // };

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const endpoint = "https://app.jobprotocol.xyz/version-live/api/1.1/obj/role/";
  const url = endpoint + "?constraints=" + constraints;
  fetch(url, requestOptions)
    .then((result) => {
      return result.json();
    })
    .then((p) =>
      p.response.results.map((role: any) => {
        const r: Role = {
          title: role.title,
          company_name: role.company,
        };
        return r;
      })
    )
    .then((r) => res.status(200).json(r))
    .catch((error) => {
      res.status(500);
    });
}
