import express from "express";
import { getBookmarks, toggleBookmark } from "../controllers/bookmarkController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // Require authentication for bookmark routes

router.route("/")
  .get(getBookmarks);

router.post("/toggle", toggleBookmark);

export default router;
