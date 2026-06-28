import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilis/catchAsync";
import { postController } from '../posts/posts.controller';
import { sendResponse } from "../../utilis/sendResponse";
import httpStatus from 'http-status';
import { commentServices } from "./comments.services";



const postComments=catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
        const user= req.user?.id;
         const payload=req.body;

         const data=await commentServices.createComments(payload, user as string);

        if(!user){
             throw new Error ("User or userid not found");
        }

        sendResponse(res,{
             success: true,
             statusCode: httpStatus.OK,
             massage: "successfuly comment on post",
             data: data

        })



})


const getCommentById=catchAsync(async(req:Request, res: Response, next: NextFunction)=>{
       const commentId=req.params.commentId;

       const comment= await commentServices.getCommentById(commentId as string)

        sendResponse(res,{
             success: true,
             statusCode: httpStatus.OK,
             massage: "successfully retrive comments",
             data: comment
        })
})


export const commentController={
 postComments,
 getCommentById    
}