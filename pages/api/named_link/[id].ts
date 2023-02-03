import type { NextApiRequest, NextApiResponse } from "next";
import config from "../../../config.json";

import { NamedLink, getDefaultNamedLink } from "@/bubble_types";

var psCache = require('ps-cache');
var cache = new psCache.Cache();

export async function fetch_by_id(id: string, key: string): Promise<NamedLink> {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer ".concat(key));
  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const url: string = config["dev"]["endpoint"] + "/obj/namedlink/" + id;
  const response = await fetch(url, requestOptions);
  const result = await response.json();

  const res: NamedLink = getDefaultNamedLink();
  res.display_name = result.response.display_name;
  res.link = result.response.link;
  return res;
}

export default async function company_handler(
  req: NextApiRequest,
  res: NextApiResponse<NamedLink>
) {
  const { id } = req.query;


  if (!process.env.BUBBLE_API_PRIVATE_KEY || typeof id !== "string") {
    res.status(500);
    return;
  }


  const cache_id: string = "named_link_" + id;
  if (cache.has(cache_id)) {
    res.status(200).json(cache.get(cache_id));
    return;
  }
  else {
    const role = await fetch_by_id(id, process.env.BUBBLE_API_PRIVATE_KEY);
    cache.set(cache_id, role, { ttl: 1000 * 60 * 60 * 2 });
    res.status(200).json(role);
  }
}
