import { client } from "../index.js";

export async function getlogindata(data){
    return await client.db("guvi").collection("details").insertOne(data);
};

export async function getusername(email){
    return await client.db("guvi").collection("details").findOne({email:email});
};
//save profile details by emailid

export async function profiledata(data){
    return await client.db("guvi").collection("profile").insertOne(data);
}

