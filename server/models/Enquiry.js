import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    company: String,
    email: String,
    phone: String,
    country: String,
    productCategory: String,
    estimatedQuantity: String,
    privateLabel: Boolean,
    packagingRequirement: String,
    customFormulation: Boolean,
    targetMarket: String,
    message: String,
    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "In Discussion",
        "Quotation Sent",
        "Approved",
        "Rejected",
        "Completed",
      ],
      default: "New",
    },
    notes: String,
  },
  { timestamps: true },
);
export default mongoose.model("Enquiry", schema);
