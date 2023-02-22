import type { NextApiRequest, NextApiResponse } from "next";
import { getConfig } from "@/utils";
import { postMessage } from "@/utils";

import {
    Company,
    CompanySocials,
    getDefaultCompany,
    NamedLink,
} from "@/bubble_types";

import { fetch_by_id as fetchSocials } from "./company_socials/[id]";
import { fetch_by_id as fetchNamedLink } from "./named_link/[id]";

var psCache = require('ps-cache');
var cache = new psCache.Cache();

export async function process_single_company_response(response_company: any, key: string): Promise<Company> {

    // Fetch socials, if possible
    const socials: CompanySocials | undefined = response_company.socials
        ? await fetchSocials(response_company.socials, key)
        : undefined;

    // Fetch named links, if possible
    const press_article_links: NamedLink[] | undefined = response_company
        .press_article_links
        ? await Promise.all(
            response_company.press_article_links.map((id: string) =>
                fetchNamedLink(id, key)
            )
        )
        : undefined;

    const comp: Company = getDefaultCompany();
    comp.id = response_company._id;
    comp.name = response_company.Name;
    comp.logo = response_company.Logo;
    comp.headquarters = response_company.headquarters;
    comp.num_employees = response_company.num_employees;
    comp.socials = socials;
    comp.tagline = response_company.tagline;
    comp.press_article_links = press_article_links;
    comp.founding_year = response_company.founding_year;
    comp.slug = response_company.Slug;
    comp.mission = response_company.mission;
    comp.priority = response_company.priority;
    comp.keywords = [comp.name, comp.headquarters];

    return comp;
}


export async function fetch_companies(
    key: string
): Promise<Company[]> {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer ".concat(key));
    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    // Fetch company, if possible
    const url: string = getConfig()["endpoint"] + "/obj/company/"
    const response = await fetch(url, requestOptions);
    if (response.status != 200) {
        postMessage("URGENT: 'fetch_company_by_id' failed with status code " + response.status.toString());
    }
    const result = await response.json();

    const comps: any = result.response.results.map((result: any) => process_single_company_response(result, key));

    const final = await Promise.all(comps);


    return final;
}

export default async function company_handler(
    req: NextApiRequest,
    res: NextApiResponse<Company>
) {

    if (!process.env.BUBBLE_API_PRIVATE_KEY) {
        res.status(500);
        return;
    }



    const comp = await fetch_companies(
        process.env.BUBBLE_API_PRIVATE_KEY
    );
    res.status(200).json(comp);


}
