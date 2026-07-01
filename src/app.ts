import cookieParser from "cookie-parser";
import type { Application, Request,Response,NextFunction } from "express";
import express, { request, response } from "express"
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";


import { userRoute } from "./moduls/user/user.route";
import { authRoutes } from "./moduls/auth/auth.route";
import { postRoutes } from "./moduls/posts/posts.route";
import { commentRoutes } from "./moduls/comments/comments.route";
import { golbalErrorHandler } from "./middlewares/globalErrorhandler";
import { notFound } from "./middlewares/notFound";
import { subsCriptionRoutes } from "./moduls/subscription/subscription.route";
import { auth } from "./middlewares/auth";
import { Role } from "../generated/prisma/enums";
import { stripe } from "./lib/stripe";




const app: Application=express();

app.use(cors({
     origin: config.app_url,
     Credential: true
}))

const endpointSecret = process.env.STRIPE_WEB

app.post("/api/webhook", express.raw({type:'application/json'}),(request,response)=>{
     let event = request.body;
     console.log(event,"event")
     console.log(request.headers)
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature as string,
        endpointSecret
      );
    } catch (err:any) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }
 console.log(event,"after try back")
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
})
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
app.get("/", (req: Request, res: Response)=>{
   
    
    res.send("server running ")
})


app.use("/api/users/", userRoute)

app.use('/api/auth',authRoutes)

app.use('/api/posts',postRoutes)

app.use("/api/comments",commentRoutes)
app.use("/api/subscription",auth(Role.user), subsCriptionRoutes)

app.use(notFound)

 app.use(golbalErrorHandler);




export default app;