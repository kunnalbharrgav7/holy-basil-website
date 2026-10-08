import mongoose from "mongoose";

const stockHistorySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["restock", "sale", "adjustment", "return"],
    required: true,
  },
  quantityChanged: { type: Number, required: true },
  previousStock: { type: Number, required: true },
  newStock: { type: Number, required: true },
  note: { type: String, default: "" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    wholesalePrice: { type: Number },

    // --- INVENTORY ENHANCEMENTS ---
    inventory: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, default: 5 }, // Triggers warning when stock drops to or below this number
    stockHistory: [stockHistorySchema], // Keeps a chronological log of all stock changes
    // ------------------------------

    images: [{ type: String }],
    ingredients: [{ type: String }],
    usage: { type: String },
    featured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    seo: {
      title: { type: String },
      description: { type: String },
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
