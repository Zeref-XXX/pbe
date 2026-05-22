import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All cart routes require authentication

router.route("/")
  .get(getCart)
  .post(addToCart)
  .put(updateCartItem)
  .delete(removeFromCart);

router.delete("/clear", clearCart);

export default router;
