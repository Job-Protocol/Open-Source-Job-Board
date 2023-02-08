import type { NextApiRequest, NextApiResponse } from "next";
import { getConfig } from "@/utils";

import { Role, getDefaultRole, RoleLocation, Requirement, Company, getDefaultCompany } from "@/bubble_types";

import { fetch_company_by_id } from "../company/[id]";
import { fetch_by_id as fetchRoleLocation } from "./location/[id]";
import { fetch_by_id as fetchRequirement } from "../requirement/[id]";

var psCache = require('ps-cache');
var cache = new psCache.Cache();



export async function fetch_roleIDs_by_companyIDs(company_ids: string[], key: string): Promise<Company> {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer ".concat(key));


  const params = [
    { key: "company", constraint_type: "in", value: company_ids }
  ];
  var requestOptions: RequestInit = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  //const response = await fetch("https://app.jobprotocol.xyz/version-test/api/1.1/obj/company/?constraints=[{ \"key\": \"via_partner\", \"constraint_type\": \"text contains\", \"value\": \"ETH_Denver\" }]", requestOptions);
  const response = await fetch("https://app.jobprotocol.xyz/version-test/api/1.1/obj/role/?constraints=" + JSON.stringify(params), requestOptions);
  const result = await response.json()
  const role_ids = result.response.results.map((company: any) => company._id);
  return role_ids;


}

export async function fetch_companies_by_partner(partner: string, key: string): Promise<string[]> {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer ".concat(key));


  const params = [
    { key: "via_partner", constraint_type: "text contains", value: partner }
  ];
  var requestOptions: RequestInit = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  var url: string = "https://app.jobprotocol.xyz/version-test/api/1.1/obj/company/?constraints=" + JSON.stringify(params);
  const response = await fetch(url, requestOptions);

  const result = await response.json();
  const company_ids = result.response.results.map((company: any) => company._id);

  return company_ids;

}

export default async function role_handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {

  res.setHeader('Cache-Control', 's-maxage=86400');
  if (!process.env.BUBBLE_API_PRIVATE_KEY) {
    res.status(500);
    return;
  }


  const cache_id: string = "all";
  if (false && cache.has(cache_id)) { //TODO(scheuclu): make this dynamic
    res.status(200).json(cache.get(cache_id));
    return;
  }

  const company_ids = await fetch_companies_by_partner("ETH_Denver", process.env.BUBBLE_API_PRIVATE_KEY);//TODO(scheuclu): make this dynamic
  const role_ids = await fetch_roleIDs_by_companyIDs(company_ids, process.env.BUBBLE_API_PRIVATE_KEY);

  cache.set(cache_id, [company_ids, role_ids], { ttl: 1000 * 60 * 60 * 2 });
  res.status(200).json([company_ids, role_ids]);






}
