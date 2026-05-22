import express from "express";
import { loginUser, registerUser, logoutUser, getMe, updateMe, changePassword, forgotPassword, verifyOtp, resetPassword } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);
router.patch("/me", protect, updateMe);
router.post("/change-password", protect, changePassword);

// Forgot / reset password (public routes)
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;
