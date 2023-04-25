import type { NextApiRequest, NextApiResponse } from "next";
import { addressstring_to_type } from "@/utils";
import { getConfig } from "@/utils";


var psCache = require('ps-cache');
var cache = new psCache.Cache();


import {
  RoleLocation,
  getDefaultRoleLocation,
  RoleLocationType,
  TimezoneRange
} from "@/bubble_types";

export async function fetch_by_id(
  id: string,
  key: string
): Promise<RoleLocation> {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer ".concat(key));
  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const url: string = getConfig()["endpoint"] + "/obj/role_location/" + id;
  const response = await fetch(url, requestOptions);
  const result = await response.json();

  const res: RoleLocation = getDefaultRoleLocation();
  const timezone_range: TimezoneRange | null = result.response
    .TimeZoneRange
    ? {
      min: result.response.TimeZoneRange[0],
      max: result.response.TimeZoneRange[1],
    }
    : null;


  const location_type: RoleLocationType | null =
    result.response.LocationType == "LocationList"
      ? RoleLocationType.LocationList
      : result.response.LocationType == "TimezoneRange"
        ? RoleLocationType.TimezoneRange
        : result.response.LocationType == "Global"
          ? RoleLocationType.Remote : null;

  const location_list = await Promise.all(result.response.LocationList.map((loc: any) => addressstring_to_type(loc.address)));

  res.id = result.response._id;
  res.location_list = location_list;
  res.location_type = location_type;
  res.timezone_range = timezone_range;
  return res;
}

export default async function company_handler(
  req: NextApiRequest,
  res: NextApiResponse<RoleLocation>
) {
  const { id } = req.query;

  if (!process.env.BUBBLE_API_PRIVATE_KEY || typeof id !== "string") {
    res.status(500);
    return;
  }

  const cache_id: string = "rolelocation_from_id_" + id;
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
