import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI is not defined");

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // tránh treo khi không kết nối được
      ssl: true,                      // bắt buộc với Atlas
      tlsAllowInvalidCertificates: true, // ⚠️ chỉ dùng khi DEV, fix lỗi SSL
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};
