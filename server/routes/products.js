import { Router } from "express";
import Product from "../models/Product.js";
import { auth, admin } from "../middleware/auth.js";

const r = Router();

r.get("/", async (req, res, next) => {
  try {
    const filter = { published: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.q) filter.name = { $regex: req.query.q, $options: "i" };
    res.json(await Product.find(filter).sort({ createdAt: -1 }));
  } catch (e) {
    next(e);
  }
});

r.get("/admin/all", auth, admin, async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json(products);
  } catch (e) {
    next(e);
  }
});

r.get("/:slug", async (req, res, next) => {
  try {
    const p = await Product.findOne({ slug: req.params.slug, published: true });
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json(p);
  } catch (e) {
    next(e);
  }
});

r.post("/", auth, admin, async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json(product);
  } catch (e) {
    next(e);
  }
});

r.put("/:id", auth, admin, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (e) {
    next(e);
  }
});

// ==========================================
// NEW: MANUALLY ADJUST STOCK & LOG HISTORY
// ==========================================
r.patch("/:id/stock", auth, admin, async (req, res, next) => {
  try {
    const { quantityChange, type, note } = req.body;
    // quantityChange can be positive (restock) or negative (correction)
    // type can be "restock", "adjustment", etc.

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const previousStock = product.inventory || 0;
    const newStock = previousStock + Number(quantityChange);

    if (newStock < 0) {
      return res.status(400).json({ message: "Stock cannot be negative" });
    }

    product.inventory = newStock;

    // Push the stock change event into your history array
    product.stockHistory.push({
      type: type || "adjustment",
      quantityChanged: Number(quantityChange),
      previousStock,
      newStock,
      note: note || "",
      updatedBy: req.user.id,
    });

    await product.save();

    res.json({
      message: "Stock adjusted successfully",
      inventory: product.inventory,
      lowStock: product.inventory <= product.lowStockThreshold,
      stockHistory: product.stockHistory,
    });
  } catch (e) {
    next(e);
  }
});

r.delete("/:id", auth, admin, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (e) {
    next(e);
  }
});

export default r;
