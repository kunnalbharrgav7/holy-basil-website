import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import {
  Package,
  Truck,
  IndianRupee,
  ShoppingBag,
  ArrowRight,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Wallet,
} from "lucide-react";

export default function FranchiseDashboard() {
  const { user } = useAuth();
  const [b2cOrders, setB2cOrders] = useState([]);
  const [b2bOrders, setB2bOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch both assigned customer orders (B2C) and own wholesale purchases (B2B)
        const [assignedRes, mineRes] = await Promise.all([
          api.get("/orders/assigned").catch(() => ({ data: [] })),
          api.get("/orders/mine").catch(() => ({ data: [] })),
        ]);

        setB2cOrders(assignedRes.data || []);
        setB2bOrders(mineRes.data.filter((o) => o.orderType === "B2B") || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={40} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  // --- Calculations for Smart Dashboard ---

  // 1. Fulfillment Metrics
  const pendingDeliveries = b2cOrders.filter(
    (o) =>
      o.orderStatus === "Pending" ||
      o.orderStatus === "Processing" ||
      o.orderStatus === "Shipped",
  );

  // 2. Financial Metrics (B2C)
  // Cash in hand: COD orders that are delivered and paid
  const cashCollected = b2cOrders
    .filter((o) => o.paymentMethod === "cod" && o.paymentStatus === "Completed")
    .reduce((sum, o) => sum + o.total, 0);

  // Settlement Pending: Online orders delivered by franchise, but money is with Admin
  const settlementPending = b2cOrders
    .filter(
      (o) => o.paymentMethod === "online" && o.orderStatus === "Delivered",
    )
    .reduce((sum, o) => sum + o.total, 0);

  // 3. Wholesale Spend (B2B)
  const totalB2bSpend = b2bOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="animate-in fade-in duration-300">
      {/* Welcome Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-emerald-900/30 pb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400">
            Overview
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold text-white md:text-4xl">
            Welcome back, {user?.name?.split(" ")[0] || "Partner"}!
          </h1>
          <p className="mt-2 text-sm text-[#F5F2EB]/60">
            Here's what's happening at your {user?.storeCity || "local"}{" "}
            franchise today.
          </p>
        </div>
        <Link
          to="/franchise-portal/shop"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition hover:bg-emerald-500 w-fit"
        >
          <ShoppingBag size={16} /> Order New Stock
        </Link>
      </div>

      {/* KPI Stats Grid with Smart Links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Stat 1: Pending Deliveries */}
        <div className="rounded-[1.5rem] border border-emerald-900/40 bg-[#121E1A] p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Truck size={60} className="text-emerald-400" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#F5F2EB]/50">
            Pending Deliveries
          </p>
          <p className="mt-2 font-serif text-3xl font-bold text-white">
            {pendingDeliveries.length}
          </p>
          <Link
            to="/franchise-portal/orders?tab=b2c&status=pending" // 👈 SMART LINK
            className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Fulfill Now <ArrowRight size={12} />
          </Link>
        </div>

        {/* Stat 2: Cash in Hand (COD) */}
        <div className="rounded-[1.5rem] border border-emerald-500/20 bg-gradient-to-br from-[#121E1A] to-[#0B1310] p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <IndianRupee size={60} className="text-emerald-400" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#F5F2EB]/50">
            Cash Collected (COD)
          </p>
          <p className="mt-2 font-serif text-3xl font-bold text-emerald-400">
            ₹{cashCollected.toLocaleString("en-IN")}
          </p>
          <Link
            to="/franchise-portal/orders?tab=b2c&payment=cod" // 👈 SMART LINK
            className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View COD Orders <ArrowRight size={12} />
          </Link>
        </div>

        {/* Stat 3: Settlement Pending (Online) */}
        <div className="rounded-[1.5rem] border border-amber-900/40 bg-[#121E1A] p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet size={60} className="text-amber-400" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#F5F2EB]/50">
            Online Payout Pending
          </p>
          <p className="mt-2 font-serif text-3xl font-bold text-amber-400">
            ₹{settlementPending.toLocaleString("en-IN")}
          </p>
          <Link
            to="/franchise-portal/orders?tab=b2c&payment=online" // 👈 SMART LINK
            className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors"
          >
            View Online Payouts <ArrowRight size={12} />
          </Link>
        </div>

        {/* Stat 4: B2B Spend */}
        <div className="rounded-[1.5rem] border border-emerald-900/40 bg-[#121E1A] p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Package size={60} className="text-emerald-400" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#F5F2EB]/50">
            Total B2B Spend
          </p>
          <p className="mt-2 font-serif text-3xl font-bold text-white">
            ₹{totalB2bSpend.toLocaleString("en-IN")}
          </p>
          <Link
            to="/franchise-portal/orders?tab=b2b" // 👈 SMART LINK
            className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View Wholesale Orders <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Urgent Deliveries Panel */}
        <div className="lg:col-span-2 rounded-[2rem] border border-emerald-900/30 bg-[#121E1A] p-6 sm:p-8 shadow-lg">
          <div className="mb-6 flex items-center justify-between border-b border-emerald-900/30 pb-4">
            <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
              <Truck size={20} className="text-emerald-400" /> Urgent Customer
              Deliveries
            </h2>
            <Link
              to="/franchise-portal/orders"
              className="text-xs font-bold uppercase tracking-widest text-emerald-400 hover:text-emerald-300"
            >
              View All
            </Link>
          </div>

          {pendingDeliveries.length > 0 ? (
            <div className="space-y-4">
              {pendingDeliveries.slice(0, 4).map((order) => (
                <div
                  key={order._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-[#080D0A] p-4 border border-emerald-900/40 transition hover:border-emerald-500/30"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">
                        #{order._id.slice(-6).toUpperCase()}
                      </p>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          order.paymentMethod === "cod"
                            ? "bg-amber-900/30 text-amber-400 border border-amber-500/20"
                            : "bg-emerald-900/30 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {order.paymentMethod === "cod" ? "COD" : "Prepaid"}
                      </span>
                    </div>
                    <p className="text-xs text-[#F5F2EB]/60 mt-1">
                      {order.shippingAddress?.name} •{" "}
                      {order.shippingAddress?.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <p className="font-serif text-emerald-300 font-bold">
                      ₹{order.total.toLocaleString("en-IN")}
                    </p>
                    <Link
                      to={`/order-success/${order._id}`}
                      className="rounded-xl bg-[#121E1A] border border-emerald-500/30 px-4 py-2 text-xs font-bold text-emerald-400 transition hover:bg-emerald-600 hover:text-white"
                    >
                      Process
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 rounded-full bg-emerald-900/20 p-4 text-emerald-500">
                <CheckCircle2 size={32} />
              </div>
              <p className="text-lg font-bold text-white font-serif">
                All Caught Up!
              </p>
              <p className="mt-1 text-sm text-[#F5F2EB]/50">
                No pending customer orders to fulfill right now.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Quick Actions & Inventory Alert */}
        <div className="flex flex-col gap-6">
          {/* Quick Actions */}
          <div className="rounded-[2rem] border border-emerald-900/30 bg-[#121E1A] p-6 shadow-lg">
            <h2 className="font-serif text-lg font-bold text-white mb-4 border-b border-emerald-900/30 pb-3">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                to="/franchise-portal/shop"
                className="flex items-center justify-between rounded-xl bg-[#080D0A] border border-emerald-900/40 p-4 transition hover:border-emerald-500/40 hover:bg-[#0B1310] group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-900/30 p-2 rounded-lg text-emerald-400">
                    <ShoppingBag size={18} />
                  </div>
                  <span className="text-sm font-semibold text-white">
                    Buy Wholesale Stock
                  </span>
                </div>
                <ArrowRight
                  size={16}
                  className="text-[#F5F2EB]/40 group-hover:text-emerald-400 transition-colors"
                />
              </Link>
              <Link
                to="/franchise-portal/stock"
                className="flex items-center justify-between rounded-xl bg-[#080D0A] border border-emerald-900/40 p-4 transition hover:border-emerald-500/40 hover:bg-[#0B1310] group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-900/30 p-2 rounded-lg text-emerald-400">
                    <Package size={18} />
                  </div>
                  <span className="text-sm font-semibold text-white">
                    Manage Inventory
                  </span>
                </div>
                <ArrowRight
                  size={16}
                  className="text-[#F5F2EB]/40 group-hover:text-emerald-400 transition-colors"
                />
              </Link>
            </div>
          </div>

          {/* Setup / Geographic Hint */}
          <div className="rounded-[2rem] border border-emerald-900/30 bg-gradient-to-br from-[#121E1A] to-[#0B1310] p-6 shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <AlertTriangle size={100} className="text-amber-500" />
            </div>
            <div className="relative z-10">
              <h3 className="font-serif text-lg font-bold text-white mb-2 text-amber-400">
                Boost Your Local Sales
              </h3>
              <p className="text-xs text-[#F5F2EB]/70 leading-relaxed mb-4">
                Ensure your <strong>Serviceable Pincodes</strong> are up to date
                in your profile. Orders from these areas will route directly to
                you for fulfillment!
              </p>
              <Link
                to="/franchise-portal/profile"
                className="inline-block text-xs font-bold uppercase tracking-wider text-white bg-amber-600/90 hover:bg-amber-500 px-4 py-2 rounded-lg transition-colors"
              >
                Update Pincodes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
