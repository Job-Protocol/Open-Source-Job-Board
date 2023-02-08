import type { NextApiRequest, NextApiResponse } from "next";
import config from "../../../config.json";
import { getConfig } from "@/utils";

import { Requirement, getDefaultRequirement } from "@/bubble_types";

var psCache = require('ps-cache');
var cache = new psCache.Cache();


export async function fetch_by_id(
    id: string,
    key: string
): Promise<Requirement> {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer ".concat(key));
    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    const url: string = getConfig()["endpoint"] + "/obj/requirement/" + id;
    const response = await fetch(url, requestOptions);
    const result = await response.json();

    const res: Requirement = getDefaultRequirement();
    res.id = result.response._id;
    res.desc = result.response.description;
    res.is_required = result.response.is_required;
    res.rank_nb = result.response.rank_nb;
    return res;
}

export default async function company_handler(
    req: NextApiRequest,
    res: NextApiResponse<Requirement>
) {
    const { id } = req.query;

    if (!process.env.BUBBLE_API_PRIVATE_KEY || typeof id !== "string") {
        res.status(500);
        return;
    }

    const cache_id: string = "requirement_" + id;
    if (cache.has(cache_id)) {
        res.status(200).json(cache.get(cache_id));
        return;
    }
    else {
        const result = await fetch_by_id(id, process.env.BUBBLE_API_PRIVATE_KEY);
        cache.set(cache_id, result, { ttl: 1000 * 60 * 2 });
        res.status(200).json(result);
    }
}
