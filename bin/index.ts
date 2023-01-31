import type { NextApiRequest, NextApiResponse } from "next";
import config from "../config.json";
import * as http from "http";
import { resourceLimits } from "worker_threads";
import { fetch_company_by_id } from "../pages/api/company/[id]";

async function GetCompany(id: string, key: string) {
  let result = await fetch_company_by_id(id, key);
  return result;
}

type Role = {
  title: string;
  company_name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Role[]>
) {
  if (!process.env.BUBBLE_API_PRIVATE_KEY) {
    res.status(500);
    return;
  }
  var constraints = JSON.stringify([
    { key: "_id", constraint_type: "in", value: config["dev"]["job-ids"] },
  ]);

  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "Bearer ".concat(process.env.BUBBLE_API_PRIVATE_KEY)
  );

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const endpoint = config["dev"]["endpoint"] + "/obj/role/";
  const url = endpoint + "?constraints=" + constraints;

  const response = await fetch(url, requestOptions);
  const result = await response.json();

  const roles: Role[] = result.response.results.map((role: any) => {
    // role.company(id) -> name
    // api/company/[id]

    let name: any;
    const fucntion = async () => {
      const comp_info = await fetch_company_by_id(
        role.company,
        process.env.BUBBLE_API_PRIVATE_KEY as string
      );

      name = comp_info.name;
    };
    fucntion();
    const r: Role = { title: role.title, company_name: name };
    return r;
  });

  res.status(200).json(roles);
}
