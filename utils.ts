import config from "config.json";
import { RoleLocation, RoleLocationType } from "./bubble_types";

export function rolelocation_to_string(rolelocation: RoleLocation): string {
  console.log("ROLELOCATION", rolelocation);
  if (rolelocation.location_type == RoleLocationType.Remote) {
    return "Global(Remote)";
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

  return "";
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
    "Bearer " + process.env.BUBBLE_API_PRIVATE_KEY
  );

  var formdata = new FormData();
  formdata.append("message", msg);
  formdata.append("channel", "C04MRCGRZ7S");

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };

  fetch(
    config["dev"]["endpoint"] +
      "/wf/slack_message_forward?message={msg}&channel=C04MRCGRZ7S",
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
