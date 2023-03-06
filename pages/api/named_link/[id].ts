import type { NextApiRequest, NextApiResponse } from "next";
import { getConfig } from "@/utils";
import { postMessage } from "@/utils";
import { NamedLink, getDefaultNamedLink } from "@/bubble_types";

export async function fetch_by_id(id: string, key: string): Promise<NamedLink> {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer ".concat(key));
  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const url: string = getConfig()["endpoint"] + "/obj/namedlink/" + id;
  const response = await fetch(url, requestOptions);
  if (response.status != 200) {
    postMessage("URGENT: 'fetch_by_id' for named link failed with status code " + response.status.toString());
  }
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
  const role = await fetch_by_id(id, process.env.BUBBLE_API_PRIVATE_KEY);
  res.status(200).json(role);

}
