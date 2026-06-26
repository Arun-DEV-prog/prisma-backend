import type { NextFunction, Request, Response } from "express";
import type { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utilis/catchAsync";
import { jwtUtils } from "../utilis/jwt";
import { prisma } from "../lib/prisma";
import type { JwtPayload } from "jsonwebtoken";

export const auth=(...requiredRoles: Role[]) => {
  return catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : authHeader;
    const token = req.cookies?.accessToken || tokenFromHeader;

    if(!token){
      throw new Error("You are not logged in, Please log in to access this")
    }

    const verifyToken = jwtUtils.verifyToken(token, "aaaaaaaeind");

    if(!verifyToken.success || !verifyToken.data){
      throw new Error("Invalid or expired token")
    }

    const { email, name, id } = verifyToken.data as JwtPayload;

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