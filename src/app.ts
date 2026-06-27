import cookieParser from "cookie-parser";
import type { Application, Request,Response } from "express";
import express, { request } from "express"
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";

import  httpStatus from "http-status";
import bcrypt from "bcryptjs";
import { userRoute } from "./moduls/user/user.route";
import { authRoutes } from "./moduls/auth/auth.route";
import { postRoutes } from "./moduls/posts/posts.route";



const app: Application=express();

app.use(cors({
     origin: config.app_url,
     Credential: true
}))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
app.get("/", (req: Request, res: Response)=>{
   
    
    res.send("server running ")
})


app.use("/api/users/", userRoute)

app.use('/api/auth',authRoutes)

app.use('/api/posts',postRoutes)




export default app;