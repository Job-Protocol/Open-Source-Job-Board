import type { NextApiRequest, NextApiResponse } from "next";
import config from "../../../config.json";
import { useRouter } from "next/router";

export async function fetch_by_inp(input: string, key: string): Promise<string> {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer ".concat(key));
    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    const url: string = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" + input + "&inputtype=textquery&key=" + key
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result.candidates[0].place_id;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {

    const inp: string = JSON.parse(req.body).input;

    if (!process.env.NEXT_PUBLIC_GOOGLE_API_KEY || typeof inp !== "string") {
        res.status(500).json("Fail");
        return;
    }
    const result: string = await fetch_by_inp(inp, process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
    res.status(200).json(result);
}
