import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        console.log(process.env.MONGO_URL);
        const conn = await mongoose.connect(process.env.MONGO_URL);   // connect mongoose with our mongodb database
        console.log(`MongoDB Connected ${conn.connection.host}`);
    }
    catch(error){
        console.log("MongoDB connection error", error);
    }
}