import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("MONGO_URI is not defined in environment variables");
        throw new Error("Missing MONGO_URI");
    }

    try {
        await mongoose.connect(uri);
        console.log("DB Connected");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message || err);
        throw err;
    }
};