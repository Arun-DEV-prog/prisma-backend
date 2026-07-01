import Stripe from "stripe"


export const stripe= new Stripe(process.env.STRIPE_SECRET as string)
console.log(process.env.STRIPE_SECRET)