import { Router } from "express";
import Category from "../models/Category.js";
import { auth, admin } from "../middleware/auth.js"; // Aapka auth aur admin middleware

const router = Router();

// GET all categories (Public route for Home Page & Add Product form)
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching categories" });
  }
});

// POST create category (Admin only)
router.post("/", auth, admin, async (req, res) => {
  try {
    const { name, image, description } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name, slug, image, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error creating category" });
  }
});

// PUT update category (Admin only)
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const { name, image, description } = req.body;
    const updateData = { image, description };

    if (name) {
      updateData.name = name;
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error updating category" });
  }
});

// DELETE category (Admin only)
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting category" });
  }
});

export default router;
