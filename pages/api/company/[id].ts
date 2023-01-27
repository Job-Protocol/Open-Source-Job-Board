import type { NextApiRequest, NextApiResponse } from "next";

type Company = {
  id: string;
  name: string;
  logo: string;
};

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

  const url: string =
    "https://app.jobprotocol.xyz/version-live/api/1.1/obj/company/" + id;
  const response = await fetch(url, requestOptions);
  const result = await response.json();
  return {
    id: result.response._id,
    name: result.response.Name,
    logo: result.response.Logo,
  };
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
