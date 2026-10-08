import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import enquiryRoutes from "./routes/enquiries.js";
import orderRoutes from "./routes/orders.js";
import uploadRoutes from "./routes/uploads.js";
import userRoutes from "./routes/users.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import franchiseRoutes from "./routes/franchiseRoutes.js";
import couponRoutes from "./routes/coupon.js";
import franchiseStockRoutes from "./routes/franchiseStock.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://holy-basil-frontend.onrender.com",
];

// console.log("Allowed CORS origins:", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an origin
      // (Postman, server-to-server requests, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },

    credentials: true,

    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(helmet());

app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Holy Basil Ayurveda API is running",
  });
});

app.get("/api/health", (req, res) =>
  res.json({ ok: true, service: "Holy Basil Ayurveda API is healthy" }),
);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/franchise", franchiseRoutes);
app.use("/api", couponRoutes);
app.use("/api/franchise-stock", franchiseStockRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server error" });
});

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    app.listen(port, () => {
      console.log(`API running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    console.error("Server was not started.");
    process.exit(1);
  }
};

startServer();

// if (process.env.MONGODB_URI) {
//   mongoose
//     .connect(process.env.MONGODB_URI)
//     .then(() => {
//       console.log("MongoDB connected successfully");

//       app.listen(port, () =>
//         console.log(`API running on http://localhost:${port}`),
//       );
//     })
//     .catch((err) => {
//       console.error("MongoDB connection failed:", err.message);
//       app.listen(port, () =>
//         console.log(`API running without DB on http://localhost:${port}`),
//       );
//     });
// } else {
//   console.log("MONGODB_URI is not defined in .env");

//   app.listen(port, () =>
//     console.log(`API running without DB on http://localhost:${port}`),
//   );
// }
