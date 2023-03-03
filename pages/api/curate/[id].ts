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

  myHeaders.append("Content-Type", "text/plain");


  // let myHeaders = new Headers();
  // myHeaders.append("Authorization", "Bearer ".concat(process.env.BUBBLE_API_PRIVATE_KEY as string));

  let formdata = new FormData();
  if (method == "add") {
    formdata.append(
      "partner_boards",
      JSON.stringify([customer_config.jobprotocol_key])
    );
  } else if (method == "remove") {
    formdata.append("partner_boards", JSON.stringify([]));
  } else {
    console.log("method not recognized");
    return false;
  }

  //   let url = new URLSearchParams(formdata as any).toString();

  // @ts-ignore
  const requestOptions: RequestInit = {
    body: formdata,
    method: "PATCH",
    headers: myHeaders,
    redirect: "follow",
  };



  const url_role: string = getConfig()["endpoint"] + "/obj/role/" + id;

  try {
    const result: any = await fetch(url_role, requestOptions);
  } catch (e) {
    console.log("THE ERROR", e);
    return false
  }
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
