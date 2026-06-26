import { Router, type NextFunction, type Request, type Response } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utilis/jwt";
import httpStatus from "http-status";
import { Role } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utilis/catchAsync";
import { prisma } from "../../lib/prisma";
import type { JwtPayload } from "jsonwebtoken";

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

const auth=(...requiredRoles: Role[]) => {
  return catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : authHeader;
    const token = req.cookies?.accessToken || tokenFromHeader;

    if(!token){
      throw new Error("You are not logged in, Please log in to access this")
    }

    let verifyToken;
    try {
      verifyToken = jwtUtils.verifyToken(token, "aaaaaaaeind");
    } catch (error) {
      throw new Error("Invalid or expired token")
    }

    if(typeof verifyToken === "string" || !verifyToken){
      throw new Error("Invalid token")
    }

    const { email, name, id } = verifyToken as JwtPayload;

    const user = await prisma.user.findUnique({
      where: {
        id: String(id),
        email: String(email),
        name: String(name),
      },
    });

    if(!user){
      throw new Error("Not found")
    }

    const normalizedRole = String(user.role ?? "").toLowerCase() as Role;
    const normalizedRequiredRoles = requiredRoles.map((item) => String(item).toLowerCase()) as Role[];

    if(!normalizedRequiredRoles.includes(normalizedRole)){
      throw new Error("Forbidden")
    }

    if(!user.activeStatus){
      throw new Error("contact owner")
    }

    req.user = {
      email: user.email,
      name: user.name,
      id: user.id,
      role: normalizedRole,
    };

    next();
  })
}


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
 auth(Role.user, Role.admin), userController.getMyProfile
);

export const userRoute = router;