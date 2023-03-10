import type { NextApiRequest, NextApiResponse } from "next";
import { getConfig, postMessage, postMessages } from "@/utils";

import {
  Role,
  getDefaultRole,
  RoleLocation,
  Requirement,
  Company,
  getDefaultCompany,
} from "@/bubble_types";

import { fetch_company_by_id } from "../company/[id]";
import { fetch_by_id as fetchRoleLocation } from "./location/[id]";
import { fetch_by_id as fetchRequirement } from "../requirement/[id]";

export async function fetch_pageinated_bubble(
  url: string,
  requestOptions: any
): Promise<any[]> {
  let finals: any[] = [];
  let finished: boolean = false;
  let cursor = 0;

  // Add cursor
  let updated_url = new URL(url);
  let search_params = updated_url.searchParams;
  if (!search_params.has("cursor")) {
    search_params.set("cursor", "0");
    updated_url.search = search_params.toString();
  }

  while (!finished) {
    const response = await fetch(updated_url.toString(), requestOptions);
    if (response.status != 200) {
      postMessage(
        "URGENT: 'fetch_pageinated_bubble' failed with status code " +
          response.status.toString()
      );
    }
    const result = await response.json();
    finals = finals.concat(result.response.results);

    const bubble_count = result.response.count;
    const bubble_remaining = result.response.remaining;

    finished = bubble_remaining == 0 || cursor === 10000;
    cursor = cursor + bubble_count;

    let search_params = updated_url.searchParams;
    search_params.set("cursor", cursor.toString());
    updated_url.search = search_params.toString();
  }
  return finals;
}

export async function fetch_roleIDs_by_companyIDs(
  company_ids: string[],
  key: string
): Promise<string[]> {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer ".concat(key));

  const params = [
    { key: "company", constraint_type: "in", value: company_ids },
    { key: "state", constraint_type: "equals", value: "Live" },
  ];
  var requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const url: string =
    getConfig()["endpoint"] +
    "/obj/role/?constraints=" +
    JSON.stringify(params);
  const temp = await fetch_pageinated_bubble(url, requestOptions);
  const role_ids = temp.map((company: any) => company._id);
  return role_ids;
}

export async function fetch_companies_by_partner(
  partner: string,
  key: string
): Promise<string[]> {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer ".concat(key));

  const params = [
    { key: "via_partner", constraint_type: "equals", value: partner },
  ];
  var requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  var url: string =
    getConfig()["endpoint"] +
    "/obj/company/?constraints=" +
    JSON.stringify(params);
  const temp = await fetch_pageinated_bubble(url, requestOptions);
  const company_ids = temp.map((company: any) => company._id);
  return company_ids;
}

export default async function role_handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.setHeader("Cache-Control", "s-maxage=86400");
  if (!process.env.BUBBLE_API_PRIVATE_KEY) {
    postMessage("URGENT: Could not read bubble api key");
    res.status(500);
    return;
  }

  const company_ids = await fetch_companies_by_partner(
    "ETH_Denver",
    process.env.BUBBLE_API_PRIVATE_KEY
  ); //TODO(scheuclu): make this dynamic

  const role_ids = await fetch_roleIDs_by_companyIDs(
    company_ids,
    process.env.BUBBLE_API_PRIVATE_KEY
  );

  res.status(200).json([company_ids, role_ids]);
}
