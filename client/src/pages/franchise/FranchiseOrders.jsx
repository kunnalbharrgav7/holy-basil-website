import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import {
  ShoppingBag,
  Loader2,
  ArrowRight,
  Check,
  Clock,
  FileText,
  MapPin,
  Phone,
  Package,
  Truck,
  CheckCircle2,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

export default function FranchiseOrders() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 🌟 Read filters from URL
  const tabParam = searchParams.get("tab");
  const statusParam = searchParams.get("status");
  const paymentParam = searchParams.get("payment");

  const [b2bOrders, setB2bOrders] = useState([]);
  const [b2cOrders, setB2cOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🌟 Set initial active tab based on URL parameter if available
  const [activeTab, setActiveTab] = useState(tabParam || "b2c");

  // Keep tab in sync if query param changes
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setLoading(true);
        // Dono APIs ko parallel call kar rahe hain time bachane ke liye
        const [mineRes, assignedRes] = await Promise.all([
          api.get("/orders/mine"),
          api.get("/orders/assigned"),
        ]);

        const wholesaleOrders = mineRes.data.filter(
          (o) => o.orderType === "B2B",
        );
        setB2bOrders(wholesaleOrders);
        setB2cOrders(assignedRes.data || []);
      } catch (err) {
        console.error("Failed to fetch franchise orders:", err);
        toast.error("Failed to load your orders");
      } finally {
        setLoading(false);
      }
    };
    fetchAllOrders();
  }, []);

  // 🌟 SMART FILTERING LOGIC FOR B2C ORDERS
  let filteredB2cOrders = b2cOrders;
  if (statusParam === "pending") {
    filteredB2cOrders = b2cOrders.filter(
      (o) =>
        o.orderStatus === "Pending" ||
        o.orderStatus === "Processing" ||
        o.orderStatus === "Shipped",
    );
  } else if (paymentParam === "cod") {
    filteredB2cOrders = b2cOrders.filter((o) => o.paymentMethod === "cod");
  } else if (paymentParam === "online") {
    filteredB2cOrders = b2cOrders.filter(
      (o) => o.paymentMethod === "online" && o.orderStatus === "Delivered",
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={40} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl pb-24 animate-in fade-in duration-300 px-2 sm:px-4">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-emerald-900/30 pb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400">
            Order Management
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold text-white md:text-4xl">
            My Franchise Orders
          </h1>
        </div>

        <Link
          to="/franchise-portal/shop"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition hover:bg-emerald-500"
        >
          <span>Buy Wholesale Stock</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* 🌟 Tab Switcher */}
      <div className="mb-8 flex p-1 bg-[#080D0A] border border-emerald-900/40 rounded-2xl w-fit mx-auto sm:mx-0">
        <button
          onClick={() => setActiveTab("b2c")}
          className={`relative flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${
            activeTab === "b2c"
              ? "bg-emerald-600 text-white shadow-lg"
              : "text-[#F5F2EB]/50 hover:text-emerald-400"
          }`}
        >
          <Package size={16} />
          <span>Customer Deliveries</span>
          {b2cOrders.length > 0 && (
            <span
              className={`ml-1 flex h-5 w-5 items-center justify-center rounded-full text-[9px] ${activeTab === "b2c" ? "bg-white text-emerald-700" : "bg-emerald-900/50 text-emerald-400"}`}
            >
              {b2cOrders.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("b2b")}
          className={`relative flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${
            activeTab === "b2b"
              ? "bg-[#121E1A] text-emerald-400 border border-emerald-500/30 shadow-lg"
              : "text-[#F5F2EB]/50 hover:text-emerald-400"
          }`}
        >
          <ShoppingBag size={16} />
          <span>My Wholesale Orders</span>
        </button>
      </div>

      {/* =========================================
          TAB 1: B2C CUSTOMER DELIVERIES (NEW)
      ============================================= */}
      {activeTab === "b2c" && (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          {/* 🌟 ADDED: Active Filter Banner & Clear Button */}
          {(statusParam || paymentParam) && (
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-emerald-900/25 border border-emerald-500/40 px-4 sm:px-5 py-3 text-xs sm:text-sm text-emerald-300">
              <div className="flex items-center gap-2">
                <span>
                  Showing filtered view:{" "}
                  <strong>
                    {statusParam === "pending" && "Pending Deliveries"}
                    {paymentParam === "cod" && "COD Cash Collected"}
                    {paymentParam === "online" && "Online Payout Pending"}
                  </strong>{" "}
                  ({filteredB2cOrders.length} results)
                </span>
              </div>
              <button
                onClick={() => setSearchParams({ tab: "b2c" })}
                className="inline-flex justify-center items-center gap-1 text-[10px] sm:text-xs font-bold text-white hover:text-emerald-400 bg-[#080D0A] px-3 py-1.5 rounded-full border border-emerald-900/40 shrink-0"
              >
                Clear Filter
              </button>
            </div>
          )}

          {filteredB2cOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredB2cOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex flex-col justify-between rounded-[2rem] border border-emerald-900/40 bg-[#121E1A] p-6 shadow-lg hover:border-emerald-500/40 transition-all"
                >
                  {/* Order ID & Badge */}
                  <div className="flex justify-between items-start mb-4 border-b border-emerald-900/30 pb-4">
                    <div>
                      <p className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest">
                        Order #
                        {order._id
                          .substring(order._id.length - 6)
                          .toUpperCase()}
                      </p>
                      <p className="text-xs text-[#F5F2EB]/50 mt-1">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${
                        order.paymentMethod === "cod"
                          ? "bg-amber-900/30 text-amber-400 border border-amber-500/20"
                          : "bg-emerald-900/30 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {order.paymentMethod === "cod"
                        ? "COD (Collect Cash)"
                        : "Prepaid"}
                    </span>
                  </div>

                  {/* Customer Details */}
                  <div className="space-y-3 mb-6 flex-grow">
                    <div className="flex items-start gap-3 text-sm text-[#F5F2EB]/80">
                      <User
                        size={16}
                        className="text-emerald-500 shrink-0 mt-0.5"
                      />
                      <span className="font-serif font-bold text-white">
                        {order.shippingAddress?.name}
                      </span>
                    </div>
                    <div className="flex items-start gap-3 text-xs text-[#F5F2EB]/70">
                      <Phone
                        size={14}
                        className="text-emerald-500 shrink-0 mt-0.5"
                      />
                      <span>{order.shippingAddress?.phone}</span>
                    </div>
                    <div className="flex items-start gap-3 text-xs text-[#F5F2EB]/70">
                      <MapPin
                        size={14}
                        className="text-emerald-500 shrink-0 mt-0.5"
                      />
                      <span className="leading-relaxed">
                        {order.shippingAddress?.address},{" "}
                        {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.district} -{" "}
                        {order.shippingAddress?.pincode}
                      </span>
                    </div>
                  </div>

                  {/* Order Items Summary */}
                  <div className="mb-6 rounded-xl bg-[#080D0A] p-4 border border-emerald-900/30">
                    <p className="text-[10px] uppercase font-bold text-emerald-400/60 mb-2 tracking-wider">
                      Items to Deliver
                    </p>
                    <p className="text-xs text-white">
                      {order.items?.length} Product(s) &bull;{" "}
                      {order.items?.reduce(
                        (sum, item) => sum + item.quantity,
                        0,
                      )}{" "}
                      Total Units
                    </p>
                  </div>

                  {/* Footer & Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-emerald-900/30">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#F5F2EB]/50 font-bold">
                        Total Bill
                      </p>
                      <p className="font-serif text-xl font-bold text-emerald-300">
                        ₹{order.total.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <Link
                      to={`/order-success/${order._id}`}
                      className="rounded-xl bg-emerald-900/30 border border-emerald-500/30 px-4 py-2.5 text-xs font-bold text-emerald-400 transition hover:bg-emerald-600 hover:text-white"
                    >
                      Manage Order
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-emerald-900/50 bg-[#121E1A] py-24 text-center">
              <div className="bg-[#080D0A] p-5 rounded-full border border-emerald-900/50 mb-5 text-emerald-400">
                <Truck size={40} />
              </div>
              <p className="font-serif text-2xl font-bold text-white">
                No Customer Orders Yet
              </p>
              <p className="mt-2 text-sm text-[#F5F2EB]/50 max-w-sm leading-relaxed">
                When local customers order from your assigned pincodes, they
                will appear here for you to pack and deliver.
              </p>
            </div>
          )}
        </div>
      )}

      {/* =========================================
          TAB 2: B2B WHOLESALE ORDERS (EXISTING)
      ============================================= */}
      {activeTab === "b2b" && (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <div className="rounded-[2.5rem] border border-emerald-900/30 bg-[#121E1A] p-6 sm:p-8 shadow-lg">
            <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-emerald-900/30 pb-4">
              <h3 className="font-serif text-xl font-bold text-white">
                Wholesale Order History
              </h3>
              <span className="text-[11px] text-emerald-400/70 font-mono uppercase">
                Total B2B Orders: {b2bOrders.length}
              </span>
            </div>

            {b2bOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#F5F2EB]/80">
                  <thead className="text-[10px] uppercase tracking-widest text-emerald-400/60 border-b border-emerald-900/35">
                    <tr>
                      <th className="pb-4 font-semibold">Order ID</th>
                      <th className="pb-4 font-semibold">Date</th>
                      <th className="pb-4 font-semibold">Order Value</th>
                      <th className="pb-4 font-semibold">Royalty Rate</th>
                      <th className="pb-4 font-semibold">Royalty Fee</th>
                      <th className="pb-4 font-semibold">Order Status</th>
                      <th className="pb-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/30">
                    {b2bOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="transition-colors hover:bg-emerald-900/10"
                      >
                        <td className="py-4 font-bold text-white">
                          #
                          {order._id
                            .substring(order._id.length - 8)
                            .toUpperCase()}
                        </td>
                        <td className="py-4 text-xs text-[#F5F2EB]/60">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </td>
                        <td className="py-4 font-serif text-white">
                          ₹{(order.total || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="py-4 font-semibold text-emerald-400">
                          {order.royaltyPercentage || 0}%
                        </td>
                        <td className="py-4 font-serif font-bold text-amber-300">
                          ₹{order.royaltyAmount || 0}
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              order.orderStatus === "Delivered"
                                ? "bg-emerald-900/30 text-emerald-400 border-emerald-500/20"
                                : "bg-amber-900/20 text-amber-400 border-amber-500/20"
                            }`}
                          >
                            {order.orderStatus === "Delivered" ? (
                              <Check size={12} />
                            ) : (
                              <Clock size={12} />
                            )}
                            {order.orderStatus || "Pending"}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <Link
                            to={`/order-success/${order._id}`}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#080D0A] border border-emerald-500/30 px-3.5 py-1.5 text-xs font-bold text-emerald-400 transition hover:bg-emerald-600 hover:text-white"
                          >
                            <FileText size={14} /> <span>Invoice</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-[#080D0A] p-4 rounded-full border border-emerald-900/50 mb-4 text-emerald-400">
                  <ShoppingBag size={32} />
                </div>
                <p className="font-serif text-xl font-bold text-white">
                  No B2B orders found
                </p>
                <p className="mt-1 text-sm text-[#F5F2EB]/50 max-w-sm">
                  You haven't placed any wholesale orders yet. Visit the B2B
                  shop to stock your inventory.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
