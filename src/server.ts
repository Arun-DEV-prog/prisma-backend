import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";


 const PORT=config.port
async function main() {
     try{
       
        await prisma.$connect();
          console.log("databse connect")
       app.listen(5000,()=>{
          console.log(`server is running on port 5000 ${PORT}`)
       })
     }catch(error){
        console.error("Error starting the server", error)
        await prisma.$disconnect();
        process.exit(1);

     }
}

main();