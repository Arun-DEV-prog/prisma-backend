import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import httpStatus from "http-status"
import config from "../../config";
import { userService } from "./user.service";
import { catchAsync } from "../../utilis/catchAsync";
import { sendResponse } from "../../utilis/sendResponse";
import jwt from 'jsonwebtoken';
import { jwtUtils } from "../../utilis/jwt";








const creatUsers= catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    
    
        const payload= req.body;

    const user=await userService.registerUserIntoDB(payload)
     

   

    sendResponse(res,{
         success: true,
         statusCode: httpStatus.CREATED,
         massage:"user registered successfully",
         data:{user}
    })
    

//    res.status(httpStatus.CREATED).json({
//     success: true,
//     statusCode: httpStatus.CREATED,
//     message: "user created",
//     data: {
//           user
//     }
//})
})


const getMyProfile=catchAsync( async (req: Request, res: Response, next: NextFunction)=>{
      if(!req.user){
           throw new Error("You are not logged in, Please log in to access this")
      }

      const profile= await userService.getProfilemyDB(req.user.id);

      sendResponse(res,{
           success: true,
           statusCode: httpStatus.OK,
           massage : "User profile fetched successfully",
            data: profile
      })


    
})



const updateMyProfile=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
       const userId= req.user?.id as string;
       const payload= req.body;

       const updatedProfile= await userService.udatemyProfile(userId,payload);
         sendResponse(res,{
           success: true,
           statusCode: httpStatus.OK,
           massage : "User profile fetched successfully",
            data: updatedProfile
      })


})



export const userController ={
     creatUsers,
     getMyProfile,
     updateMyProfile
}