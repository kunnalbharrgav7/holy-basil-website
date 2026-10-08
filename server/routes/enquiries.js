import { Router } from "express";
import Enquiry from "../models/Enquiry.js";
import { auth, admin } from "../middleware/auth.js";

const r = Router();

// Public enquiry submission
r.post("/", async (req, res, next) => {
  try {
    const enquiry = await Enquiry.create(req.body);

    res.status(201).json({
      message: "Enquiry received",
      enquiry,
    });
  } catch (e) {
    next(e);
  }
});

// Admin gets all enquiries
r.get("/", auth, admin, async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find().sort({
      createdAt: -1,
    });

    res.json(enquiries);
  } catch (e) {
    next(e);
  }
});

// Admin gets one enquiry
r.get("/:id", auth, admin, async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        message: "Enquiry not found",
      });
    }

    res.json(enquiry);
  } catch (e) {
    next(e);
  }
});

// Admin updates enquiry status/notes
r.patch("/:id", auth, admin, async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const update = {};

    if (status !== undefined) {
      update.status = status;
    }

    if (notes !== undefined) {
      update.notes = notes;
    }

    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!enquiry) {
      return res.status(404).json({
        message: "Enquiry not found",
      });
    }

    res.json(enquiry);
  } catch (e) {
    next(e);
  }
});

export default r;
