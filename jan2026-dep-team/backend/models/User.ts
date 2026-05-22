import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
}, { _id: false });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    username: {
        type: String,
        required: true,
        unique: true
    },

    passwordHash: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },

    avatar: {
        type: String,
        default: "/no-profile-avatar.svg"
    },

    phone: {
        type: String
    },

    addresses: [addressSchema],

    // 🔗 Relationships (references)
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    },

    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }],

    bookmarks: [{
        type: Number
    }]

}, { timestamps: true });

export default mongoose.model("User", userSchema);
