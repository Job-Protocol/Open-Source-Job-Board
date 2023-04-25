// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import FormData from 'form-data';

interface IResult {
    token: string;
    user_id: string;
}

interface IResponse {
    status: number;
    result: IResult;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<IResponse>
) {

    if (req.query.email == undefined || req.query.password == undefined) {
        res.status(401).json({ status: 401, result: undefined });
        return;
    }

    var formdata = new FormData();
    formdata.append("email", req.query.email);
    formdata.append("password", req.query.password);

    var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    const result = await fetch("https://app.jobprotocol.xyz/version-test/api/1.1/wf/generate-api-token", requestOptions);
    if (result.status !== 200) {
        res.status(500).json({ status: result.status, result: undefined });
        return;
    }

    const response = await result.json();

    res.status(200).json({ status: 200, result: { token: response.response.token, user_id: response.response.user_id } });

}
