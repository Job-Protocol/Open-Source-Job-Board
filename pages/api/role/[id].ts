import type { NextApiRequest, NextApiResponse } from "next";
import { getConfig, postMessage } from "@/utils";

import { Role, getDefaultRole, RoleLocation, Requirement, RoleState, RoleType } from "@/bubble_types";

import { process_single_role_response } from "../role";

var psCache = require('ps-cache');
var cache = new psCache.Cache();




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

  const url: string = getConfig()["endpoint"] + "/obj/role/?constraints=" + JSON.stringify(params);
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
