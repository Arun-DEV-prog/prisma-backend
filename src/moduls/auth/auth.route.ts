import { Router } from "express";
import { AuthController } from "./auth.controllers";



const router=Router();

router.post("/login", AuthController.loginUser)

export const authRoutes=router;