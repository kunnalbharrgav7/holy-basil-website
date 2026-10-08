import { Router } from "express";
import FranchiseStock from "../models/FranchiseStock.js";
import { auth } from "../middleware/auth.js";

const r = Router();

// Get logged-in franchise's stock inventory
r.get("/", auth, async (req, res, next) => {
  try {
    const stocks = await FranchiseStock.find({ franchiseId: req.user.id })
      .populate("product", "name slug images price wholesalePrice")
      .sort({ updatedAt: -1 });

    res.json(stocks);
  } catch (e) {
    next(e);
  }
});

// 🌟 NAYA: Franchise reduces stock via local sale/adjustment
r.patch("/:id/adjust", auth, async (req, res, next) => {
  try {
    const { quantityToSubtract, note } = req.body;
    const subQty = Number(quantityToSubtract);

    if (!subQty || subQty <= 0) {
      return res
        .status(400)
        .json({ message: "Please provide a valid quantity to subtract" });
    }

    const stockDoc = await FranchiseStock.findOne({
      _id: req.params.id,
      franchiseId: req.user.id, // Security: Ensure it belongs to logged-in franchise
    });

    if (!stockDoc) {
      return res.status(404).json({ message: "Stock item not found" });
    }

    if (stockDoc.quantity < subQty) {
      return res
        .status(400)
        .json({
          message: `Cannot reduce. Only ${stockDoc.quantity} units available in stock.`,
        });
    }

    const previousStock = stockDoc.quantity;
    stockDoc.quantity -= subQty;

    // Log history
    stockDoc.stockHistory.push({
      type: "sale",
      quantityChanged: -subQty,
      previousStock,
      newStock: stockDoc.quantity,
      note: note || "Sold locally from franchise store",
    });

    await stockDoc.save();

    // Updated stock populate karke return karenge
    const updatedStock = await FranchiseStock.findById(stockDoc._id).populate(
      "product",
      "name slug images price wholesalePrice",
    );

    res.json(updatedStock);
  } catch (e) {
    next(e);
  }
});

export default r;
