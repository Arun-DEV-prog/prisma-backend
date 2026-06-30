import { PostStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import type { ICreatePayload, IPostQuery, IupdatePostPayload } from "./post.interface"


const getallPostService=async(query: IPostQuery )=>{
   const posts= await prisma.post.findMany(
    {
        
        //filtering /exact match without And Operator
        //  where:{
        //      title:"my firest33 post",
        //      content: "Content is ready"
        //  },


        // //filtering /exact match with And Operator

        //where:{
        //    AND:[
        //        {
        //            title:"my firest33 post",
        //        },
        //        {

        //        },
        //        {
        //           content: "Content is ready"
        //        }
        //    ]
        //},


        //Searching / partial Match
        where:{
             title:{
                 contains: "my",
                 mode:"insensitive"
             }
        },





        include:{
             author: {
                 omit: {
                     password: true
                 }
             },
             comments: true
        }
    }
   )
   return posts
}


const createPost= async(payload:ICreatePayload,userId: string)=>{

    const result =await prisma.post.create({

        data:{
             ...payload,
             authorId: userId
        }
    })
    
    return result;
}


const getPostById=async(postId: string)=>{
    //const existingPost = await prisma.post.findUnique({
    //    where: { id: postId }
    //})

    //if (!existingPost) {
    //    throw new Error("Post not found")
    //}

    //const updatedPost= await prisma.post.update({
    //    where:{id: postId},
    //     data: {
    //         views:{
    //            increment: 1
    //         },
             
    //     },
    //     include :{
    //        author :{
    //            omit: {
    //                password: true,
    //            }
    //        },
    //        comments: true
    //     }
    //})
   
    //return updatedPost;

    const transactionResult= await prisma.$transaction(
        async(tx)=>{
             await prisma.post.update({
                 where:{
                     id: postId
                 },
                 data:{
                     views:{
                         increment: 1
                     }
                 },
                 
             })

            // throw new Error("Fake error")

             const post= await tx.post.findUnique({
                 where: {
                     id: postId
                 },
                 include :{
            author :{
                omit: {
                    password: true,
                }
            },
            comments: true
          }
             })

             return post;
        }
    )

    return transactionResult;
}



const getMyPost= async(authorId: string)=>{
     const result= await prisma.post.findMany({
         where: {
             authorId:authorId,
         },
         orderBy:{
             createdAT:"asc"
         },
         include :{
             comments: true,
             author: {
                 omit: {
                    password: true
                 }
             },

             _count: {
                 select:{
                     comments:true
                 }
             }
         }


     })

     return result;
}


const updatePostById=async(authorId: string, payload: IupdatePostPayload, postId:string, isAdmin: boolean)=>{
      const post= await prisma.post.findFirstOrThrow({
         where:{
              id:postId
         }
      }) 

      if(!isAdmin && post.authorId !=authorId){
         throw new Error(" You are not owner this post");
      }

      const updatedPost= await prisma.post.update({
         where:{
             id:postId
         },
         data:payload,
          include :{
             comments: true,
             author: {
                 omit: {
                    password: true
                 }
             },

             
         }


      })

      return updatedPost;

}

const deletedPostById= async(authorId: string, postId: string, isAdmin: boolean)=>{
    if(!postId){
        throw new Error("Post id not provided");
    }

    const post = await prisma.post.findUnique({
        where:{
            id: postId
        }
    })

    if(!post){
        throw new Error("Post not found");
    }

    if(!isAdmin && post.authorId !== authorId){
        throw new Error("You are not the owner of this post");
    }

    const deletedPost= await prisma.post.delete({
        where:{
            id: postId
        }
    })

    return deletedPost;
}


const  getallpostStats=async()=>{
    
    const transcationResult= await prisma.$transaction(
         async(tx)=>{
            
        const[
            totalpost,
             totalDraftPost,
             totalPublishedPost,
             totalViews

        ]  =  await  Promise.all([
                await tx.post.count(),
                 await tx.post.count({
                     where:{
                         status: PostStatus.DRAFT
                     }
                 }),
                 await tx.post.count({
                     where: {
                          status: PostStatus.PUBLISHED
                     }
                 }),

                 await tx.post.aggregate({
                     _sum: {
                         views:true
                     }
                 })
            ])


            return{
                 totalpost,
                 totalDraftPost,
             totalPublishedPost,
             totalViews 
            }


         }
    )
    


    return transcationResult;

}


export const postsService={
     getallPostService,
     createPost,
     getPostById,
     getMyPost,
     updatePostById,
     deletedPostById,
     getallpostStats
}