import { Router } from "express";
import Coupon from "../models/Coupon.js";

const r = Router();

r.post("/apply-coupon", async (req, res, next) => {
  try {
    // 👇 Ab hum cartItems bhi le rahe hain
    const { code, cartItems } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupon)
      return res
        .status(404)
        .json({ message: "Invalid or inactive coupon code." });
    if (new Date() > coupon.expiryDate)
      return res.status(400).json({ message: "This coupon has expired." });

    // 👇 Eligible Total calculate karne ka logic 👇
    let eligibleTotal = 0;
    let cartTotal = 0;
    let hasApplicableProduct = false;

    // Convert ObjectIds to strings for easy comparison
    const applicableIds = coupon.applicableProducts.map((id) => id.toString());

    cartItems.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      cartTotal += itemTotal;

      // Agar coupon me products select kiye gaye hain
      if (applicableIds.length > 0) {
        if (applicableIds.includes(item.product.toString())) {
          eligibleTotal += itemTotal;
          hasApplicableProduct = true;
        }
      } else {
        // Agar koi product select nahi hai, toh sab par apply hoga
        eligibleTotal += itemTotal;
        hasApplicableProduct = true;
      }
    });

    if (applicableIds.length > 0 && !hasApplicableProduct) {
      return res
        .status(400)
        .json({
          message:
            "This coupon is not applicable on the selected products in your cart.",
        });
    }

    if (eligibleTotal < coupon.minOrderAmount)
      return res.status(400).json({
        message: `Minimum eligible amount for this coupon is ₹${coupon.minOrderAmount}`,
      });

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = Math.round((eligibleTotal * coupon.discountValue) / 100);
    } else {
      discountAmount = Number(coupon.discountValue);
    }

    if (discountAmount > eligibleTotal) discountAmount = eligibleTotal;

    res.status(200).json({
      success: true,
      discountAmount,
      finalTotal: cartTotal - discountAmount,
      message: "Coupon applied successfully!",
    });
  } catch (error) {
    next(error);
  }
});

// 👇 Naye Admin Routes (Inko /apply-coupon ke neeche add karein) 👇

// 1. Get all coupons (Admin View)
r.get("/coupons/all", async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    next(error);
  }
});

// 2. Create new coupon
r.post("/coupons/create", async (req, res, next) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      expiryDate,
      applicableProducts,
    } = req.body;
    const newCoupon = await Coupon.create({
      code,
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount) || 0,
      expiryDate,
      applicableProducts: applicableProducts || [], // Save selected IDs
    });
    res
      .status(201)
      .json({
        success: true,
        coupon: newCoupon,
        message: "Coupon created successfully!",
      });
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({ message: "Coupon code already exists!" });
    next(error);
  }
});

// 3. Toggle Active/Inactive Status
r.put("/coupons/toggle/:id", async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.status(200).json({
      success: true,
      message: `Coupon is now ${coupon.isActive ? "Active" : "Inactive"}`,
    });
  } catch (error) {
    next(error);
  }
});

// 4. Delete Coupon
r.delete("/coupons/:id", async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default r;
