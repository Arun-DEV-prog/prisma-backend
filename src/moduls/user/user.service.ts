import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import type { RegisterUsrPayload } from "./user.interface";
import type { NextFunction } from "express";



const registerUserIntoDB= async(paylod:RegisterUsrPayload)=>{

    const {name,email,password,profilePhoto}=paylod
    const isUserExits= await prisma.user.findUnique({
         where: {email}
    })

    if(isUserExits){
         throw new Error ("user already exits");
    }

    const hashPassword= await bcrypt.hash(password, Number(config.Bcrypt_salt_round))
    
    const createUser= await prisma.user.create({
        data:{
             name,
             email,
             password:hashPassword,
             profile:{
                  create:{
                     profilePhoto
                  }
             }
        }
    })

//    await prisma.profie.create({
//         data:{
//            userId:createUser.id,
//            profilePhoto
//         }
//    })

    const user=await prisma.user.findUnique({
     where:{
           id: createUser.id,
           email: createUser.email || email
     },
     omit:{
           password: true
     },
     include: {
           profile: true
     }
    })

    return user;

}

const getProfilemyDB= async(userId: string)=>{
    const user= await prisma.user.findUnique({
         where: {id : userId},
         omit : {password : true},
         include: {profile : true}
    })

    return user;
      
}


const udatemyProfile=async(userId: string, payload: any)=>{
     const {name, email, profilePhoto, bio}=payload;

     const updateUser=await prisma.user.update({
         where:{id: userId},
         data:{
             name,
             email,
             profile:{
                 update:{
                     profilePhoto,
                     bio
                 }
             }
         },
         omit:{
             password: true,
         },
         include:{
            profile: true
         }
     })

     return updateUser;
}

export const userService={
    registerUserIntoDB,
    getProfilemyDB,
    udatemyProfile
}