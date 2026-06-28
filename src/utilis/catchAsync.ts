import type { NextFunction, Request, Response } from "express"
import httpStatus from 'http-status';

 export  const catchAsync=(fn: RequestHandler)=>{

     return async (req: Request, res: Response,next: NextFunction)=>{
         try{
             await fn(req, res,next)
         }catch(error){
               console.log(error)
               const message = (error as Error).message
               const isNotFound = /not found/i.test(message)
               res.status(isNotFound ? httpStatus.NOT_FOUND : httpStatus.INTERNAL_SERVER_ERROR).json({
                    success:false,
                    stutusCode: isNotFound ? httpStatus.NOT_FOUND : httpStatus.INTERNAL_SERVER_ERROR,
                    massage: message,
                    error: message
               })
         }
     }
}
