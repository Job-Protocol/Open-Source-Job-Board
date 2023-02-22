import type { NextApiRequest, NextApiResponse } from "next";
import { getConfig, postMessage } from "@/utils";

import { Role, getDefaultRole, RoleLocation, Requirement, RoleState, RoleType } from "@/bubble_types";

import { fetch_company_by_id } from "./company/[id]";
import { fetch_by_id as fetchRoleLocation } from "./role/location/[id]";
import { fetch_by_id as fetchRequirement } from "./requirement/[id]";



export async function process_single_role_response(role_response: any, key: string): Promise<Role> {
    const result_company = await fetch_company_by_id(
        role_response.company,
        process.env.BUBBLE_API_PRIVATE_KEY as string
    );

    //fetch role location or set undefined
    const loc: RoleLocation | undefined = role_response.location_new
        ? await fetchRoleLocation(role_response.location_new as string, key)
        : undefined;

    //fetch role requirement od set undefined
    const reqs: Requirement[] | undefined = role_response.requirements ?
        await Promise.all(role_response.requirements.map((req: string) => fetchRequirement(req as string, key))) :
        undefined;


    const rtype: RoleType | undefined = role_response.type == 'Engineering' ? RoleType.Engineering :
        role_response.type == 'Product' ? RoleType.Product :
            role_response.type == 'Design' ? RoleType.Design :
                role_response.type == 'Marketing' ? RoleType.Marketing :
                    role_response.type == 'Sales/BD' ? RoleType.SalesBD :
                        role_response.type == 'Operations' ? RoleType.Operations : undefined;


    const r: Role = getDefaultRole();
    r.id = role_response._id;
    r.title = role_response.title;
    r.desc = role_response.job_description;
    r.salary_min = role_response.salary_min;
    r.salary_max = role_response.salary_max;
    r.equity_pct_min = role_response.equity_pct_min;
    r.equity_pct_max = role_response.equity_pct_max;
    r.company = result_company;
    r.location = loc;
    r.requirements = reqs;
    r.state = role_response.state == "Live" ? RoleState.Live : RoleState.Hidden;
    r.type = rtype;
    r.keywords = r.company ? [r.title, r.company.name] : [r.title]//TODO(scheuclu) Improve this
    r.slug = role_response.Slug ? role_response.Slug : role_response._id;

    return r;
}


interface Constraints {
    key: string,
    constraint_type: string,
    value: string | string[]
}

export async function fetchRoles(
    key: string,
    params: any
): Promise<Role[]> {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer ".concat(key));
    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    const url_role: string = getConfig()["endpoint"] + "/obj/role?" + new URLSearchParams(params);
    console.log("------ URL2, ", url_role);
    const response = await fetch(url_role, requestOptions);

    const result = await response.json();

    const filtered = result.response.results.filter((r: any) => r !== undefined).filter((r: any) => r.company !== undefined);

    const roles: any = filtered.map((result: any) => process_single_role_response(result, key));

    const final = await Promise.all(roles);
    return final;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Role[]>
) {


    // const router = useRouter()
    // console.log(router.query);

    // { param: 'aaa', second: 'bbb' }
    res.setHeader('Cache-Control', 's-maxage=86400');
    if (!process.env.BUBBLE_API_PRIVATE_KEY) {
        res.status(500);
        return;
    }

    console.log("Req.quert", req.query);
    const roles = await fetchRoles(process.env.BUBBLE_API_PRIVATE_KEY, req.query);
    res.status(200).json(roles);


}
