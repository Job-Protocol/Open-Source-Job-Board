import type { NextApiRequest, NextApiResponse } from "next";
import config from "../../../config.json";

import { Role, getDefaultRole } from "@/bubble_types";

import { fetch_company_by_id } from "../company/[id]";

export async function fetch_role_by_id(id: string, key: string): Promise<Role> {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer ".concat(key));
  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const url_role: string = config["dev"]["endpoint"] + "/obj/role/" + id;
  const response_role = await fetch(url_role, requestOptions);
  const result_role = await response_role.json();

  const result_company = await fetch_company_by_id(
    result_role.response.company,
    process.env.BUBBLE_API_PRIVATE_KEY as string
  );

  const r: Role = getDefaultRole();
  r.id = result_role.response._id;
  r.title = result_role.response.title;
  r.desc = result_role.response.job_description;
  r.company = result_company;
  return r;
}

export default async function role_handler(
  req: NextApiRequest,
  res: NextApiResponse<Role>
) {
  const { id } = req.query;

  if (!process.env.BUBBLE_API_PRIVATE_KEY || typeof id !== "string") {
    res.status(500);
    return;
  }
  const role = await fetch_role_by_id(id, process.env.BUBBLE_API_PRIVATE_KEY);
  res.status(200).json(role);
}
