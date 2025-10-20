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

app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow curl, mobile apps
    const allowedOrigins = [
      "http://localhost:5173",
      "https://mern-ecommerce-frontend-git-main-duongtrinhit02s-projects.vercel.app"
    ];
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(new Error("Not allowed by CORS"), false);
    }
    return callback(null, true);
  },
  credentials: true
}));


app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

app.get("/", (req, res) => {
  res.send("Hello");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error(" Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
