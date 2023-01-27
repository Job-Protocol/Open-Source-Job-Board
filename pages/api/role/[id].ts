import type { NextApiRequest, NextApiResponse } from "next";
import config from "../../../config.json";

type Role = {
  id: string;
  title: string;
  company_id: string;
  desc: string;
};

export async function fetch_role_by_id(id: string, key: string): Promise<Role> {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer ".concat(key));
  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const url: string =
    "https://app.jobprotocol.xyz/version-live/api/1.1/obj/role/" + id;

  const response = await fetch(url, requestOptions);
  const result = await response.json();
  console.log(result);
  return {
    id: result.response._id,
    title: result.response.title,
    company_id: result.response.company,
    desc: result.response.job_description,
  };
}

export default async function role_handler(
  req: NextApiRequest,
  res: NextApiResponse<Role>
) {
  const { id } = req.query;

  if (!process.env.BUBBLE_API_PRIVATE_KEY || typeof id !== "string") {
    res.status(500);
    return;
  }
  const role = await fetch_role_by_id(id, process.env.BUBBLE_API_PRIVATE_KEY);
  res.status(200).json(role);
}
