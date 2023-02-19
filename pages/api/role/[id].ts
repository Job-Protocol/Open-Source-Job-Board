import type { NextApiRequest, NextApiResponse } from "next";
import { getConfig, postMessage } from "@/utils";

import { Role, getDefaultRole, RoleLocation, Requirement, RoleState, RoleType } from "@/bubble_types";

import { fetch_company_by_id } from "../company/[id]";
import { fetch_by_id as fetchRoleLocation } from "./location/[id]";
import { fetch_by_id as fetchRequirement } from "../requirement/[id]";

var psCache = require('ps-cache');
var cache = new psCache.Cache();


async function process_single_role_response(role_response: any, key: string): Promise<Role> {
  const result_company = await fetch_company_by_id(
    role_response.company,
    process.env.BUBBLE_API_PRIVATE_KEY as string
  );

  //fetch role location or set undefined
  const loc: RoleLocation | undefined = role_response.location_new
    ? await fetchRoleLocation(role_response.location_new as string, key)
    : undefined;

  //fetch role requirement od set undefined
  const reqs: Requirement[] | undefined = role_response.requirements ?
    await Promise.all(role_response.requirements.map((req: string) => fetchRequirement(req as string, key))) :
    undefined;


  const rtype: RoleType | undefined = role_response.type == 'Engineering' ? RoleType.Engineering :
    role_response.type == 'Product' ? RoleType.Product :
      role_response.type == 'Design' ? RoleType.Design :
        role_response.type == 'Marketing' ? RoleType.Marketing :
          role_response.type == 'Sales/BD' ? RoleType.SalesBD :
            role_response.type == 'Operations' ? RoleType.Operations : undefined;


  const r: Role = getDefaultRole();
  r.id = role_response._id;
  r.title = role_response.title;
  r.desc = role_response.job_description;
  r.salary_min = role_response.salary_min;
  r.salary_max = role_response.salary_max;
  r.equity_pct_min = role_response.equity_pct_min;
  r.equity_pct_max = role_response.equity_pct_max;
  r.company = result_company;
  r.location = loc;
  r.requirements = reqs;
  r.state = role_response.state == "Live" ? RoleState.Live : RoleState.Hidden;
  r.type = rtype;
  r.keywords = [r.title, r.company.name]//TODO(scheuclu) Improve this
  r.slug = role_response.Slug ? role_response.Slug : role_response._id;

  return r;
}

export async function fetch_role_by_slug(slug: string, key: string): Promise<Role> {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer ".concat(key));

  const params = [
    { key: "Slug", constraint_type: "equals", value: slug }
  ];
  var requestOptions: RequestInit = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  // console.log("PARAMS", JSON.stringify(params));

  const url: string = getConfig()["endpoint"] + "/obj/role/?constraints=" + JSON.stringify(params);
  // const url: string = 'https://app.jobprotocol.xyz/version-test/api/1.1/obj/role/?constraints=[{ "key": "Slug", "constraint_type": "equals", "value": "1inch-eth-denver--software-engineer"}]'
  const response = await fetch(url, requestOptions);
  const result = await response.json()
  if (result.response.results.length === 0) {
    postMessage("No role found for slug " + slug);
    return getDefaultRole();
  }

  const r = await process_single_role_response(result.response.results[0], key);
  return r;
}


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

  const r = await process_single_role_response(result_role.response, key);

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

    //Decide whether to fetch by slug or by id
    if (id.length === 32 && id[13] === 'x') { //TODO(scheuclu) Improve this (maybe use regex
      const role = await fetch_role_by_id(id, process.env.BUBBLE_API_PRIVATE_KEY);
      cache.set(cache_id, role, { ttl: 1000 * 60 * 2 });
      res.status(200).json(role);
    } else {
      const role = await fetch_role_by_slug(id, process.env.BUBBLE_API_PRIVATE_KEY);
      cache.set(cache_id, role, { ttl: 1000 * 60 * 2 });
      res.status(200).json(role);
    }

  }

}
