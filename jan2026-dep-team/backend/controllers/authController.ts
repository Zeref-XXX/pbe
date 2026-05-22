import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import crypto from "crypto";
import User from "../models/User.js";
import OtpToken from "../models/OtpToken.js";
import { sendOtpEmail } from "../utils/emailService.js";
 
 
const generateToken = (userId: string) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
        expiresIn: "30d",
    });
};
 
 
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;
       

        // Validate input
        if (!password || (!email && !username)) {
            res.status(400).json({ message: "Email/Username and password required" });
            return;
        }
 
        const user = await User.findOne({
            $or: [{ email }, { username }],
        });
        console.log("User found:", user ? { _id: user._id, email: user.email } : null);
 
        if (!user) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        console.log("Password valid:", isPasswordValid);

        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        const token = generateToken(user._id.toString());
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
 
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role,
            phone: user.phone,
            avatar: user.avatar,
            token,
        });
    } catch (error: any) {
        console.error("Login error:", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};
 
 
export const getMe = async (req: Request, res: Response): Promise<void> => {
    const user = (req as any).user;
 
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role,
            phone: user.phone,
            avatar: user.avatar,
        });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

export const updateMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const authUser = (req as any).user;

        if (!authUser?._id) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }

        const { name, phone, avatar } = req.body;

        if (!name || typeof name !== "string" || !name.trim()) {
            res.status(400).json({ message: "Name is required" });
            return;
        }

        if (!phone || typeof phone !== "string" || !phone.trim()) {
            res.status(400).json({ message: "Phone number is required" });
            return;
        }

        const user = await User.findById(authUser._id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        user.name = name.trim();
        user.phone = phone.trim();

        if (typeof avatar === "string") {
            user.avatar = avatar.trim();
        }

        await user.save();

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role,
            phone: user.phone,
            avatar: user.avatar,
        });
    } catch (error: any) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const authUser = (req as any).user;

        if (!authUser?._id) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }

        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            res.status(400).json({ message: "All password fields are required" });
            return;
        }

        if (typeof currentPassword !== "string" || typeof newPassword !== "string" || typeof confirmNewPassword !== "string") {
            res.status(400).json({ message: "Invalid password payload" });
            return;
        }

        if (newPassword.length < 6) {
            res.status(400).json({ message: "Password must be at least 6 characters long" });
            return;
        }

        if (newPassword !== confirmNewPassword) {
            res.status(400).json({ message: "New passwords do not match" });
            return;
        }

        const user = await User.findById(authUser._id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isCurrentPasswordValid) {
            res.status(400).json({ message: "Current password is incorrect" });
            return;
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
        if (isSamePassword) {
            res.status(400).json({ message: "New password must be different from the current password" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error: any) {
        console.error("Change password error:", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, username, password } = req.body;
        console.log("Register attempt:", { name, email, username, password: "***" });

        // Validate input
        if (!name || !email || !username || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        console.log("User exists:", !!userExists);

        if (userExists) {
            res.status(400).json({ message: "User already exists with that email or username" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log("Password hashed successfully");

        const user = await User.create({
            name,
            email,
            username,
            passwordHash,
        });
        console.log("User created:", { _id: user._id, email: user.email });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role,
            phone: user.phone,
        });
    } catch (error: any) {
        console.error("Register error:", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

export const logoutUser = async (_req: Request, res: Response): Promise<void> => {
    res.cookie("jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out successfully" });
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email || typeof email !== "string") {
            res.status(400).json({ message: "Email is required" });
            return;
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        // Always return 200 to avoid user enumeration
        if (!user) {
            res.status(200).json({ message: "If that email is registered, an OTP has been sent." });
            return;
        }

        // Remove any existing OTP for this email
        await OtpToken.deleteMany({ email: email.toLowerCase().trim() });

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const salt = await bcrypt.genSalt(10);
        const otpHash = await bcrypt.hash(otp, salt);

        await OtpToken.create({
            email: email.toLowerCase().trim(),
            otpHash,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        });

        await sendOtpEmail(email.toLowerCase().trim(), otp);

        res.status(200).json({ message: "If that email is registered, an OTP has been sent." });
    } catch (error: any) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Failed to send OTP. Please try again." });
    }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            res.status(400).json({ message: "Email and OTP are required" });
            return;
        }

        const record = await OtpToken.findOne({ email: email.toLowerCase().trim() });

        if (!record) {
            res.status(400).json({ message: "Invalid or expired OTP" });
            return;
        }

        if (new Date() > record.expiresAt) {
            await OtpToken.deleteOne({ _id: record._id });
            res.status(400).json({ message: "OTP has expired. Please request a new one." });
            return;
        }

        const isValid = await bcrypt.compare(otp, record.otpHash);
        if (!isValid) {
            res.status(400).json({ message: "Invalid OTP" });
            return;
        }

        // OTP verified – delete it and issue a short-lived reset token
        await OtpToken.deleteOne({ _id: record._id });

        const resetToken = jwt.sign(
            { email: email.toLowerCase().trim(), purpose: "password-reset" },
            process.env.JWT_SECRET as string,
            { expiresIn: "15m" }
        );

        res.status(200).json({ resetToken });
    } catch (error: any) {
        console.error("Verify OTP error:", error);
        res.status(500).json({ message: "Server error. Please try again." });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { resetToken, newPassword } = req.body;

        if (!resetToken || !newPassword) {
            res.status(400).json({ message: "Reset token and new password are required" });
            return;
        }

        if (newPassword.length < 6) {
            res.status(400).json({ message: "Password must be at least 6 characters long" });
            return;
        }

        let decoded: any;
        try {
            decoded = jwt.verify(resetToken, process.env.JWT_SECRET as string);
        } catch {
            res.status(400).json({ message: "Reset link has expired. Please start over." });
            return;
        }

        if (decoded.purpose !== "password-reset") {
            res.status(400).json({ message: "Invalid reset token" });
            return;
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: "Password reset successfully. You can now log in." });
    } catch (error: any) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Server error. Please try again." });
    }
};
