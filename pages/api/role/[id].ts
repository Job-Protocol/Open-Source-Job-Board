import type { NextApiRequest, NextApiResponse } from "next";
import { getConfig } from "@/utils";

import { Role, getDefaultRole, RoleLocation, Requirement, RoleState, RoleType } from "@/bubble_types";

import { fetch_company_by_id } from "../company/[id]";
import { fetch_by_id as fetchRoleLocation } from "./location/[id]";
import { fetch_by_id as fetchRequirement } from "../requirement/[id]";

var psCache = require('ps-cache');
var cache = new psCache.Cache();

export async function fetch_role_by_id(id: string, key: string): Promise<Role> {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer ".concat(key));
  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const url_role: string = getConfig()["endpoint"] + "/obj/role/" + id;
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

  //fetch role requirement od set undefined
  const reqs: Requirement[] | undefined = result_role.response.requirements ?
    await Promise.all(result_role.response.requirements.map((req: string) => fetchRequirement(req as string, key))) :
    undefined;

  const rtype: RoleType | undefined = result_role.response.role_type ?
    result_role.response.role_type == 'Egineering' ? RoleType.Engineering :
      result_role.response.role_type == 'Product' ? RoleType.Product :
        result_role.response.role_type == 'Design' ? RoleType.Design :
          result_role.response.role_type == 'Marketing' ? RoleType.Marketing :
            result_role.response.role_type == 'Sales/BD' ? RoleType.SalesBD :
              result_role.response.role_type == 'Operations' ? RoleType.Operations : undefined
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
  r.requirements = reqs;
  r.state = result_role.response.state == "Live" ? RoleState.Live : RoleState.Hidden;
  r.type = rtype;
  r.keywords = [r.title, r.company.name]//TODO(scheuclu) Improve this

  return r;
}

export default async function role_handler(
  req: NextApiRequest,
  res: NextApiResponse<Role>
) {
  const { id } = req.query;
  res.setHeader('Cache-Control', 's-maxage=86400');
  if (!process.env.BUBBLE_API_PRIVATE_KEY || typeof id !== "string") {
    res.status(500);
    return;
  }


  const cache_id: string = "role_" + id;
  if (cache.has(cache_id)) {
    res.status(200).json(cache.get(cache_id));
    return;
  }
  else {
    const role = await fetch_role_by_id(id, process.env.BUBBLE_API_PRIVATE_KEY);
    cache.set(cache_id, role, { ttl: 1000 * 60 * 2 });
    res.status(200).json(role);
  }

}
