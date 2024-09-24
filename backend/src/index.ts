import express from "express";
import userRouter from "./routers/user";
import workerRouter from "./routers/worker";
export const JWT_SECRET="union12";

const app=express();
require('dotenv').config();
app.use("/v1/user",userRouter);
app.use("/v1/worker",workerRouter);

app.listen(3000,()=>{
    console.log("DATABASE_URL:", process.env.DATABASE_URL)
});