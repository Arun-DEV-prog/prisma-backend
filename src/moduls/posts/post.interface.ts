import type { PostStatus } from '../../../generated/prisma/enums';


export interface ICreatePayload{
     title: string,
     content: string,
     thumbail?: string,
     isFeatured?:boolean,
     status? : PostStatus,
     tags:string[] 


}


export interface  IupdatePostPayload{
     title?: string,
     content?: string,
     thumbail?: string,
     isFeatured?:boolean,
     status? : PostStatus,
     tags?:string[]   
}