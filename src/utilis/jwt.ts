import type { JwtPayload, SignOptions } from "jsonwebtoken"
import jwt from 'jsonwebtoken';


const createToken=(payload: JwtPayload, secret: string, options: SignOptions)=>{
    const token=jwt.sign(payload, secret, options);
    return token;
}


const verifyToken=(token: string, secret: string)=>{
      try{
         const verifiedToken=jwt.verify(token, secret);

     return{
         success: true,
         data: verifiedToken
     }

      }catch(error: any){
          return{
             success: false,
             error: error.massage
          }
      }
}

export const jwtUtils={
     createToken,
     verifyToken
}