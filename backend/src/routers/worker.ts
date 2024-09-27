import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import {Router} from "express";
import { WORKER_JWT_SECRET } from "..";
const router=Router();

const prismaClient=new PrismaClient();

router.post("/signin",async (req,res)=>{
    const hardcodedWalletAddress="BU3h5q4a5zUQMj75VGEKJbx3bjq8e8TZJo3orbowTutB";
    const existingUser=await prismaClient.worker.findFirst({
        where:{
            address:hardcodedWalletAddress
        }
    })

    if(existingUser){
        const token=jwt.sign({
            userId:existingUser.id
        },WORKER_JWT_SECRET);

        res.json({
            token
        })
    }else{
        const user=await prismaClient.worker.create({
            data: {
                address:hardcodedWalletAddress,
                pending_amount: 0,
                locked_amount: 0
            }
        })
        const token=jwt.sign({
            userId:user.id
        },WORKER_JWT_SECRET);
        res.json({
            token
        })
    }
});

export default router;