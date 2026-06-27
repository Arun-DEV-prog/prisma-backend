import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import type { ILoginUser } from "./auth.interface"
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken"
import { jwtUtils } from "../../utilis/jwt";



const loginUser=async (payload:ILoginUser)=>{
  const {email,password}=payload;

  const  user= await prisma.user.findUniqueOrThrow({
     where: {email}
  })
  
  const isPasswordMatch= await bcrypt.compare(password, user.password)

  if(!isPasswordMatch){
     throw new Error("password not matched")
  }


  const jwtPayload={
     id: user.id,
     email: user.email,
     role: user.role,
     name: user.name
  }



  const accessToken=jwtUtils.createToken(
    jwtPayload,
    "aaaaaaaeind",
    { expiresIn: "7d" }
  )

 const refressToken=jwtUtils.createToken(
    jwtPayload,
    "djjjjjjj",
    { expiresIn: "14d" }
 )

 

 return{
    user,
     accessToken,
     refressToken
 };

}



const refressToken= async(refreshToken: string)=>{
         const verifiedRefreshToken= jwtUtils.verifyToken(refreshToken,"djjjjjjj") ;
         
          if(!verifiedRefreshToken.success){
             throw new Error(verifiedRefreshToken.error);
          }

          const {id}=verifiedRefreshToken.data as JwtPayload;

          const user= await prisma.user.findUniqueOrThrow({
             where:{
               id
             }
          })


          const jwtPayload={
             id,
             name: user.name,
             email: user.email,
             role: user.role
          }


          const accessToken= jwtUtils.createToken(
            jwtPayload,
            "aaaaaaaeind",
            { expiresIn: "14d" }
            
         );


         return {accessToken}
}


export const AuthService={
     loginUser,
     refressToken
}