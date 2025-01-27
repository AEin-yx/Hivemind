import { NextFunction ,Request,Response} from "express";
import jwt from "jsonwebtoken";
import {JWT_SECRET, WORKER_JWT_SECRET} from ".";

export function authMiddleware(req:Request,res:Response,next:NextFunction){
    const authHeader=req.headers["authorization"] ?? "";
    try{
        const decoded=jwt.verify(authHeader,JWT_SECRET);
        //@ts-ignore
        if(decoded.userId){
            //@ts-ignore
            req.userId=decoded.userId;
            return next();
        }else{
            res.status(403).json({
                message:"You are not logged in"
            })
        }
    }catch(e){
        res.status(403).json({
            message:"You are not logged in"
        })
    }
}

export function workerAuthMiddleware(req:Request,res:Response,next:NextFunction){
    const authHeader=req.headers["authorization"] ?? "";
    try{
        const decoded=jwt.verify(authHeader,WORKER_JWT_SECRET);
        //@ts-ignore
        if(decoded.userId){
            //@ts-ignore
            req.userId=decoded.userId;
            return next();
        }else{
            res.status(403).json({
                message:"You are not logged in"
            })
        }
    }catch(e){
        res.status(403).json({
            message:"You are not logged in"
        })
    }
}