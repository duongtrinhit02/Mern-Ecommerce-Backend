// index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db/connectDB.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();

// 1️⃣ CORS middleware áp dụng cho tất cả request
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://mern-ecommerce-frontend-six-phi.vercel.app",
    "https://mern-ecommerce-frontend-dusky-beta.vercel.app"
  ],
  credentials: true, // để axios withCredentials: true hoạt động
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 2️⃣ Middleware parse JSON body
app.use(express.json());

// 3️⃣ Preflight OPTIONS cho tất cả routes
app.options("*", cors());

// 4️⃣ Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

// 5️⃣ Test root
app.get("/", (req, res) => {
  res.send("Hello from backend");
});

// 6️⃣ Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
