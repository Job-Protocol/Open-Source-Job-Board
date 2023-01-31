import type { NextApiRequest, NextApiResponse } from "next";
import config from "../../../config.json";

import { Company, getDefaultCompany } from "@/bubble_types";

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

  const url: string = config["dev"]["endpoint"] + "/obj/company/" + id;
  const response = await fetch(url, requestOptions);
  const result = await response.json();

  const comp: Company = getDefaultCompany();
  comp.id = result.response._id;
  comp.name = result.response.Name;
  comp.logo = result.response.Logo;
  comp.tagline = "This is the tagline";
  comp.socials.github = "aaa";
  comp.socials.linkedin = "asdasd";
  comp.socials.website = "asd";
  comp.press_article_links = [
    { name: "aaa", link: "bbb" },
    { name: "ccc", link: "ddd" },
  ];
  return comp;
}

export default async function company_handler(
  req: NextApiRequest,
  res: NextApiResponse<Company>
) {
  const { id } = req.query;

  if (!process.env.BUBBLE_API_PRIVATE_KEY || typeof id !== "string") {
    res.status(500);
    return;
  }
  const role = await fetch_company_by_id(
    id,
    process.env.BUBBLE_API_PRIVATE_KEY
  );
  res.status(200).json(role);
}
