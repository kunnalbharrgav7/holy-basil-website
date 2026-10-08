import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { auth, admin } from "../middleware/auth.js";

const r = Router();

// Get current logged-in user's profile
r.get("/me", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (e) {
    next(e);
  }
});

// Update current logged-in user's profile
r.patch("/me", auth, async (req, res, next) => {
  try {
    // 🌟 NAYA: Added storeCity, storeDistrict, and serviceablePincodes to destructuring
    const {
      name,
      phone,
      avatar,
      storeCity,
      storeDistrict,
      serviceablePincodes,
      currentPassword,
      newPassword,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    // 👇 ADDED: Franchise Geography Routing Fields 👇
    if (storeCity !== undefined) user.storeCity = storeCity;
    if (storeDistrict !== undefined) user.storeDistrict = storeDistrict;
    if (serviceablePincodes !== undefined)
      user.serviceablePincodes = serviceablePincodes;
    // ---------------------------------------------

    // Only touch password if the user explicitly wants to change it
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          message: "Current password is required to set a new password",
        });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      user.password = await bcrypt.hash(newPassword, 12);
    }

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json(safeUser);
  } catch (e) {
    next(e);
  }
});

// Admin gets all users
r.get("/admin/users", auth, admin, async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (e) {
    next(e);
  }
});

// Admin updates franchise partner tier & custom rate
r.patch("/admin/users/:id/tier", auth, admin, async (req, res, next) => {
  try {
    const { franchiseTier, customRoyaltyRate } = req.body;

    const updateData = {};
    if (franchiseTier) updateData.franchiseTier = franchiseTier;
    if (customRoyaltyRate !== undefined) {
      updateData.customRoyaltyRate =
        customRoyaltyRate === "" ? null : Number(customRoyaltyRate);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "Franchise tier updated successfully",
      user: updatedUser,
    });
  } catch (e) {
    next(e);
  }
});

export default r;
