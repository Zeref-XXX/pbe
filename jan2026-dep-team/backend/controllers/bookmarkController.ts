import { Request, Response } from "express";
import User from "../models/User.js";

// @desc    Get user bookmarks
// @route   GET /bookmarks
// @access  Private
export const getBookmarks = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById((req as any).user._id);

    if (user) {
      res.json(user.bookmarks || []);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Toggle a bookmark (Add if not exists, remove if exists)
// @route   POST /bookmarks/toggle
// @access  Private
export const toggleBookmark = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.body;
    const user = await User.findById((req as any).user._id);

    if (user) {
      const index = user.bookmarks.indexOf(productId);
      
      if (index > -1) {
        // Remove if exists
        user.bookmarks.splice(index, 1);
      } else {
        // Add if it doesn't exist
        user.bookmarks.push(productId);
      }
      
      const updatedUser = await user.save();
      res.json(updatedUser.bookmarks);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
