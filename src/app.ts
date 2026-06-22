import cookieParser from "cookie-parser";
import type { Application, Request,Response } from "express";
import express, { request } from "express"
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";

import  httpStatus from "http-status";
import bcrypt from "bcryptjs";



const app: Application=express();

app.use(cors({
     origin: config.app_url,
     Credential: true
}))
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
app.get("/", (req: Request, res: Response)=>{
   
    
    res.send("server running ")
})

app.post('/api/users/register', async(req:Request, res: Response)=>{
    const {name, email,password,profilePhoto}= req.body;
     
    const isUserExits= await prisma.user.findUnique({
         where: {email}
    })

    if(isUserExits){
         throw new Error ("user already exits");
    }

    const hashPassword= await bcrypt.hash(password, Number(config.Bcrypt_salt_round))
    
    const createUser= await prisma.user.create({
        data:{
             name,
             email,
             password:hashPassword
        }
    })

    await prisma.profie.create({
         data:{
            userId:createUser.id,
            profilePhoto
         }
    })

    const user=await prisma.user.findUnique({
     where:{
           id: createUser.id,
           email: createUser.email || email
     },
     omit:{
           password: true
     },
     include: {
           profile: true
     }
    })

    res.status(httpStatus.CREATED).json({
     success: true,
     statusCode: httpStatus.CREATED,
     message: "user created",
     data: {
           user
     }
})
})


export default app;