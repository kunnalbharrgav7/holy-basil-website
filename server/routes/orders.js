import { Router } from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { auth, admin } from "../middleware/auth.js";
import User from "../models/User.js";
import FranchiseStock from "../models/FranchiseStock.js";
import { resolveFulfillmentPartner } from "../utils/orderRouter.js";

const r = Router();

// Customer or Franchise creates an order
r.post("/", auth, async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    let calculatedSubtotal = 0;
    let calculatedMRP = 0;
    const isFranchise = req.user.role === "franchise";

    const verifiedItems = [];
    const productsData = []; // To hold product docs for Admin stock check if needed

    // 1. Fetch & Verify Products + Calculate Secure Pricing
    for (const item of items) {
      const productId = item.product || item._id;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: `Product not found` });
      }

      productsData.push({
        productDoc: product,
        requestedQty: Number(item.quantity),
      });

      const qty = Number(item.quantity);
      const dbPrice = product.price;
      const dbWholesalePrice = product.wholesalePrice;
      const dbCompareAtPrice = product.compareAtPrice;

      const effectivePrice =
        isFranchise && dbWholesalePrice ? dbWholesalePrice : dbPrice;
      const originalPrice = dbCompareAtPrice || dbPrice;

      calculatedSubtotal += effectivePrice * qty;
      calculatedMRP += originalPrice * qty;

      verifiedItems.push({
        product: product._id,
        name: product.name,
        price: effectivePrice,
        compareAtPrice: originalPrice,
        quantity: qty,
      });
    }

    // 🌟 2. HYPERLOCAL ROUTING LOGIC (Only for B2C Customers)
    let fulfillmentType = "ADMIN";
    let fulfilledBy = null;
    let routingStage = "ADMIN_CENTRAL";

    if (!isFranchise) {
      // It's a Customer! Let's find the nearest franchise with stock
      const routeInfo = await resolveFulfillmentPartner(
        shippingAddress,
        verifiedItems,
      );
      fulfillmentType = routeInfo.fulfillmentType;
      fulfilledBy = routeInfo.fulfilledBy;
      routingStage = routeInfo.routingStage;
    }

    // 🌟 3. STOCK VALIDATION (Admin vs Franchise)
    if (fulfillmentType === "ADMIN" || isFranchise) {
      // If Admin is fulfilling (or it's a B2B order), check Admin's main inventory
      for (const p of productsData) {
        if (p.productDoc.inventory < p.requestedQty) {
          return res.status(400).json({
            message: `Insufficient stock for ${p.productDoc.name}. Only ${p.productDoc.inventory} left in Central Warehouse.`,
          });
        }
      }
    }
    // If fulfillmentType === "FRANCHISE", the router already verified they have stock!

    // Calculate Final Totals
    const calculatedDiscount = calculatedMRP - calculatedSubtotal;
    const calculatedGst = Math.round(calculatedSubtotal * 0.18);
    const calculatedDeliveryCharge = 0;
    const calculatedFinalTotal =
      calculatedSubtotal + calculatedGst + calculatedDeliveryCharge;

    // Calculate Royalty (Only for B2B)
    let royaltyPercentage = 0;
    let royaltyAmount = 0;

    if (isFranchise) {
      const franchiseUser = await User.findById(req.user.id);
      if (franchiseUser && franchiseUser.customRoyaltyRate != null) {
        royaltyPercentage = franchiseUser.customRoyaltyRate;
      } else {
        const tier = franchiseUser?.franchiseTier || "standard";
        if (tier === "platinum") royaltyPercentage = 3;
        else if (tier === "gold") royaltyPercentage = 4;
        else royaltyPercentage = 5;
      }
      royaltyAmount = Math.round(
        (calculatedFinalTotal * royaltyPercentage) / 100,
      );
    }

    // 4. Create Order Object
    const order = await Order.create({
      items: verifiedItems,
      shippingAddress,
      billingAddress: req.body.billingAddress || shippingAddress,
      paymentMethod,
      mrpTotal: calculatedMRP,
      discount: calculatedDiscount,
      subtotal: calculatedSubtotal,
      gst: calculatedGst,
      deliveryCharge: calculatedDeliveryCharge,
      total: calculatedFinalTotal,
      paymentStatus: req.body.paymentStatus || "Pending",
      orderStatus: "Pending",
      user: req.user.id,
      orderType: isFranchise ? "B2B" : "B2C",
      royaltyPercentage,
      royaltyAmount,
      royaltyStatus: isFranchise ? "Pending" : "Not Applicable",

      // 👇 Added Hyperlocal Fields
      fulfillmentType: isFranchise ? "ADMIN" : fulfillmentType,
      fulfilledBy: fulfilledBy,
      routingStage: isFranchise ? "ADMIN_CENTRAL" : routingStage,
    });

    // 🌟 5. DEDUCT INVENTORY BASED ON FULFILLMENT TYPE
    if (fulfillmentType === "FRANCHISE" && !isFranchise) {
      // 🟢 B2C Order Fulfilled By Franchise: Deduct from FranchiseStock
      for (const item of verifiedItems) {
        await FranchiseStock.findOneAndUpdate(
          { franchiseId: fulfilledBy, product: item.product },
          {
            $inc: { quantity: -item.quantity },
            $push: {
              stockHistory: {
                type: "sale",
                quantityChanged: -item.quantity,
                note: `Auto-deducted for B2C Local Order #${order._id.toString().slice(-6).toUpperCase()}`,
                updatedBy: req.user.id,
              },
            },
          },
        );
      }
    } else {
      // 🔵 B2B Order OR Admin-Fulfilled B2C Order: Deduct from Central Product Inventory
      for (const p of productsData) {
        const previousStock = p.productDoc.inventory || 0;
        const newStock = Math.max(0, previousStock - p.requestedQty);

        p.productDoc.inventory = newStock;
        p.productDoc.stockHistory.push({
          type: "sale",
          quantityChanged: -p.requestedQty,
          previousStock,
          newStock,
          note: `Sold via ${order.orderType} Order #${order._id.toString().slice(-6).toUpperCase()}`,
          updatedBy: req.user.id,
        });
        await p.productDoc.save();
      }
    }

    res.status(201).json(order);
  } catch (e) {
    next(e);
  }
});

// Customer gets their own orders
r.get("/mine", auth, async (req, res, next) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (e) {
    next(e);
  }
});

// 👇 NAYA ROUTE: Franchise ke paas jo B2C customer orders aaye hain unhe fetch karne ke liye
r.get("/assigned", auth, async (req, res, next) => {
  try {
    if (req.user.role !== "franchise") {
      return res
        .status(403)
        .json({ message: "Only franchises can view assigned orders" });
    }

    const assignedOrders = await Order.find({
      fulfilledBy: req.user.id,
      orderType: "B2C",
    })
      .populate("user", "name email") // Customer details
      .populate("items.product", "name images")
      .sort({ createdAt: -1 });

    res.json(assignedOrders);
  } catch (e) {
    next(e);
  }
});

// 🌟 NAYA: Admin gets all franchise royalty summaries / tracking data
r.get("/royalties/summary", auth, admin, async (req, res, next) => {
  try {
    const franchiseOrders = await Order.find({ orderType: "B2B" })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const totalRoyaltyGenerated = franchiseOrders.reduce(
      (sum, o) => sum + (o.royaltyAmount || 0),
      0,
    );
    const totalPendingRoyalty = franchiseOrders
      .filter((o) => o.royaltyStatus === "Pending")
      .reduce((sum, o) => sum + (o.royaltyAmount || 0), 0);

    res.json({
      totalRoyaltyGenerated,
      totalPendingRoyalty,
      orders: franchiseOrders,
    });
  } catch (e) {
    next(e);
  }
});

// Admin gets all orders
r.get("/", auth, admin, async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name slug images")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (e) {
    next(e);
  }
});

// Admin, Customer, or Assigned Franchise gets a single order
r.get("/:id", auth, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name slug images");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // 🌟 SECURITY CHECK UPDATED 🌟
    // Allow access if:
    // 1. User is admin
    // 2. User is the customer who placed the order
    // 3. User is the franchise assigned to fulfill the order
    const isAdmin = req.user.role === "admin";
    const isCustomer = order.user && order.user._id.toString() === req.user.id;
    const isAssignedFranchise =
      order.fulfilledBy && order.fulfilledBy.toString() === req.user.id;

    if (!isAdmin && !isCustomer && !isAssignedFranchise) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (e) {
    next(e);
  }
});

// Admin or Assigned Franchise updates order status
r.patch("/:id/status", auth, async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, royaltyStatus } = req.body;

    // 🌟 1. Pehle order find karo
    const existingOrder = await Order.findById(req.params.id);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🌟 2. SECURITY CHECK: Authorization Check
    const isAdmin = req.user.role === "admin";
    const isAssignedFranchise =
      req.user.role === "franchise" &&
      existingOrder.fulfilledBy?.toString() === req.user.id;

    if (!isAdmin && !isAssignedFranchise) {
      return res.status(403).json({
        message: "Not authorized to update this order's status",
      });
    }

    // 🌟 3. Check transition for B2B delivery (Franchise inventory stock addition)
    const isTransitioningToDelivered =
      orderStatus === "Delivered" && existingOrder.orderStatus !== "Delivered";

    const update = {};

    // Franchise aur Admin dono status update kar sakte hain
    if (orderStatus) update.orderStatus = orderStatus;

    // Franchise sirf apne COD orders ka payment status update kar sakti hai (jab wo cash collect karegi)
    if (paymentStatus) {
      if (
        isAdmin ||
        (isAssignedFranchise && existingOrder.paymentMethod === "cod")
      ) {
        update.paymentStatus = paymentStatus;
      }
    }

    // ONLY Admin can update royalty status
    if (royaltyStatus && isAdmin) {
      update.royaltyStatus = royaltyStatus;
    }

    const order = await Order.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    })
      .populate("user", "name email")
      .populate("items.product", "name slug images");

    // 🌟 4. FRANCHISE INVENTORY LOGIC (B2B orders received by Franchise)
    if (isTransitioningToDelivered && order.orderType === "B2B") {
      const franchiseId = order.user._id;

      for (const item of order.items) {
        let stockDoc = await FranchiseStock.findOne({
          franchiseId: franchiseId,
          product: item.product._id,
        });

        if (!stockDoc) {
          stockDoc = new FranchiseStock({
            franchiseId: franchiseId,
            product: item.product._id,
            quantity: 0,
          });
        }

        const previousStock = stockDoc.quantity;
        stockDoc.quantity += item.quantity;

        stockDoc.stockHistory.push({
          type: "addition",
          quantityChanged: item.quantity,
          previousStock,
          newStock: stockDoc.quantity,
          note: `Received from B2B Order #${order._id.toString().slice(-6).toUpperCase()}`,
        });

        await stockDoc.save();
      }
    }

    res.json(order);
  } catch (e) {
    next(e);
  }
});

export default r;
