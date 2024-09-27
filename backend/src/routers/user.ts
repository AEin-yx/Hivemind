import { PrismaClient } from "@prisma/client";
import {Router} from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "..";
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { authMiddleware } from "../middleware";
import { createTaskInput } from "./types";

const DEFAULT_TITLE="Clcik the most clickable thumbnail";
require('dotenv').configDotenv();
const s3Client = new S3Client({
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY!
    },
    region:"us-east-1"
})

const router=Router();

const prismaClient=new PrismaClient();

router.get("/task",authMiddleware,async (req,res)=>{
    //@ts-ignore
    const taskId: string = req.query.taskId;
    //@ts-ignore
    const userId: string = req.userId;

    const taskDetails = await prismaClient.task.findFirst({
        where:{
            user_id:Number(userId),
            id:Number(taskId)
        },
        include:{
            options: true
        }
    })

    if(!taskDetails){
        return res.status(411).json({
            message:"You don't have access to this task"
        })
    }

    const responses = await prismaClient.submission.findMany({
        where:{
            task_id: Number(taskId)
        },
        include:{
            option: true
        }
    })

    const result: Record<string,{
        count: number;
        option : {
            imageUrl: string
        }
    }>={};

    taskDetails.options.forEach(option=>{
        result[option.id]={
            count: 0,
            option : {
                imageUrl:option.image_url 
            }
        }
    })
    responses.forEach(r=>{
        result[r.option_id].count++;
    });


    res.json({
        result
    })
})

router.post("/task",authMiddleware,async (req,res)=>{
    // validate input from user
    const body=req.body;
    //@ts-ignore
    const userId=req.userId;
    const parseData=createTaskInput.safeParse(body);

    if(!parseData.success){
        return res.status(411).json({
            message:"You've sent the wrong input"
        })
    }
    
    // parse the signature to ensure that the user has paid

    let response=await prismaClient.$transaction(async tx=>{
        const response=await tx.task.create({
            data: {
                title: parseData.data.title ?? DEFAULT_TITLE,
                amount: "1",
                signature: parseData.data.signature,
                user_id: userId
            }
        });

        await tx.option.createMany({
            data: parseData.data.options.map(x=>({
                image_url:x.imageUrl,
                task_id:response.id
            }))
        })
        return response;
    })
    res.json({
        id:response.id
    })
})

router.get("/presignedUrl",authMiddleware,async(req,res)=>{
    //@ts-ignore
    const userId=req.userId;
    const command = new PutObjectCommand({
      Bucket: "hivedmind",
      Key: `hivemind/${userId}/${Math.random()}/img.jpg`,
      ContentType:"img/jpg"
    })


const preSignedUrl = await getSignedUrl(s3Client, command, {
  expiresIn: 3600
})

console.log(preSignedUrl)
res.json({
    preSignedUrl
})
})

router.post("/signin", async(req,res)=>{
    const hardcodedWalletAddress="BU3h5q4a5zUQMj75VGEKJbx3bjq8e8TZJo3orbowTutB";
    const existingUser=await prismaClient.user.findFirst({
        where:{
            address:hardcodedWalletAddress
        }
    })

    if(existingUser){
        const token=jwt.sign({
            userId:existingUser.id
        },JWT_SECRET);

        res.json({
            token
        })
    }else{
        const user=await prismaClient.user.create({
            data: {
                address:hardcodedWalletAddress
            }
        })
        const token=jwt.sign({
            userId:user.id
        },JWT_SECRET);
        res.json({
            token
        })
    }
});

export default router;