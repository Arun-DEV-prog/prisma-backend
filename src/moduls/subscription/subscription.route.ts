import { Router } from "express";
import { subscriptionController } from "./subscription.controller";


const router=Router();

router.post("/checkout",subscriptionController.subscriptionPayment)



export const subsCriptionRoutes=router