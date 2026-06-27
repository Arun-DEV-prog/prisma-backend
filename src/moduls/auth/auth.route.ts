import { Router } from "express";
import { AuthController } from "./auth.controllers";

const router = Router();

router.post("/login", AuthController.loginUser)

router.post('/refresh-token', AuthController.refreshToken)

export const authRoutes=router;