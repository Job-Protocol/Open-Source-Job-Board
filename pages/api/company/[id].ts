import type { NextApiRequest, NextApiResponse } from "next";
import { getConfig } from "@/utils";
import { postMessage } from "@/utils";

import {
  Company,
} from "@/bubble_types";

import { process_single_company_response } from "../company";
import { StringDecoder } from "string_decoder";


export async function fetch_company_by_slug(
  slug: string,
  key: string
): Promise<Company | null> {


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

  const url: string = getConfig()["endpoint"] + "/obj/company/?constraints=" + JSON.stringify(params);
  const response = await fetch(url, requestOptions);
  if (response.status != 200) {
    postMessage("URGENT: 'fetch_company_by_slug' failed with status code " + response.status.toString());
  }
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
  if (response.status != 200) {
    postMessage("URGENT: 'fetch_company_by_id' failed with status code " + response.status.toString());
  }
  const result = await response.json();

  const comp: Company = await process_single_company_response(result.response, key);
  return comp;
}

export async function fetch_company_by_slug_or_id(slug_or_id: string): Promise<Company | null> {


  if (slug_or_id.length == 32 && slug_or_id[13] == 'x') {
    const comp = await fetch_company_by_id(
      slug_or_id,
      process.env.BUBBLE_API_PRIVATE_KEY as string
    );
    return comp;
  }
  else {
    const comp = await fetch_company_by_slug(
      slug_or_id,
      process.env.BUBBLE_API_PRIVATE_KEY as string
    );
    return comp;
  }

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
  if (false) {
    // res.status(200).json(cache.get(cache_id));
    return;
  }
  else {

    if (id.length == 32 && id[13] == 'x') {
      const comp = await fetch_company_by_id(
        id,
        process.env.BUBBLE_API_PRIVATE_KEY
      );
      res.status(200).json(comp);
    }
    else {
      const comp = await fetch_company_by_slug(
        id,
        process.env.BUBBLE_API_PRIVATE_KEY
      );
      if (!comp) {
        res.status(500);
        return;
      }
      res.status(200).json(comp);
    }


  }



}
