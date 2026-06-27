import type { NextFunction, Request } from "express";
import { catchAsync } from "../../utilis/catchAsync";



const getPostController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
     
})
const getStatsPostController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
     
})
const getMYPostController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
     
})
const getPostByIdController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
     
})
const createNewPostByIdController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
     
})
const updatePostByIdController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
     
})
const deletePostByIdController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
     
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