// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'


type Role  = {
    title: string;
    company_name: string;
  }

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Role[]>
) {

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer adc329a06334375d61dbdf6bdf040aeb");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    const parsed =  fetch("https://app.jobprotocol.xyz/version-live/api/1.1/obj/role", requestOptions)
      .then(result => result.json())
      .then(p => p.response.results.map((role: any) => {
        const r: Role = {
            title: role.title,
            company_name: role.company
          };
          return r; 
      }))
      .then(r => res.status(200).json(r))
      .catch(error => {
        res.status(500);
      })
    
}
