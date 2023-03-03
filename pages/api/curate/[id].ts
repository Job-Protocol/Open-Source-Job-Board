// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { getConfig, postMessage } from "@/utils";
import FormData from 'form-data';

import customer_config from "@/customer_config.json";


export async function curate_role_by_id(
  id: string,
  method: "add" | "remove" | undefined,
): Promise<boolean> {


  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "Bearer ".concat(process.env.NEXT_PUBLIC_BUBBLE_API_PRIVATE_KEY as string)
  );

  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  //myHeaders.append("Content-Type", "text/plain");

  var urlencoded = new URLSearchParams();
  //urlencoded.append("title", "ttt");


  // let myHeaders = new Headers();
  // myHeaders.append("Authorization", "Bearer ".concat(process.env.BUBBLE_API_PRIVATE_KEY as string));

  if (method == "add") {
    urlencoded.append(
      "partner_boards",
      JSON.stringify([customer_config.jobprotocol_key])
    );
  } else if (method == "remove") {
    console.log("Adding remove to formdata");
    urlencoded.append("partner_boards", JSON.stringify([]));
  } else {
    console.log("method not recognized");
    return false;
  }

  //   let url = new URLSearchParams(formdata as any).toString();

  // @ts-ignore
  const requestOptions: RequestInit = {
    body: urlencoded,
    method: "PATCH",
    headers: myHeaders,
    redirect: "follow",
  };



  const url_role: string = getConfig()["endpoint"] + "/obj/role/" + id;

  try {
    console.log("Curation request", url_role);
    const result: any = await fetch(url_role, requestOptions);
    console.log("RESULT", result);
    if (result.status !== 204) {
      throw new Error(`Bubble returned unexecpected status code ${result.status}`);
    }
  } catch (e) {
    console.log("THE ERROR", e);
    return false
  }

  // // Role curation was successfull, so now, revalidate the page.
  // const url_revlidate: string = "/api/revalidate?page=/?path=/";
  // try {
  //   console.log("Revalidating index page");
  //   const success_re: any = await fetch(url_revlidate);
  // } catch (e) {
  //   console.log("Revalidation failed with error", e);
  //   return false
  // }

  return true;
}

interface IResponse {
  message: string
}

export default async function role_handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponse>
) {

  const method: string | undefined = req.method;
  const { id } = req.query;
  const body = req.body;

  if (!id) {
    res.status(400).json({ message: "Missing id" });
    return;
  }

  if (typeof id !== "string") {
    res.status(400).json({ message: "Cant process batch requests" });
    return;
  }

  const success: boolean = await curate_role_by_id(
    id,
    req.query.method,
  );
  if (success) {
    res.status(200).json({ message: "Success" });
  } else {
    res.status(402).json({ message: "Role curation failed" });
  }
}
