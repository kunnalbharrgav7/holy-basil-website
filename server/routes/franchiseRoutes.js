import express from "express";
import bcrypt from "bcryptjs";
import FranchiseApplication from "../models/FranchiseApplication.js";
import User from "../models/User.js";

const router = express.Router();

// 1. Submit Franchise Application (Public Route)
router.post("/apply", async (req, res) => {
  try {
    const { name, email, phone, state, city, budget, spaceAvailable } =
      req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !state ||
      !city ||
      !budget ||
      !spaceAvailable
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields." });
    }

    const newApplication = new FranchiseApplication({
      name,
      email,
      phone,
      state,
      city,
      budget,
      spaceAvailable,
    });

    await newApplication.save();
    res.status(201).json({
      success: true,
      message: "Franchise application submitted successfully!",
    });
  } catch (error) {
    console.error("Error submitting franchise application:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});

// 2. Get All Franchise Requests (Admin Only)
router.get("/admin/franchise-requests", async (req, res) => {
  try {
    const applications = await FranchiseApplication.find().sort({
      createdAt: -1,
    });
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching franchise requests:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 3. Update Status - Accept / Reject & Manage Account Role (Admin Only)
router.put("/admin/franchise-status/:id", async (req, res) => {
  try {
    const { status, franchiseTier } = req.body; // 🌟 Accept franchiseTier from request body

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    // 1. Franchise application ka status update karo
    const updatedApp = await FranchiseApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!updatedApp) {
      return res.status(404).json({ message: "Application not found." });
    }

    // 2. LOGIC: Role Upgrade (Approve) & Role Downgrade (Reject)
    let accountMessage = "";

    if (status === "Approved") {
      let existingUser = await User.findOne({ email: updatedApp.email });

      if (existingUser) {
        // Agar user admin hai, toh downgrade mat karna, sirf customer ko franchise banana
        if (existingUser.role !== "admin") {
          existingUser.role = "franchise";
          // 🌟 Agar admin ne specific tier diya hai toh update karo, warna existing retain karo
          if (franchiseTier) {
            existingUser.franchiseTier = franchiseTier;
          }
          await existingUser.save();
          accountMessage = "User role upgraded to Franchise.";
        }
      } else {
        // Naya account banao
        const defaultPassword = "HolyBasil@123";
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);

        const newUser = new User({
          name: updatedApp.name,
          email: updatedApp.email,
          password: hashedPassword,
          role: "franchise",
          franchiseTier: franchiseTier || "standard", // 🌟 Set tier during account creation
        });

        await newUser.save();
        accountMessage = "New franchise account created.";
      }
    }
    // 🌟 Agar Reject kiya, toh role wapas Customer karo
    else if (status === "Rejected") {
      let existingUser = await User.findOne({ email: updatedApp.email });

      // Check karo ki user exist karta hai aur uska role 'franchise' hai
      if (existingUser && existingUser.role === "franchise") {
        existingUser.role = "customer"; // Downgrade to customer
        await existingUser.save();
        accountMessage = "Franchise access revoked. Role reverted to Customer.";
      }
    }

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}. ${accountMessage}`,
      updatedApp,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
