import type { NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import { Asap_Condensed } from "@next/font/google";
import { addAbortSignal } from "stream";
import { GeographicAddress, getDefaultGeographicAddress } from "@/bubble_types";

var psCache = require('ps-cache');
var cache = new psCache.Cache();


export async function fetch_by_inp(id: string, key: string): Promise<GeographicAddress> {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer ".concat(key));
  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const url: string = "https://maps.googleapis.com/maps/api/place/details/json?place_id=" + id + "&key=" + key
  const response = await fetch(url, requestOptions);
  const result = await response.json();
  const utc_offset = result.result.utc_offset;
  const formattted_address = result.result.formatted_address;
  const address_components = result.result.address_components;

  function find_by_type(t: string, address_components: any[]): string | undefined {
    for (var i = 0; i < address_components.length; i++) {
      if (address_components[i].types.includes(t)) {
        return address_components[i].long_name;
      }
    }
  }

  const res = getDefaultGeographicAddress();
  res.country = find_by_type("country", address_components);
  res.utc_offset = result.result.utc_offset;
  res.address = result.result.formatted_address;
  res.city = find_by_type("locality", address_components);
  return res;
}



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GeographicAddress>
) {

  const { id } = req.query;

  if (!process.env.NEXT_PUBLIC_GOOGLE_API_KEY || typeof id !== "string") {
    res.status(500);
    return;
  }

  const cache_id: string = "address_from_string" + id;
  if (cache.has(cache_id)) {
    res.status(200).json(cache.get(cache_id));
    return;
  }
  else {
    const role = await fetch_by_inp(id, process.env.NEXT_PUBLIC_GOOGLE_API_KEY);;
    cache.set(cache_id, role, { ttl: 1000 * 60 * 2 });
    res.status(200).json(role);
  }
}
