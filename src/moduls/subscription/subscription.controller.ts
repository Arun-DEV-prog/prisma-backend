import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilis/catchAsync";

import { sendResponse } from "../../utilis/sendResponse";
import httpStatus from 'http-status';
import { subcriptionService } from "./subscription.service";


const subscriptionPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     const userId = req.user?.id;

     if (!userId) {
         throw new Error("User is not authenticated");
     }

     const checkoutSession = await subcriptionService.subScription(userId);


     sendResponse(res,{
           success: true,
           statusCode:httpStatus.OK,
           massage:" checkout successfully payment",
           data:checkoutSession

     })


})



export const subscriptionController={
     subscriptionPayment
}