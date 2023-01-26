import React, { useState } from 'react'; 
import { useEffect } from 'react';


interface Role {
    title: string;
    company_name: string;
}

async function GetUsers(){
    const result =  await fetch("api/listroles");
    const parsed = await result.json();
    return parsed;
}



export default function Joblist(){

    const [userList, setUserList] = useState<Role[]>([]); 
  
 
    useEffect(() => {
        GetUsers().then(res => {console.log(res); setUserList(res);});
    }, [])
  
    console.log("userlist",userList);
  
  
    return (
      <div>
        <h1>Infinite Loading</h1>
        <h2>{userList.length}</h2>
        <ul>{userList.map(role => <li>{role.title} - {role.company_name}</li>)}</ul>;
      </div>
    )
  }