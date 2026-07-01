import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilis/catchAsync";


const subscriptionPayment= catchAsync(async( req:Request, res: Response, next: NextFunction)=>{
     
})



export const subscriptionController={
     subscriptionPayment
}