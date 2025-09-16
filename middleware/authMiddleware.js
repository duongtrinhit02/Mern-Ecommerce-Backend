import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// Middleware: Xác thực người dùng qua JWT token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Lấy token sau từ "Bearer"
      token = req.headers.authorization.split(" ")[1];

      // Giải mã token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm user trong DB (bỏ password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }

      // ✅ merge luôn isAdmin từ DB hoặc từ token
      req.user.isAdmin = req.user.isAdmin || decoded.isAdmin;

      next();
    } catch (error) {
      console.error("JWT Verify Error:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
});

// Middleware: Kiểm tra quyền admin
const admin = (req, res, next) => {
  console.log("👉 ADMIN CHECK:", req.user); // log để debug
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};

export { protect, admin };
