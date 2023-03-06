import type { NextApiRequest, NextApiResponse } from "next";
import { GeographicAddress } from "@/bubble_types";
import { fetch_by_inp as fetch_place_id } from "pages/api/places/get_id";
import { fetch_by_inp as fetch_place_details } from "pages/api/places/details/[id]";

export async function addressstring_to_type(address: string): Promise<GeographicAddress> {
    //DEBUG
    const params = {
        input: address,
    };
    const options = {
        method: 'POST',
        body: JSON.stringify(params)
    };
    const place_id = await fetch_place_id(address, process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string)
    const place_details = await fetch_place_details(place_id, process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string);
    return place_details;
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<GeographicAddress>
) {

    const { s } = req.query;

    if (!process.env.NEXT_PUBLIC_GOOGLE_API_KEY || typeof s !== "string") {
        res.status(500);
        return;
    }
    const result: GeographicAddress = await addressstring_to_type(s);
    res.status(200).json(result);
}