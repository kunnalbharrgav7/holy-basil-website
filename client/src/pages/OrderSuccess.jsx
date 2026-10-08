import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Download,
  ArrowRight,
  Loader2,
  Clock,
  Package,
  Truck,
  Check,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext"; // 🌟 ADDED AUTH
import toast from "react-hot-toast"; // 🌟 ADDED TOAST FOR NOTIFICATIONS

export default function OrderSuccessReceipt() {
  const { id } = useParams();
  const { user } = useAuth(); // 🌟 Get logged-in user
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false); // 🌟 State for API call

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order details", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
    window.scrollTo(0, 0);
  }, [id]);

  // 🌟 FUNCTION TO UPDATE STATUS BY FRANCHISE
  const handleStatusUpdate = async (
    newOrderStatus,
    newPaymentStatus = null,
  ) => {
    try {
      setUpdating(true);
      const payload = { orderStatus: newOrderStatus };
      if (newPaymentStatus) {
        payload.paymentStatus = newPaymentStatus;
      }
      const { data } = await api.patch(`/orders/${order._id}/status`, payload);
      setOrder(data);
      toast.success(`Order marked as ${newOrderStatus}!`);
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader2 size={40} className="animate-spin text-emerald-400" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="font-serif text-3xl text-white">Order Not Found</h1>
        <p className="mt-4 text-[#F5F2EB]/60">
          We couldn't locate this order in our system.
        </p>
        <Link to="/products" className="btn-primary mt-6 px-8 py-3">
          Return to Shop
        </Link>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );

  const isOnline = order.paymentMethod === "online";

  // 🌟 SECURITY & UI CHECK: Is this user the assigned franchise?
  const isAssignedFranchise =
    user?.role === "franchise" && order.fulfilledBy === (user?._id || user?.id);

  return (
    <div className="py-10 md:py-16">
      <div className="container-hba mx-auto px-4 max-w-3xl w-full">
        {/* 🌟 FRANCHISE MANAGEMENT CONSOLE 🌟 */}
        {isAssignedFranchise && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-10 rounded-[2rem] border-2 border-emerald-500/40 bg-gradient-to-b from-emerald-950/40 to-[#080D0A] p-6 sm:p-8 text-center shadow-[0_0_30px_rgba(16,185,129,0.15)]"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              Franchise Fulfillment Panel
            </span>
            <h2 className="mt-2 font-serif text-2xl font-bold text-white mb-6">
              Update Customer Delivery
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {order.orderStatus === "Pending" && (
                <button
                  onClick={() => handleStatusUpdate("Processing")}
                  disabled={updating}
                  className="btn-primary flex items-center gap-2 py-3 px-6"
                >
                  {updating ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Package size={18} />
                  )}
                  Mark as Processing (Pack Order)
                </button>
              )}

              {order.orderStatus === "Processing" && (
                <button
                  onClick={() => handleStatusUpdate("Shipped")}
                  disabled={updating}
                  className="btn-primary flex items-center gap-2 py-3 px-6"
                >
                  {updating ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Truck size={18} />
                  )}
                  Mark as Out for Delivery
                </button>
              )}

              {order.orderStatus === "Shipped" &&
                order.paymentMethod === "cod" && (
                  <button
                    onClick={() => handleStatusUpdate("Delivered", "Completed")}
                    disabled={updating}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-amber-500"
                  >
                    {updating ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Check size={18} />
                    )}
                    Mark Delivered & Cash Collected
                  </button>
                )}

              {order.orderStatus === "Shipped" &&
                order.paymentMethod === "online" && (
                  <button
                    onClick={() => handleStatusUpdate("Delivered")}
                    disabled={updating}
                    className="btn-primary flex items-center gap-2 py-3 px-6"
                  >
                    {updating ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Check size={18} />
                    )}
                    Mark as Delivered
                  </button>
                )}

              {order.orderStatus === "Delivered" && (
                <div className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-900/30 px-6 py-3 rounded-full border border-emerald-500/30">
                  <CheckCircle2 size={20} />
                  Fulfillment Successfully Completed
                </div>
              )}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="flex flex-col items-center text-center mb-10"
        >
          <div
            className={`h-20 w-20 rounded-full flex items-center justify-center mb-6 border shadow-[0_0_30px_rgba(16,185,129,0.2)] ${isOnline ? "bg-emerald-900/30 border-emerald-500/30" : "bg-emerald-900/30 border-emerald-500/30"}`}
          >
            <CheckCircle2
              className="text-emerald-400 w-10 h-10"
              strokeWidth={2}
            />
          </div>

          {/* 🌟 DYNAMIC HEADING */}
          <h1 className="text-4xl md:text-5xl font-serif text-white font-bold mb-4">
            {isAssignedFranchise
              ? "Customer Order Details"
              : isOnline
                ? "Payment Successful"
                : "Order Confirmed"}
          </h1>

          {/* 🌟 DYNAMIC DESCRIPTION */}
          <p className="text-[#F5F2EB]/60 text-base max-w-md">
            {isAssignedFranchise
              ? "This order has been routed to your store for fulfillment."
              : isOnline
                ? "Thank you for choosing Holy Basil Ayurveda. We are preparing your order for shipment."
                : "Thank you for your order! Please keep cash or UPI ready at the time of delivery."}
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-[#121E1A] rounded-[2.5rem] border border-emerald-900/40 shadow-2xl overflow-hidden relative"
        >
          {/* Perforated edge design effect */}
          <div className="absolute top-0 left-0 w-full h-3 flex justify-around overflow-hidden opacity-20">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-[#080D0A] -mt-1.5"
              ></div>
            ))}
          </div>

          <div className="p-8 md:p-12">
            <div className="flex flex-wrap justify-between items-end border-b border-emerald-900/30 pb-6 mb-8 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/60 mb-1.5">
                  Receipt No.
                </p>
                <p className="font-serif text-3xl text-white font-bold">
                  #{order._id.slice(-6).toUpperCase()}
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/60 mb-1.5">
                  Date
                </p>
                <p className="font-semibold text-white">{orderDate}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 mb-10">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/60 mb-3">
                  Billed To
                </p>
                <p className="text-white font-semibold text-lg">
                  {order.shippingAddress?.name}
                </p>
                <p className="text-[#F5F2EB]/60 text-sm mt-2 leading-relaxed">
                  {order.shippingAddress?.address}
                  <br />
                  {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.district}{" "}
                  {order.shippingAddress?.state} -{" "}
                  {order.shippingAddress?.pincode}
                </p>
                {/* Dikhane ke liye phone number add kar diya Franchise convenience ke liye */}
                <p className="text-emerald-400 text-sm mt-2 font-medium">
                  📞 {order.shippingAddress?.phone}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/60 mb-3">
                  Payment Info
                </p>

                {/* 🌟 DYNAMIC STATUS BADGE */}
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-full border mb-2 uppercase tracking-wider ${isOnline || order.paymentStatus === "Completed" ? "bg-emerald-900/20 text-emerald-400 border-emerald-500/20" : "bg-amber-900/20 text-amber-400 border-amber-500/20"}`}
                >
                  {isOnline || order.paymentStatus === "Completed" ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <Clock size={14} />
                  )}
                  {order.paymentStatus || (isOnline ? "Success" : "Pending")}
                </div>

                <p className="text-[#F5F2EB]/60 text-sm mt-2">
                  Method: {isOnline ? "Online Gateway" : "Cash on Delivery"}
                </p>

                {/* 🌟 DELIVERY STATUS BADGE */}
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/60 mt-4 mb-2">
                  Delivery Status
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-full border bg-[#080D0A] border-emerald-500/30 text-emerald-300 uppercase tracking-wider">
                  {order.orderStatus}
                </div>
              </div>
            </div>

            <div className="bg-[#080D0A] rounded-3xl p-6 md:p-8 border border-emerald-900/20 mb-10">
              <h4 className="font-serif text-lg text-white mb-4 border-b border-emerald-900/30 pb-4">
                Order Items
              </h4>
              <div className="space-y-4 mb-6">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start gap-4 text-sm"
                  >
                    <span className="text-[#F5F2EB]/80 font-medium">
                      {item.name}{" "}
                      <span className="text-emerald-400/50 text-xs ml-2">
                        x{item.quantity}
                      </span>
                    </span>
                    <span className="text-emerald-300 font-serif whitespace-nowrap">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {(() => {
                const subtotal =
                  order.subtotal ||
                  order.items?.reduce(
                    (sum, i) => sum + i.price * i.quantity,
                    0,
                  ) ||
                  0;
                const gst =
                  order.gst !== undefined
                    ? order.gst
                    : Math.round(subtotal * 0.18);
                const delivery =
                  order.deliveryCharge !== undefined ? order.deliveryCharge : 0;

                // Fetch coupon info if it exists
                const couponDiscount = order.couponDiscount || 0;
                const total =
                  order.total ||
                  order.totalPrice ||
                  subtotal + gst + delivery - couponDiscount;

                return (
                  <div className="border-t border-emerald-900/40 pt-4 space-y-3">
                    <div className="flex justify-between items-center text-sm text-[#F5F2EB]/60">
                      <span>Subtotal</span>
                      <span className="text-white">
                        ₹{Number(subtotal).toLocaleString("en-IN")}
                      </span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between items-center text-sm text-emerald-400">
                        <span>Discount ({order.couponCode})</span>
                        <span>
                          - ₹{Number(couponDiscount).toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm text-[#F5F2EB]/60">
                      <span>GST (18%)</span>
                      <span className="text-white">
                        ₹{Number(gst).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-[#F5F2EB]/60">
                      <span>Shipping</span>
                      <span className="text-emerald-400">
                        {delivery === 0 ? "Free" : `₹${delivery}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-4 mt-2 border-t border-emerald-900/40">
                      <span className="text-white font-serif font-bold text-lg">
                        Total Amount
                      </span>
                      <span className="text-emerald-400 font-serif font-bold text-3xl">
                        ₹{Number(total).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Render buttons based on User Role */}
            {!isAssignedFranchise ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/profile"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white font-bold text-sm rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-500 transition-colors"
                >
                  Track Order <ArrowRight size={16} />
                </Link>
                <Link
                  to="/products"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#080D0A] text-emerald-400 font-bold text-sm rounded-full border border-emerald-500/30 hover:bg-emerald-900/30 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="flex justify-center">
                <Link
                  to="/franchise-portal/orders"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#080D0A] text-emerald-400 font-bold text-sm rounded-full border border-emerald-500/30 hover:bg-emerald-900/30 transition-colors"
                >
                  <ArrowRight size={16} className="rotate-180" /> Back to
                  Dashboard
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
