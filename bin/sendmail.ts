import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // if (!process.env.BUBBLE_API_PRIVATE_KEY) {
  //   res.status(500).json("Fail");
  //   return;
  // }

  // var myHeaders = new Headers();
  // myHeaders.append(
  //   "Authorization",
  //   "Bearer ".concat(process.env.BUBBLE_API_PRIVATE_KEY as string)
  // );

  // myHeaders.append("Content-Type", "application/json");

  // var requestOptions = {
  //   method: "POST",
  //   headers: myHeaders,
  //   body: req.body,
  //   redirect: "follow",
  // };

  // const response = await fetch(
  //   config["dev"]["endpoint"] + "/obj/candidate/",
  //   requestOptions
  // );

  // if (response.status !== 200) {
  //   res.status(response.status).json("Failed to create");
  //   return;
  // }

  res.status(200).json("Mail sent");

  postMessage("Mail sent");
}
