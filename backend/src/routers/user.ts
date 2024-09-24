import { PrismaClient } from "@prisma/client";
import {Router} from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "..";
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { authMiddleware } from "../middleware";

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

router.get("/getpresignedUrl",authMiddleware,async(req,res)=>{
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