import config from "config.json";
import { GeographicAddress, getDefaultCompany, RoleLocation, RoleLocationType, getDefaultGeographicAddress } from "./bubble_types";
import { fetch_by_inp as fetch_place_id } from "./pages/api/places/get_id";
import { fetch_by_inp as fetch_place_details } from "./pages/api/places/details/[id]";

import { Role } from "./bubble_types";

export function getConfig(): any {

  if (process.env.NEXT_PUBLIC_CONFIG_VERSION && process.env.NEXT_PUBLIC_CONFIG_VERSION == "production") {
    return config["production"];
  }
  return config["dev"];
}

export async function addressstring_to_type(address: string): Promise<GeographicAddress> {
  //DEBUG
  const params = {
    input: address,
  };
  const options = {
    method: 'POST',
    body: JSON.stringify(params)
  };
  const place_id = await fetch_place_id(address, process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string)

  const place_details = await fetch_place_details(place_id, process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string);

  return place_details;
}

export function rolelocation_to_string(rolelocation: RoleLocation): string {
  if (rolelocation.location_type == RoleLocationType.Remote) {
    return "Remote(Global)";
  }
  if (rolelocation.location_type == RoleLocationType.TimezoneRange) {
    return (
      "GMT-" +
      rolelocation.timezone_range?.min +
      " to GMT+" +
      rolelocation.timezone_range?.max
    );
  }

  if (rolelocation.location_list) {
    return rolelocation.location_list.map((item) => item.address).join("\n");
  }

  return "Unknown location";
}

export function postMessages(msgs: string[]) {
  msgs.forEach((msg) => postMessage(msg));
}

export function postMessage(msg: string) {
  var myHeaders = new Headers();

  // if (!process.env.BUBBLE_API_PRIVATE_KEY || typeof id !== "string") {
  //   return;
  // }
  // const role = await fetch_role_by_id(id, process.env.BUBBLE_API_PRIVATE_KEY);

  myHeaders.append(
    "Authorization",
    "Bearer " + process.env.BUBBLE_API_PRIVATE_KEY,
  );
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "message": msg,
    "channel": "C04MRCGRZ7S"
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const URL: string = config["dev"]["endpoint"] +
    "/wf/slack_message_forward"
  fetch(
    URL,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

export const validateEmail = (email: string): boolean => {
  const m = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  if (!m) {
    return false;
  }
  return true;
};

//TODO(scheuclu) We need more keywords here. Possible location or from the jobdescription
export function extractKeywordsFromRole(role: Role): string[] {
  return [role.title, role.company.name];
}
