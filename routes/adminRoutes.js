// routes/adminRoutes.js
import express from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/////////////////////////////////////////
// USER MANAGEMENT - Admin Only
/////////////////////////////////////////

// @desc    Lấy danh sách tất cả user (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
router.get("/users", protect, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("❌ Lỗi lấy users:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

/////////////////////////////////////////
// PRODUCT MANAGEMENT - Admin Only
/////////////////////////////////////////

// @desc    Lấy tất cả sản phẩm (admin)
// @route   GET /api/admin/products
// @access  Private/Admin
router.get("/products", protect, admin, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("❌ Lỗi lấy products:", error.message);
    res.status(500).json({ message: "Lỗi server khi lấy sản phẩm" });
  }
});

// @desc    Tạo sản phẩm mới
// @route   POST /api/admin/products
// @access  Private/Admin
router.post("/products", protect, admin, async (req, res) => {
  try {
    const product = new Product(req.body);
    const created = await product.save();
    res.status(201).json(created);
  } catch (error) {
    console.error("❌ Lỗi tạo sản phẩm:", error.message);
    res.status(400).json({ message: "Tạo sản phẩm thất bại" });
  }
});

// @desc    Cập nhật sản phẩm
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
router.put("/products/:id", protect, admin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(updated);
  } catch (error) {
    console.error("❌ Lỗi cập nhật sản phẩm:", error.message);
    res.status(400).json({ message: "Cập nhật thất bại" });
  }
});

// @desc    Xóa sản phẩm
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
router.delete("/products/:id", protect, admin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json({ message: "Đã xóa sản phẩm" });
  } catch (error) {
    console.error("❌ Lỗi xoá sản phẩm:", error.message);
    res.status(500).json({ message: "Xóa thất bại" });
  }
});

export default router;
