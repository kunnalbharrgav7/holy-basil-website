import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        compareAtPrice: Number, // Asli MRP track karne ke liye
        quantity: Number,
      },
    ],
    shippingAddress: {
      name: String,
      phone: String,
      address: String,
      city: String,
      district: String,
      state: String,
      pincode: String,
    },
    billingAddress: {
      name: String,
      phone: String,
      address: String,
      city: String,
      district: String,
      state: String,
      pincode: String,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },
    mrpTotal: Number,
    discount: Number,
    subtotal: Number,
    couponCode: { type: String, default: null },
    couponDiscount: { type: Number, default: 0 },
    gst: Number,
    deliveryCharge: { type: Number, default: 0 },
    total: Number,
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
    orderType: {
      type: String,
      enum: ["B2C", "B2B"],
      default: "B2C",
    },

    // 👇 ADDED: HYPERLOCAL ROUTING FIELDS 👇
    fulfillmentType: {
      type: String,
      enum: ["FRANCHISE", "ADMIN"],
      default: "ADMIN",
    },
    fulfilledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Agar FRANCHISE fulfillmentType hai, to uski ID yahan aayegi
      default: null,
    },
    routingStage: {
      type: String,
      enum: ["EXACT_PINCODE", "CITY_FALLBACK", "ADMIN_CENTRAL"],
      default: "ADMIN_CENTRAL", // Route Track karne ke liye ki assign kaise hua
    },
    // ---------------------------------------

    royaltyPercentage: {
      type: Number,
      default: 5,
    },
    royaltyAmount: {
      type: Number,
      default: 0,
    },
    royaltyStatus: {
      type: String,
      enum: ["Pending", "Paid", "Not Applicable"], // Added "Not Applicable" for B2C orders
      default: "Pending",
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
  },
  { timestamps: true },
);

export default mongoose.model("Order", schema);
