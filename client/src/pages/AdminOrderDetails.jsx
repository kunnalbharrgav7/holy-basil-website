import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Save,
} from "lucide-react";
import { getAdminOrderById, updateOrderStatus } from "../services/orderService";

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];
const PAYMENT_STATUSES = ["Pending", "Paid", "Failed", "Refunded"];

export default function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getAdminOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Unable to load order.");
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  const handleStatusUpdate = async (field, value) => {
    try {
      setUpdating(true);
      setError("");
      setUpdateMessage("");
      const updated = await updateOrderStatus(order._id, { [field]: value });
      setOrder(updated);
      setUpdateMessage("Order updated successfully.");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Unable to update order status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <main className="min-h-screen py-12 sm:py-20 bg-[#080D0A]">
        <div className="container-hba text-center text-sm text-[#F5F2EB]/50">
          Loading order details...
        </div>
      </main>
    );
  if (error)
    return (
      <main className="min-h-screen py-12 sm:py-20 bg-[#080D0A]">
        <div className="container-hba px-4">
          <div className="rounded-2xl border border-red-900/50 bg-red-950/40 p-4 sm:p-5 text-sm text-red-400">
            {error}
          </div>
        </div>
      </main>
    );
  if (!order) return null;

  const address = order.shippingAddress || {};

  return (
    <main className="min-h-screen py-8 sm:py-12 md:py-20 px-3 sm:px-6 lg:px-8 bg-[#080D0A] text-[#F5F2EB]">
      <div className="container-hba max-w-6xl mx-auto">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-900/20 px-3 py-1.5 rounded-full"
        >
          <ArrowLeft size={16} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Back to orders
        </Link>

        {/* 🌟 Responsive Header & Status Selectors */}
        <div className="mt-6 sm:mt-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 sm:gap-6">
          <div>
            <span className="eyebrow text-[10px] sm:text-[11px] text-emerald-400/80 uppercase tracking-widest font-bold">
              Order details
            </span>
            <div className="mt-2 sm:mt-3 flex items-center gap-2 sm:gap-3 flex-wrap">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-serif">
                #{order._id.slice(-6).toUpperCase()}
              </h1>
              {order.orderType === "B2B" && (
                <span className="rounded-lg border border-amber-500/30 bg-amber-900/40 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-widest mt-1">
                  B2B Franchise
                </span>
              )}
            </div>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-[#F5F2EB]/50">
              Placed on {new Date(order.createdAt).toLocaleString("en-IN")}
            </p>
          </div>

          {/* 🌟 Mobile: 2 Columns Grid | Desktop: Row */}
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row w-full lg:w-auto shrink-0">
            <div className="rounded-[1rem] sm:rounded-2xl border border-emerald-900/30 bg-[#121E1A] px-3 py-2 sm:px-4 sm:py-3 shadow-md">
              <label className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-400/60 truncate">
                Payment Status
              </label>
              <select
                value={order.paymentStatus || "Pending"}
                disabled={updating}
                onChange={(event) =>
                  handleStatusUpdate("paymentStatus", event.target.value)
                }
                className="mt-1 w-full sm:min-w-[140px] rounded-lg sm:rounded-full border border-emerald-900/40 bg-[#080D0A] px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-sm font-bold text-emerald-400 outline-none focus:border-emerald-500/50 disabled:opacity-50 cursor-pointer"
              >
                {PAYMENT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-[1rem] sm:rounded-2xl border border-emerald-900/30 bg-[#121E1A] px-3 py-2 sm:px-4 sm:py-3 shadow-md">
              <label className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-400/60 truncate">
                Order Status
              </label>
              <select
                value={order.orderStatus || "Pending"}
                disabled={updating}
                onChange={(event) =>
                  handleStatusUpdate("orderStatus", event.target.value)
                }
                className="mt-1 w-full sm:min-w-[140px] rounded-lg sm:rounded-full border border-emerald-900/40 bg-[#080D0A] px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-sm font-bold text-emerald-400 outline-none focus:border-emerald-500/50 disabled:opacity-50 cursor-pointer"
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 🌟 Customer & Shipping Info Grid */}
        <div className="mt-6 sm:mt-10 grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
          <InfoCard icon={User} title="Customer">
            <p className="font-bold text-white text-sm sm:text-base">
              {order.user?.name || "Unknown"}
            </p>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#F5F2EB]/60 break-all">
              {order.user?.email || "No email"}
            </p>
          </InfoCard>

          <InfoCard icon={MapPin} title="Shipping address">
            {Object.keys(address).length === 0 ? (
              <p className="text-xs sm:text-sm text-[#F5F2EB]/50">
                No shipping address provided.
              </p>
            ) : (
              <div className="space-y-1 text-xs sm:text-sm text-[#F5F2EB]/70">
                {address.name && (
                  <p className="text-white font-semibold">{address.name}</p>
                )}
                {address.address && (
                  <p className="leading-relaxed">{address.address}</p>
                )}
                {address.city && (
                  <p>
                    {address.city}
                    {address.state ? `, ${address.state}` : ""}
                  </p>
                )}
                {address.pincode && <p>PIN: {address.pincode}</p>}
                {address.phone && <p>Phone: {address.phone}</p>}
              </div>
            )}
          </InfoCard>
        </div>

        {/* 🌟 Order Items Section */}
        <section className="mt-8 sm:mt-10">
          <div className="mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3">
            <Package
              size={20}
              className="text-emerald-400 w-4 h-4 sm:w-5 sm:h-5"
            />
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
              Order items
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-900/30 bg-[#121E1A] shadow-lg">
            <div className="divide-y divide-emerald-900/30">
              {order.items?.map((item, index) => (
                <div
                  key={item.product?._id || `${item.name}-${index}`}
                  className="flex items-center justify-between gap-3 sm:gap-5 p-3 sm:p-5 hover:bg-[#16231D] transition-colors"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {item.product?.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.name}
                        className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl object-cover border border-emerald-900/20 shrink-0"
                      />
                    ) : (
                      <div className="grid h-12 w-12 sm:h-16 sm:w-16 shrink-0 place-items-center rounded-xl sm:rounded-2xl bg-[#080D0A] border border-emerald-900/20">
                        <Package
                          size={20}
                          className="text-emerald-500/50 w-4 h-4 sm:w-5 sm:h-5"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-white text-xs sm:text-base truncate">
                        {item.name}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-sm flex-wrap">
                        <span className="text-[#F5F2EB]/60 font-medium whitespace-nowrap">
                          ₹{Number(item.price || 0).toLocaleString("en-IN")} ×{" "}
                          {item.quantity}
                        </span>
                        {item.compareAtPrice > item.price && (
                          <span className="text-[9px] sm:text-[10px] text-[#F5F2EB]/30 line-through">
                            ₹
                            {Number(item.compareAtPrice || 0).toLocaleString(
                              "en-IN",
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <strong className="text-emerald-300 shrink-0 text-xs sm:text-base font-serif">
                    ₹
                    {Number(
                      (item.price || 0) * (item.quantity || 0),
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>
              ))}
            </div>

            {/* 🌟 Bill Summary */}
            <div className="border-t border-emerald-900/40 p-4 sm:p-6 bg-[#0B1310]">
              <div className="ml-auto w-full sm:max-w-sm space-y-2 sm:space-y-3 text-xs sm:text-sm text-[#F5F2EB]/80">
                <div className="flex justify-between items-center">
                  <span>Total MRP</span>
                  <span className="line-through text-[#F5F2EB]/40">
                    ₹
                    {Number(
                      order.mrpTotal || order.subtotal || 0,
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between items-center text-emerald-400 font-medium">
                    <span>Discount</span>
                    <span>
                      - ₹{Number(order.discount || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">
                    ₹{Number(order.subtotal || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Estimated GST (18%)</span>
                  <span>
                    ₹
                    {Number(
                      order.gst || Math.round((order.subtotal || 0) * 0.18),
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Delivery Charge</span>
                  <span>
                    {order.deliveryCharge === 0 ||
                    order.deliveryCharge === undefined ? (
                      <span className="text-emerald-400 font-medium">Free</span>
                    ) : (
                      `₹${order.deliveryCharge}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-emerald-900/40 pt-3 sm:pt-4 text-base sm:text-lg font-bold text-white mt-1">
                  <span>Total Amount</span>
                  <strong className="text-xl sm:text-2xl font-serif text-emerald-400">
                    ₹{Number(order.total || 0).toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🌟 Payment Info Card */}
        <section className="mt-8 sm:mt-10 mb-10 sm:mb-0">
          <InfoCard icon={CreditCard} title="Payment information">
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400/60 uppercase text-[9px] sm:text-[10px] tracking-widest font-bold shrink-0">
                  Status:
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-900/30 border border-emerald-500/20 text-white font-bold text-[10px] sm:text-xs">
                  {order.paymentStatus}
                </span>
              </div>
              {order.razorpayOrderId && (
                <div className="bg-[#080D0A] border border-emerald-900/30 p-2 sm:p-3 rounded-xl break-all">
                  <span className="text-emerald-400/60 uppercase text-[9px] sm:text-[10px] tracking-widest font-bold block mb-1">
                    Razorpay Order ID
                  </span>
                  <span className="text-[#F5F2EB]/80 font-mono text-[11px] sm:text-sm">
                    {order.razorpayOrderId}
                  </span>
                </div>
              )}
              {order.razorpayPaymentId && (
                <div className="bg-[#080D0A] border border-emerald-900/30 p-2 sm:p-3 rounded-xl break-all">
                  <span className="text-emerald-400/60 uppercase text-[9px] sm:text-[10px] tracking-widest font-bold block mb-1">
                    Razorpay Payment ID
                  </span>
                  <span className="text-[#F5F2EB]/80 font-mono text-[11px] sm:text-sm">
                    {order.razorpayPaymentId}
                  </span>
                </div>
              )}
            </div>
          </InfoCard>
        </section>
      </div>
    </main>
  );
}

// 🌟 Fully Responsive InfoCard Component
function InfoCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-[1.5rem] sm:rounded-3xl border border-emerald-900/30 bg-[#121E1A] p-4 sm:p-6 shadow-md flex flex-col">
      <div className="flex items-center gap-2 sm:gap-3 border-b border-emerald-900/20 pb-3 sm:pb-4 mb-3 sm:mb-4">
        <div className="grid h-8 w-8 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-xl bg-emerald-900/30 border border-emerald-500/20 text-emerald-400">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <h2 className="font-bold text-white text-base sm:text-lg font-serif tracking-wide">
          {title}
        </h2>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
