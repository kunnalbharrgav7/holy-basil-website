import { Router } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { auth, admin } from "../middleware/auth.js";

const r = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// ==========================================
// 1. PRODUCT IMAGES (Admins Only)
// ==========================================
r.post(
  "/image",
  auth,
  admin,
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "holy-basil-ayurveda/products",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        stream.end(req.file.buffer);
      });

      res.status(201).json({
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      next(error);
    }
  },
);

// ==========================================
// 2. USER AVATARS (All Logged-in Users)
// ==========================================
r.post(
  "/avatar",
  auth, // Notice: No 'admin' middleware here!
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "holy-basil-ayurveda/avatars", // Saves to a different folder
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        stream.end(req.file.buffer);
      });

      res.status(201).json({
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default r;
