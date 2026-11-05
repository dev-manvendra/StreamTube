import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const dbConnect = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`Connection Established !! Host ${dbConnect.connection.host}`);

        
    } catch (error) {
        console.log("DataBase Connection Error !! ", error);
        process.exit(1);
    }
}

export default connectDB;