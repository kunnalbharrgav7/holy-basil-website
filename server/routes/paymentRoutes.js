import { Router } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { auth } from "../middleware/auth.js"; // Check karein ki auth middleware ka path yahi hai

const router = Router();

// 1. Create Razorpay Order
router.post("/create-order", auth, async (req, res) => {
  try {
    // Razorpay instance initialize karein
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Order create karne ke options
    const options = {
      amount: Math.round(req.body.amount * 100), // Razorpay paise me amount leta hai, isliye * 100
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: "Error creating Razorpay order" });
    }

    res.json(order);
  } catch (error) {
    console.error("Razorpay Create Order Error:", error);
    res.status(500).json({ message: "Server error while creating order" });
  }
});

// 2. Verify Payment Signature
router.post("/verify", auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Create signature to verify if the payment is authentic
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error("Razorpay Verify Error:", error);
    res
      .status(500)
      .json({ message: "Server error during payment verification" });
  }
});

export default router;
