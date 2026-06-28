import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilis/catchAsync";

import { postsService } from "./posts.services";

import { sendResponse } from "../../utilis/sendResponse";
import httpStatus from 'http-status';
import { prisma } from "../../lib/prisma";



const getPostController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
     const result = await postsService.getallPostService();
     sendResponse(res,{
           success: true,
           statusCode:httpStatus.OK,
           massage: "posts retrive successfully",
           data: result
     })
})
const getStatsPostController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
        
     const result= await postsService.getallpostStats();

      sendResponse(res,{
           success: true,
           statusCode: httpStatus.OK,
           massage: " successfully retrive post stats",
           data: result
      })
})
const getMYPostController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
     
     const authorid= req.user?.id;
     console.log(authorid)

     const data= await postsService.getMyPost(authorid as string);
     
      sendResponse(res,{
           success: true,
           statusCode:httpStatus.OK,
           massage: "posts retrive successfully",
           data: data
     })

})
const getPostByIdController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
       const postId= req.params.postId;

       if(!postId){
           throw new Error("post id not found in params");
       }

       const result= await postsService.getPostById(postId as string);

       sendResponse(res,{
           success: true,
           statusCode: httpStatus.OK,
           massage: "retrive successfully",
           data: result
       })
})
const createNewPostByIdController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
       const id= req.user?.id;

       const payload= req.body;

       const result = await postsService.createPost(payload,id as string)

        sendResponse(res,{
           success: true,
           statusCode: httpStatus.CREATED,
           massage: " post successfulluy created",
           data: result
        })
})
const updatePostByIdController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
     const authorId= req.user?.id;
     const postId= req.params.postId;
     const payload= req.body;
    const isAdmin=req.user?.role=="admin";


    const data= await postsService.updatePostById(authorId as string, payload, postId as  string, isAdmin)

     sendResponse(res,{
           success: true,
           statusCode:httpStatus.OK,
           massage: "posts updated successfully",
           data: data
     })
})

const deletePostByIdController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
      const authorId= req.user?.id;
     const postId= req.params.postId;
     
    const isAdmin=req.user?.role=="admin";


    const deletePost= await postsService.deletedPostById(authorId as string , postId as string, isAdmin);

     sendResponse(res,{
           success: true,
           statusCode:httpStatus.OK,
           massage: "post delete successfully",
           data: deletePost
     })
})




export const postController={
     getPostController,
     getMYPostController,
     getStatsPostController,
     getPostByIdController,
     createNewPostByIdController,
     updatePostByIdController,
     deletePostByIdController
}