import type { NextApiRequest, NextApiResponse } from "next";

export default async function candidate_handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!process.env.BUBBLE_API_PRIVATE_KEY) {
    res.status(500).json("Fail");
    return;
  }

  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "Bearer ".concat(process.env.BUBBLE_API_PRIVATE_KEY as string)
  );

  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: req.body,
    redirect: "follow",
  };

  const response = await fetch(
    "https://app.jobprotocol.xyz/version-test/api/1.1/obj/candidate/",
    requestOptions
  );

  if (response.status !== 201) {
    res.status(response.status).json("Failed to create");
    return;
  }

  res.status(201).json("Created");
}
