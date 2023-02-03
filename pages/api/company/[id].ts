import type { NextApiRequest, NextApiResponse } from "next";
import config from "../../../config.json";

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
  const url: string = config["dev"]["endpoint"] + "/obj/company/" + id;
  const response = await fetch(url, requestOptions);
  const result = await response.json();

  // Fetch socials, if possible
  const socials: CompanySocials | undefined = result.response.socials
    ? await fetchSocials(result.response.socials, key)
    : undefined;

  // Fetch named links, if possible
  const press_article_links: NamedLink[] | undefined = result.response
    .press_article_links
    ? await Promise.all(
      result.response.press_article_links.map((id: string) =>
        fetchNamedLink(id, key)
      )
    )
    : undefined;

  const comp: Company = getDefaultCompany();
  comp.id = result.response._id;
  comp.name = result.response.Name;
  comp.logo = result.response.Logo;
  comp.headquarters = result.response.headquarters;
  comp.num_employees = result.response.num_employees;
  comp.socials = socials;
  comp.tagline = result.response.tagline;
  comp.press_article_links = press_article_links;
  comp.founding_year = result.response.founding_year;
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
    const role = await fetch_company_by_id(
      id,
      process.env.BUBBLE_API_PRIVATE_KEY
    );
    cache.set(cache_id, role, { ttl: cache.D.THIRTY_MINUTES });
    res.status(200).json(role);
  }



}
