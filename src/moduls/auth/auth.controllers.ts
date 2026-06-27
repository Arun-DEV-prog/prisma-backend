import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilis/catchAsync";
import { AuthService } from "./auth.services";
import { sendResponse } from "../../utilis/sendResponse";
import httpStatus from 'http-status';
import cookie from "cookie-parser"



const loginUser=catchAsync(async(req: Request,res:Response, next:NextFunction)=>{
           const payload=req.body;

           const {accessToken,refressToken}=await AuthService.loginUser(payload)

          res.cookie("accessToken",accessToken,{
             httpOnly: true,
             secure: process.env.NODE_ENV === "production",
             sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
             maxAge: 1000 * 60 * 60 * 24 //24 hour or 1 day
          })


          res.cookie("refressToken",refressToken,{
             httpOnly: true,
             secure: process.env.NODE_ENV === "production",
             sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
             maxAge: 1000 *60 * 60 * 24 * 7// 7 days
          })


           sendResponse(res,{
             success: true,
             statusCode: httpStatus.OK,
             massage: "login success",
             data: {accessToken,refressToken}
           })
})



const refreshToken=catchAsync(async(req: Request, res: Response, next:NextFunction)=>{
     const refreshToken= req.cookies.refressToken;

     const {accessToken}=  await AuthService.refressToken(refreshToken);

       
       res.cookie("accessToken",accessToken,{
             httpOnly: true,
             secure: process.env.NODE_ENV === "production",
             sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
             maxAge: 1000 * 60 * 60 * 24 //24 hour or 1 day
          })


     sendResponse(res,{
       success: true,
       statusCode: httpStatus.OK,
       massage:"token refreshed successfully",
       data:{
          accessToken
       }
     })
})


export const AuthController={
     loginUser,
     refreshToken
}