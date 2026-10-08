import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },

    avatar: { type: String, default: "" },

    role: {
      type: String,
      enum: ["customer", "admin", "franchise"],
      default: "customer",
    },

    // 👇 ADDED FOR HYPERLOCAL ROUTING (FRANCHISE ONLY) 👇
    serviceablePincodes: {
      type: [String],
      default: [], // e.g., ["452001", "452010"]
    },
    storeCity: {
      type: String,
      trim: true,
      default: "", // e.g., "Indore"
    },
    storeDistrict: {
      type: String,
      trim: true,
      default: "",
    },
    // ----------------------------------------------------

    franchiseTier: {
      type: String,
      enum: ["standard", "gold", "platinum"],
      default: "standard",
    },
    customRoyaltyRate: {
      type: Number,
      default: null,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true },
);

export default mongoose.model("User", schema);
