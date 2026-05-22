import { Request, Response } from "express";
import Product from "../models/Product.js";

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Hide MongoDB internal fields from API responses.
    const products = await Product.find({}, { __v: 0, _id: 0 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getSingleProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    // Route params are strings; cast to number to match schema's numeric id.
    const product = await Product.findOne(
      { id: Number(req.params.id) },
      { __v: 0, _id: 0 }
    );
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const rateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = Number(req.params.id);
    const submittedRating = Number(req.body?.rating);

    // Accept ratings from 0.5 to 5.0 in 0.5 increments only.
    const isValidRating =
      Number.isFinite(submittedRating) &&
      submittedRating >= 0.5 &&
      submittedRating <= 5 &&
      Math.round(submittedRating * 2) === submittedRating * 2;

    if (!isValidRating) {
      res.status(400).json({ message: "Rating must be between 0.5 and 5 in 0.5 steps" });
      return;
    }

    const product = await Product.findOne({ id: productId });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const currentRate = Number(product.rating?.rate ?? 0);
    const currentCount = Number(product.rating?.count ?? 0);
    const nextCount = currentCount + 1;
    // Recompute weighted average and keep a stable 2-decimal response.
    const nextRate = Number(((currentRate * currentCount + submittedRating) / nextCount).toFixed(2));

    product.rating = {
      rate: nextRate,
      count: nextCount,
    };

    await product.save();

    res.json({
      message: "Rating submitted",
      rating: product.rating,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
