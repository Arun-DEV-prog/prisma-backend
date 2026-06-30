import cookieParser from "cookie-parser";
import type { Application, Request,Response,NextFunction } from "express";
import express, { request, response } from "express"
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";


import { userRoute } from "./moduls/user/user.route";
import { authRoutes } from "./moduls/auth/auth.route";
import { postRoutes } from "./moduls/posts/posts.route";
import { commentRoutes } from "./moduls/comments/comments.route";
import { golbalErrorHandler } from "./middlewares/globalErrorhandler";
import { notFound } from "./middlewares/notFound";




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

app.use("/api/comments",commentRoutes)

app.use(notFound)

 app.use(golbalErrorHandler);




export default app;