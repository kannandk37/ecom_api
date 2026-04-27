import mongoose from 'mongoose';
import dotenv from 'dotenv';

const connectDB = async (): Promise<void> => {
    //  if (mongoose.connection.readyState === 1) return;
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

export default connectDB;