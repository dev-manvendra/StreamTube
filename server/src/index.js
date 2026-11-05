import dns from "node:dns"
import "dotenv/config"
import connectDB from "./db/index.js"
import app from "./App.js"

if (process.env.DNS_SERVERS) {
    dns.setServers(process.env.DNS_SERVERS.split(",").map(server => server.trim()))
}

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log("Server running at port", process.env.PORT);
        
    });

    
})
.catch( (error)=>{
    console.log("Database Connection Error!!", error);
    
})
















































// ;( async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
//         app.on("error", (error)=>{
//             console.log("connection error", error);
//         })
        
//     } catch (error) {
//         console.log("error", error);
//     }
// })()