// routes/productRoutes.js
import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from "../controllers/productsController.js";

const router = express.Router();

// ✅ Đặt các route cụ thể trước route động
router.get("/categories/list", getCategories);

// Lấy danh sách sản phẩm (tìm kiếm, sort, filter)
router.get("/", getAllProducts);

// Lấy chi tiết sản phẩm
router.get("/:id", getProductById);

// Admin: thêm sản phẩm
router.post("/", protect, admin, createProduct);

// Admin: sửa sản phẩm
router.put("/:id", protect, admin, updateProduct);

// Admin: xoá sản phẩm
router.delete("/:id", protect, admin, deleteProduct);

export default router;
