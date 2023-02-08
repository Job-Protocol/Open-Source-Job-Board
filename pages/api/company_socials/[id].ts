import type { NextApiRequest, NextApiResponse } from "next";
import config from "../../../config.json";
import { getConfig } from "@/utils";

import { CompanySocials, getDefaultCompanySocials } from "@/bubble_types";

var psCache = require('ps-cache');
var cache = new psCache.Cache();


export async function fetch_by_id(
  id: string,
  key: string
): Promise<CompanySocials> {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer ".concat(key));
  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const url: string = getConfig()["endpoint"] + "/obj/companysocials/" + id;
  const response = await fetch(url, requestOptions);
  const result = await response.json();

  const res: CompanySocials = getDefaultCompanySocials();
  res.id = result.response._id;
  res.github = result.response.github;
  return res;
}

export default async function company_handler(
  req: NextApiRequest,
  res: NextApiResponse<CompanySocials>
) {
  const { id } = req.query;

  if (!process.env.BUBBLE_API_PRIVATE_KEY || typeof id !== "string") {
    res.status(500);
    return;
  }

  const cache_id: string = "company_socials_" + id;
  if (cache.has(cache_id)) {
    res.status(200).json(cache.get(cache_id));
    return;
  }
  else {
    const role = await fetch_by_id(id, process.env.BUBBLE_API_PRIVATE_KEY);
    cache.set(cache_id, role, { ttl: 1000 * 60 * 2 });
    res.status(200).json(role);
  }
}
