import type { NextApiRequest, NextApiResponse } from "next";
import config from "../../../config.json";

export type RoleDetail = {
  id: string;
  title: string;
  company_id: string;
  desc: string;
  company_name: string;
  logo: string;
};

export async function fetch_role_by_id(
  id: string,
  key: string
): Promise<RoleDetail> {
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
  const result_role = await response.json();

  const url_company: string =
    "https://app.jobprotocol.xyz/version-live/api/1.1/obj/company/" +
    result_role.response.company;
  const respone_comp = await fetch(url_company, requestOptions);
  const result_comp = await respone_comp.json();

  return {
    id: result_role.response._id,
    title: result_role.response.title,
    company_id: result_role.response.company,
    desc: result_role.response.job_description,
    company_name: result_comp.response.Name,
    logo: result_comp.response.Logo,
  };
}

export default async function role_detail_handler(
  req: NextApiRequest,
  res: NextApiResponse<RoleDetail>
) {
  const { id } = req.query;

  if (!process.env.BUBBLE_API_PRIVATE_KEY || typeof id !== "string") {
    res.status(500);
    return;
  }
  const roledetail = await fetch_role_by_id(
    id,
    process.env.BUBBLE_API_PRIVATE_KEY
  );
  res.status(200).json(roledetail);
}
