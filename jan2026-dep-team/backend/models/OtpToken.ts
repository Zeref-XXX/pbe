import mongoose from "mongoose";

const otpTokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    otpHash: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }, // MongoDB TTL: auto-remove once expiresAt passes
    },
});

export default mongoose.model("OtpToken", otpTokenSchema);
