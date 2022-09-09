import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { userRouter } from "./Routes/users.js";


const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;

app.get("/",async function(req,res){
    res.send("this is signup guvi task");
});

async function createConnection(){
    const client = new  MongoClient(MONGO_URL);
    await client.connect();
    console.log("mongodb is connected");
    return client;
};
export const client = await createConnection();
app.use("/user",userRouter)
app.listen(PORT,()=>console.log(`the port no is ${PORT}`))