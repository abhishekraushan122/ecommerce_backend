import express from "express";
import { addToCart,getCart,removeFromCart } from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.get("/", getCart);
router.post("/add-cart",protect,addToCart);
router.delete("/:id", protect, removeFromCart)
export default router;
