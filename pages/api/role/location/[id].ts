import type { NextApiRequest, NextApiResponse } from "next";
import config from "@/config.json";

import {
  RoleLocation,
  getDefaultRoleLocation,
  RoleLocationType,
  TimezoneRange,
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

  const url: string = config["dev"]["endpoint"] + "/obj/role_location/" + id;
  const response = await fetch(url, requestOptions);
  const result = await response.json();
  // console.log("KKK", result);

  const res: RoleLocation = getDefaultRoleLocation();
  const timezone_range: TimezoneRange | undefined = result.response
    .TimeZoneRange
    ? {
        min: result.response.TimeZoneRange[0],
        max: result.response.TimeZoneRange[1],
      }
    : undefined;

  const location_type: RoleLocationType | undefined =
    result.response.LocationType == "LocationList"
      ? RoleLocationType.LocationList
      : result.response.LocationType == "TimezoneRange"
      ? RoleLocationType.TimezoneRange
      : undefined;

  res.id = result.response._id;
  res.location_list = result.response.LocationList;
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
  const role = await fetch_by_id(id, process.env.BUBBLE_API_PRIVATE_KEY);
  res.status(200).json(role);
}
