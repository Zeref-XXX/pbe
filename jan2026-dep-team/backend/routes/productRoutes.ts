import express from "express";
import { getAllProducts, getSingleProduct, rateProduct } from "../controllers/productController.js";

const router = express.Router();

// Returns the complete product catalog.
router.get("/", getAllProducts);
// Returns one product by numeric id from route params.
router.get("/:id", getSingleProduct);
// Submits a new rating for a product and updates aggregate rating data.
router.post("/:id/rating", rateProduct);

export default router;
