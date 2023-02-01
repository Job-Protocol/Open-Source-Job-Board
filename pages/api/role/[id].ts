import type { NextApiRequest, NextApiResponse } from "next";
import config from "../../../config.json";

import { Role, getDefaultRole, RoleLocation } from "@/bubble_types";

import { fetch_company_by_id } from "../company/[id]";
import { fetch_by_id as fetchRoleLocation } from "./location/[id]";

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

  //fetch role location or set undefined
  const loc: RoleLocation | undefined = result_role.response.location_new
    ? await fetchRoleLocation(result_role.response.location_new as string, key)
    : undefined;

  const r: Role = getDefaultRole();
  r.id = result_role.response._id;
  r.title = result_role.response.title;
  r.desc = result_role.response.job_description;
  r.salary_min = result_role.response.salary_min;
  r.salary_max = result_role.response.salary_max;
  r.equity_pct_min = result_role.response.equity_pct_min;
  r.equity_pct_max = result_role.response.equity_pct_max;
  r.company = result_company;
  r.location = loc;
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
