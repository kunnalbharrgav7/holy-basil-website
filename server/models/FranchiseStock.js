import mongoose from "mongoose";

const franchiseStockSchema = new mongoose.Schema(
  {
    franchiseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
      required: true,
    },
    // Stock history track karne ke liye (Optional but good for analytics)
    stockHistory: [
      {
        type: { type: String, enum: ["addition", "sale", "adjustment"] },
        quantityChanged: Number,
        previousStock: Number,
        newStock: Number,
        note: String,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("FranchiseStock", franchiseStockSchema);
