import type { NextApiRequest, NextApiResponse } from "next";

type Company = {
  id: string;
  name: string;
  logo: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Company>
) {
  const { id } = req.query;

  if (!process.env.BUBBLE_API_PRIVATE_KEY) {
    res.status(500);
    return;
  }
  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "Bearer ".concat(process.env.BUBBLE_API_PRIVATE_KEY)
  );
  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const url: string =
    "https://app.jobprotocol.xyz/version-live/api/1.1/obj/company/" + id;

  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result.response);
      return res.status(200).json({
        id: result.response.Name,
        name: result.response.Company,
        logo: result.response.Logo,
      });
    })
    .catch((error) => res.status(500));
}
