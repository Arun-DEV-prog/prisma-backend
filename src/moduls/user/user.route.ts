import { Router, type NextFunction, type Request, type Response } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utilis/jwt";
import httpStatus from "http-status";
import { Role } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utilis/catchAsync";
import { prisma } from "../../lib/prisma";
import type { JwtPayload } from "jsonwebtoken";
import { auth } from "../../middlewares/auth";

const router = Router();

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: Role;
      };
    }
  }
}

router.post("/register", userController.creatUsers);




router.get(
  "/me",
//  (req: Request, res: Response, next: NextFunction) => {
//    try {
//      const { accessToken } = req.cookies;

//      if (!accessToken) {
//        return res.status(httpStatus.UNAUTHORIZED).json({
//          success: false,
//          statusCode: httpStatus.UNAUTHORIZED,
//          message: "Access token is missing",
//        });
//      }

     

//      const requiredRoles = [Role.user, Role.admin];
//    ;

//      if (!requiredRoles.includes(role)) {
//        return res.status(httpStatus.FORBIDDEN).json({
//          success: false,
//          statusCode: httpStatus.FORBIDDEN,
//          message: "Forbidden, You don't have permission",
//        });
//      }

      

//      next();
//    } catch (error) {
//      next(error);
//    }
//  },
 auth(Role.user, Role.admin,Role.author), userController.getMyProfile
);

 router.put('/my-profile', auth(Role.user, Role.user), userController.updateMyProfile)

export const userRoute = router;