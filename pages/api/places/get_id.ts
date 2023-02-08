import type { NextApiRequest, NextApiResponse } from "next";
import config from "../../../config.json";
import { useRouter } from "next/router";

var psCache = require('ps-cache');
var cache = new psCache.Cache();

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


    const cache_id: string = "place_id_from_string" + inp;
    if (cache.has(cache_id)) {
        res.status(200).json(cache.get(cache_id));
        return;
    }
    else {
        const role = await fetch_by_inp(inp, process.env.NEXT_PUBLIC_GOOGLE_API_KEY);;
        cache.set(cache_id, role, { ttl: 1000 * 60 * 2 });
        res.status(200).json(role);
    }
}
