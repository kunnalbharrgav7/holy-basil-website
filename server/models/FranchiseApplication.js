import mongoose from "mongoose";

const franchiseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    state: { type: String, required: true }, // Naya field
    city: { type: String, required: true },
    budget: { type: String, required: true },
    spaceAvailable: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("FranchiseApplication", franchiseSchema);
