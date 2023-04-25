import type { NextApiRequest, NextApiResponse } from "next";
import { getConfig } from "@/utils";

export default async function handler(
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

    const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: req.body,
        redirect: "follow",
    };

    const response = await fetch(
        getConfig()["endpoint"] + "/obj/requirementargument/",
        requestOptions
    );

    if (response.status !== 201) {
        res.status(response.status).json("Failed to create");
        return;
    }

    const result = await response.json();

    res.status(201).json({ id: result.id });
}
