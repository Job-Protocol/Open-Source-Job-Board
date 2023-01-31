import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const query = req.query;

  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "Bearer " + process.env.BUBBLE_API_PRIVATE_KEY
  );
  myHeaders.append("Content-Type", "application/json");

  const requestOptions: RequestInit = {
    method: "GET",
    //mode: "no-cors",
    // headers: myHeaders,
    redirect: "follow",
  };

  const url: string =
    "https://maps.googleapis.com/maps/api/place/autocomplete/json?key=" +
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY +
    "&input=" +
    query.s;
  const response = await fetch(url, requestOptions);
  const result = await response.json();
  const final = result.predictions.map((r: any) => {
    return { label: r.description, value: r.description };
  });

  res.status(200).json(final);
}
