import { PrismaClient } from "@prisma/client";
import {Router} from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET="union12";
const router=Router();
const prismaClient=new PrismaClient();

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