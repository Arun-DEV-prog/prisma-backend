import type { ICommentPayload } from "./comment.interface"

import { prisma } from "../../lib/prisma";



const createComments=async( payload: ICommentPayload,auhtorId: string,)=>{
        
    await prisma.post.findUniqueOrThrow({
         where:{
            id: payload.postId
         }
    })

    const result=  await prisma.comment.create({
         data:{
             ...payload,
             authorId: auhtorId,
             
         }
    })



     return result;
}


const getCommentById=async(commentId: string)=>{
    
    const comment= await prisma.comment.findFirstOrThrow({
         where:{
             id: commentId
         }
    })

     return comment
}

export const commentServices={
     createComments,
     getCommentById
}