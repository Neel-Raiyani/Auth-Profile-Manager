import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const Mongo_URI = process.env.Mongo_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(Mongo_URI!);
        console.log("MongoDB connected successfully!!!");

    } catch (error) {
        console.log("MongoDB connection failed", error);
        process.exit(1);
    }
};

export default connectDB;
