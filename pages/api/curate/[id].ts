// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { getConfig, postMessage } from "@/utils";

import { Role, getDefaultRole, RoleLocation, Requirement, RoleState, RoleType } from "@/bubble_types";

import FormData from "form-data";


var psCache = require('ps-cache');
var cache = new psCache.Cache();


export async function curate_role_by_id(id: string, method: "add" | "remove" | undefined, key: string): Promise<boolean> {

    console.log("method", method);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer ".concat(key));

    var formdata = new FormData();
    if (method == 'add') {
        formdata.append("partner_boards", JSON.stringify([process.env.NEXT_PUBLIC_jobprotocol_key]));
    }
    else if (method == 'remove') {
        //console.log("I am in the right spot");
        formdata.append("partner_boards", JSON.stringify([]));
    }
    else {
        false;
    }

    let url = new URLSearchParams(formdata as any).toString();

    // @ts-ignore
    const requestOptions: RequestInit = {
        method: "PATCH",
        headers: myHeaders,
        redirect: "follow",
        body: formdata
    };

    const url_role: string = getConfig()["endpoint"] + "/obj/role/" + id;
    const result: any = await fetch(url_role, requestOptions);

    return result;
}

export default async function role_handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {

    //console.log("req", req.method);
    ///console.log("req.query", req.query);

    const method: string | undefined = req.method;
    const { id } = req.query;
    const body = req.body;
    //console.log("body", body);
    //console.log("id", id);

    if (!id) {
        res.status(400).json({ message: "Missing id" });
        return;
    }

    if (typeof id !== "string") {
        res.status(400).json({ message: "Cant process batch requests" });
        return;
    }


    const role = await curate_role_by_id(id, req.query.method, process.env.BUBBLE_API_PRIVATE_KEY as string); curate_role_by_id
    res.status(200).json(role);





}
