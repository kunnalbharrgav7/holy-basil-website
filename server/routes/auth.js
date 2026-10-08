import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

const r = Router();

r.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone)
      return res
        .status(400)
        .json({ message: "Name, email, password and phone are required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 12),
      phone: phone || "",
    });

    res.status(201).json({
      token: jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
      ),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || "", // <-- FIXED: Added phone
        avatar: user.avatar || "", // <-- FIXED: Added avatar
      },
    });
  } catch (e) {
    next(e);
  }
});

r.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      token: jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
      ),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || "", // <-- FIXED: Added phone
        avatar: user.avatar || "", // <-- FIXED: Added avatar
      },
    });
  } catch (e) {
    next(e);
  }
});

r.post("/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ message: "User with this email does not exist." });

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 👇 FIX 1: Isko 'new Date()' me wrap kiya taaki DB me sahi format save ho
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const message = `You requested a password reset. Please click on the link below to reset your password:\n\n${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Token - Holy Basil Ayurveda",
        message,
      });

      res
        .status(200)
        .json({ success: true, message: "Email sent successfully." });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ message: "Email could not be sent." });
    }
  } catch (e) {
    next(e);
  }
});

r.post("/reset-password/:token", async (req, res, next) => {
  try {
    // 👇 FIX 2: '.trim()' add kiya taaki URL ka koi extra space issue na kare
    const rawToken = req.params.token.trim();

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      // 👇 FIX 3: 'new Date()' se compare kiya taaki accurately match ho
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    await User.findByIdAndUpdate(
      user._id,
      {
        password: hashedPassword,
        $unset: { resetPasswordToken: 1, resetPasswordExpire: 1 },
      },
      { new: true },
    );

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (e) {
    next(e);
  }
});

// Google Login / Signup Route
r.post("/google-login", async (req, res, next) => {
  try {
    // Phone ko yahan se hata diya hai
    const { name, email, googleId, avatar } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      const generatedPassword =
        Math.random().toString(36).slice(-10) +
        Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.hash(generatedPassword, 12);

      user = new User({
        name,
        email,
        password: hashedPassword,
        avatar: avatar || "", // 👉 Wapas Gmail ki photo save hogi
        phone: "", // 👉 Google users ke liye shuru me blank rahega
      });
      await user.save();
    } else if (avatar && user.avatar === "") {
      // Agar purane user ki photo nahi thi, toh update kar dega
      user.avatar = avatar;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({ success: true, token, user });
  } catch (e) {
    console.error("Google Auth API Error:", e);
    next(e);
  }
});

export default r;
