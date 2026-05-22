import { Request, Response } from "express";
import Cart from "../models/Cart.js";
import User from "../models/User.js";

export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    let cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      cart = await Cart.create({ user: user._id, items: [] });
      await User.findByIdAndUpdate(user._id, { cart: cart._id });
    }

    res.status(200).json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { productId, title, price, image, color, size, quantity } = req.body;

    let cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      cart = await Cart.create({ user: user._id, items: [] });
      await User.findByIdAndUpdate(user._id, { cart: cart._id });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId && item.color === color && item.size === size
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, title, price, image, color, size, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { productId, color, size, quantity } = req.body;

    let cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId && item.color === color && item.size === size
    );

    if (existingItemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(existingItemIndex, 1);
      } else {
        cart.items[existingItemIndex].quantity = quantity;
      }
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const removeFromCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    // req.body could be used for DELETE, but it's often passed via query params or a data payload in Axios
    const productId = Number(req.query.productId || req.body.productId);
    const color = req.query.color || req.body.color;
    const size = req.query.size || req.body.size;

    let cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    cart.items = cart.items.filter(
      (item) => !(item.productId === productId && item.color === color && item.size === size)
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const clearCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;

    let cart = await Cart.findOne({ user: user._id });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json(cart || { items: [] });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};
