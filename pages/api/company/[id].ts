import type { NextApiRequest, NextApiResponse } from "next";
import { getConfig } from "@/utils";

import {
  Company,
  CompanySocials,
  getDefaultCompany,
  NamedLink,
} from "@/bubble_types";

import { fetch_by_id as fetchSocials } from "../company_socials/[id]";
import { fetch_by_id as fetchNamedLink } from "../named_link/[id]";

var psCache = require('ps-cache');
var cache = new psCache.Cache();

async function process_single_company_response(response_company: any, key: string): Promise<Company> {
  // Fetch socials, if possible
  const socials: CompanySocials | undefined = response_company.socials
    ? await fetchSocials(response_company.socials, key)
    : undefined;

  // Fetch named links, if possible
  const press_article_links: NamedLink[] | undefined = response_company
    .press_article_links
    ? await Promise.all(
      response_company.press_article_links.map((id: string) =>
        fetchNamedLink(id, key)
      )
    )
    : undefined;

  const comp: Company = getDefaultCompany();
  comp.id = response_company._id;
  comp.name = response_company.Name;
  comp.logo = response_company.Logo;
  comp.headquarters = response_company.headquarters;
  comp.num_employees = response_company.num_employees;
  comp.socials = socials;
  comp.tagline = response_company.tagline;
  comp.press_article_links = press_article_links;
  comp.founding_year = response_company.founding_year;
  comp.slug = response_company.Slug;

  return comp;
}


export async function fetch_company_by_slug(
  slug: string,
  key: string
): Promise<Company> {


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

  const url: string = getConfig()["endpoint"] + "/obj/company/?constraints=" + JSON.stringify(params);
  // const url: string = 'https://app.jobprotocol.xyz/version-test/api/1.1/obj/role/?constraints=[{ "key": "Slug", "constraint_type": "equals", "value": "1inch-eth-denver--software-engineer"}]'
  const response = await fetch(url, requestOptions);
  // console.log("RESPONSE 1", response);
  const result = await response.json()

  const c = await process_single_company_response(result.response.results[0], key);
  return c;


}




export async function fetch_company_by_id(
  id: string,
  key: string
): Promise<Company> {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer ".concat(key));
  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  // Fetch company, if possible
  const url: string = getConfig()["endpoint"] + "/obj/company/" + id;
  const response = await fetch(url, requestOptions);
  const result = await response.json();

  const comp: Company = await process_single_company_response(result.response, key);
  return comp;
}

export default async function company_handler(
  req: NextApiRequest,
  res: NextApiResponse<Company>
) {
  const { id } = req.query;
  res.setHeader('Cache-Control', 's-maxage=86400');

  if (!process.env.BUBBLE_API_PRIVATE_KEY || typeof id !== "string") {
    res.status(500);
    return;
  }


  const cache_id: string = "company_" + id;
  if (cache.has(cache_id)) {
    res.status(200).json(cache.get(cache_id));
    return;
  }
  else {

    if (id.length == 32 && id[13] == 'x') {
      const comp = await fetch_company_by_id(
        id,
        process.env.BUBBLE_API_PRIVATE_KEY
      );
      cache.set(cache_id, comp, { ttl: 1000 * 60 * 2 });
      res.status(200).json(comp);
    }
    else {
      const comp = await fetch_company_by_slug(
        id,
        process.env.BUBBLE_API_PRIVATE_KEY
      );
      cache.set(cache_id, comp, { ttl: 1000 * 60 * 2 });
      res.status(200).json(comp);
    }
  }



}
