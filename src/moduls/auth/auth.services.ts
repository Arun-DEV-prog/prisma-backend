import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import type { ILoginUser } from "./auth.interface"
import jwt, { type SignOptions } from "jsonwebtoken"
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


export const AuthService={
     loginUser
}