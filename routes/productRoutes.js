import express from "express";
import upload from "../middleware/upload.js";
import { getProducts, getProduct, createProduct,updateProduct,deleteProduct  } from "../controllers/productController.js";
import { protect, admin } from "../middleware/auth.js";
const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);

// create product (admin only)
router.post(
  "/create",
  protect,
  admin,
  upload.single("image"),
  createProduct
);

router.put(
  "/update/:id",
  protect,
  admin,
  upload.single("image"),
  updateProduct
);
router.delete(
  "/delete/:id",
  protect,
  admin,
  deleteProduct
);
export default router;
