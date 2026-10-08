import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
      required: true, // Category ki image ka URL (Cloudinary ya local)
    },
    description: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Category", categorySchema);
