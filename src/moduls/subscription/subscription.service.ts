import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"


const subScription= async(userId: string)=>{
    console.log("servie",userId)
   const transctionResult = await prisma.$transaction(async(tx)=>{
      const user= await tx.user.findUniqueOrThrow({
           where:{
                id: userId
           },
           include:{
            subscription: true
           }
      })

     // old subscriper
      let stripeCustomerId=user.subscription?.stripeCustomerId
   
//   new 
       if(!stripeCustomerId){
            const customer = await stripe.customers.create({
           email: user.email,
           name: user.name,
           metadata: {userId: user.id}
      })

     stripeCustomerId=customer.id

       }
          console.log("custmer", stripeCustomerId)

       const session = await stripe.checkout.sessions.create({
           line_items: [
               {
                   price: process.env.STIPE_PRODUCT_ID as string,
                   quantity: 1,
               },
           ],
           mode: "subscription",
           customer: stripeCustomerId,
           payment_method_types: ['card'],
           success_url: `${process.env.APP_URL}/premium/success=true`,
           cancel_url: `${process.env.APP_URL}/premium/success=true`,
           metadata: { userId: user.id },
       });
    
        return session.url

     
   })


   return {
      paymentURL:transctionResult
   }

}

export const subcriptionService={
     subScription
}