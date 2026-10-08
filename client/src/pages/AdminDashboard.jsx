import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  MessageSquare,
  ArrowUpRight,
  RefreshCw,
  Store,
  CheckCircle,
  XCircle,
  DollarSign,
  Sparkles,
  Wallet,
  TrendingUp,
  Truck,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getAdminProducts } from "../services/productService";
import { getAdminOrders } from "../services/orderService";
import { getAdminEnquiries } from "../services/enquiryService";
import {
  getAdminFranchiseRequests,
  updateFranchiseStatus,
} from "../services/franchiseService";
import { getRoyaltySummary } from "../services/orderService";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [franchiseRequests, setFranchiseRequests] = useState([]);
  const [royaltySummary, setRoyaltySummary] = useState({
    totalRoyaltyGenerated: 0,
    totalPendingRoyalty: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const [productsRes, ordersRes, enquiriesRes, franchiseRes, royaltyRes] =
        await Promise.allSettled([
          getAdminProducts(),
          getAdminOrders(),
          getAdminEnquiries(),
          getAdminFranchiseRequests(),
          getRoyaltySummary(),
        ]);

      setProducts(
        productsRes.status === "fulfilled" ? productsRes.value || [] : [],
      );
      setOrders(ordersRes.status === "fulfilled" ? ordersRes.value || [] : []);
      setEnquiries(
        enquiriesRes.status === "fulfilled" ? enquiriesRes.value || [] : [],
      );
      setFranchiseRequests(
        franchiseRes.status === "fulfilled" ? franchiseRes.value || [] : [],
      );
      if (royaltyRes.status === "fulfilled" && royaltyRes.value)
        setRoyaltySummary(royaltyRes.value);
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setActionLoading(id);
      await updateFranchiseStatus(id, newStatus);
      setFranchiseRequests((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item,
        ),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  // --- 🌟 SMART HYPERLOCAL CALCULATIONS ---
  const recentOrders = orders.slice(0, 5);
  const recentEnquiries = enquiries.slice(0, 5);
  const recentFranchise = franchiseRequests.slice(0, 5);

  const pendingOrders = orders.filter(
    (o) => o.orderStatus === "Pending",
  ).length;
  const newEnquiries = enquiries.filter((e) => e.status === "New").length;
  const pendingFranchise = franchiseRequests.filter(
    (i) => i.status === "Pending",
  ).length;

  // 1. Direct Admin Revenue (Orders fulfilled by Admin)
  const adminB2cRevenue = orders
    .filter((o) => o.fulfillmentType !== "FRANCHISE" && o.orderType !== "B2B")
    .filter(
      (o) => o.paymentStatus === "Completed" || o.paymentStatus === "Paid",
    )
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  // 2. Pending Settlements (Online orders delivered by Franchise, money with Admin)
  const pendingSettlements = orders
    .filter(
      (o) =>
        o.fulfillmentType === "FRANCHISE" &&
        o.paymentMethod === "online" &&
        o.orderStatus === "Delivered",
    )
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  // 3. Franchise Fulfillment Count
  const franchiseFulfilledCount = orders.filter(
    (o) => o.fulfillmentType === "FRANCHISE",
  ).length;

  return (
    <main className="min-h-screen px-3 py-6 sm:px-6 lg:px-8 bg-[#080D0A] text-[#F5F2EB]">
      <div className="container-hba max-w-7xl mx-auto space-y-8 sm:space-y-10">
        {/* ========================================================= */}
        {/* 🌟 1. EXECUTIVE GLASSMORPHIC TOP HEADER                     */}
        {/* ========================================================= */}
        <div className="rounded-[2rem] sm:rounded-[2.5rem] bg-[#121E1A] border border-emerald-900/30 p-5 sm:p-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-500/5 blur-[80px] sm:blur-[100px] pointer-events-none rounded-full" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3 sm:mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest bg-emerald-900/40 text-emerald-400 border border-emerald-500/20">
                <Sparkles size={10} className="sm:w-3 sm:h-3" /> Master View
              </span>
              <span className="text-[10px] sm:text-xs text-[#F5F2EB]/40">
                •{" "}
                {new Date().toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl text-white font-bold">
              Admin Command Center
            </h1>
            <p className="mt-1.5 sm:mt-1 text-[11px] sm:text-xs text-[#F5F2EB]/60 max-w-sm">
              Global overview of central revenues, franchise performance, and
              liabilities.
            </p>
          </div>
          <div className="relative z-10 w-full md:w-auto">
            <button
              onClick={loadDashboard}
              disabled={loading}
              className="btn-primary w-full md:w-auto justify-center inline-flex items-center gap-2 py-3 px-6 text-[11px] sm:text-xs shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />{" "}
              Refresh Metrics
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-900/50 bg-red-950/40 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ========================================================= */}
        {/* 🌟 2. PRIMARY FINANCIAL KPI GRID (SMART LINKS ADDED)      */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={TrendingUp}
            label="Direct B2C Revenue"
            value={
              loading ? "—" : `₹${adminB2cRevenue.toLocaleString("en-IN")}`
            }
            sub="Admin Fulfilled Sales"
            href="/admin/orders?view=admin_revenue" // 👈 SMART LINK
            theme="emerald"
          />
          <StatCard
            icon={DollarSign}
            label="B2B Royalty Earned"
            value={
              loading
                ? "—"
                : `₹${royaltySummary.totalRoyaltyGenerated.toLocaleString("en-IN")}`
            }
            sub={`₹${royaltySummary.totalPendingRoyalty.toLocaleString("en-IN")} pending collection`}
            href="/admin/royalties"
            theme="emerald"
          />
          <StatCard
            icon={AlertTriangle}
            label="Pending Settlements"
            value={
              loading ? "—" : `₹${pendingSettlements.toLocaleString("en-IN")}`
            }
            sub="Payouts due to Franchises"
            href="/admin/orders?view=pending_settlements" // 👈 SMART LINK
            theme="amber"
          />
          <StatCard
            icon={MapPin}
            label="Franchise Handled"
            value={loading ? "—" : franchiseFulfilledCount}
            sub="Hyperlocal Deliveries"
            href="/admin/orders?fulfillment=FRANCHISE" // 👈 SMART LINK
            theme="blue"
          />
        </div>

        {/* ========================================================= */}
        {/* 🌟 3. SECONDARY COMPACT METRICS GRID (SMART LINKS)        */}
        {/* ========================================================= */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <MiniStat
            icon={ShoppingBag}
            label="Pending Orders"
            value={pendingOrders}
            href="/admin/orders?status=Pending"
          />{" "}
          {/* 👈 SMART LINK */}
          <MiniStat
            icon={Store}
            label="Pending Franchises"
            value={pendingFranchise}
            href="/admin/franchise?status=Pending"
            highlight={pendingFranchise > 0}
          />{" "}
          {/* 👈 SMART LINK */}
          <MiniStat
            icon={MessageSquare}
            label="New Enquiries"
            value={newEnquiries}
            href="/admin/enquiries?status=New"
          />{" "}
          {/* 👈 SMART LINK */}
          <MiniStat
            icon={Package}
            label="Active Products"
            value={products.length}
            href="/admin/products"
          />
        </div>

        {/* ========================================================= */}
        {/* 🌟 4. SPLIT WORKSPACE: ORDERS & ENQUIRIES                 */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 pt-2">
          {/* LEFT: Recent Orders with Fulfillment Context */}
          <section className="rounded-[1.5rem] sm:rounded-[2.5rem] border border-emerald-900/30 bg-[#121E1A] p-5 sm:p-8 shadow-lg flex flex-col justify-between">
            <div>
              <div className="mb-5 sm:mb-6 flex items-center justify-between">
                <div>
                  <span className="eyebrow text-emerald-400/80 text-[9px] sm:text-[10px]">
                    Operations
                  </span>
                  <h2 className="mt-0.5 sm:mt-1 text-lg sm:text-xl font-bold text-white font-serif">
                    Recent Orders
                  </h2>
                </div>
                <Link
                  to="/admin/orders"
                  className="text-[10px] sm:text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 bg-emerald-900/20 px-3 py-1.5 rounded-full"
                >
                  View All{" "}
                  <ArrowUpRight size={12} className="sm:w-3.5 sm:h-3.5" />
                </Link>
              </div>

              {loading ? (
                <LoadingRow message="Loading orders..." />
              ) : recentOrders.length === 0 ? (
                <EmptyState icon={ShoppingBag} message="No orders yet." />
              ) : (
                <div className="divide-y divide-emerald-900/30">
                  {recentOrders.map((order) => (
                    <Link
                      key={order._id}
                      to={`/admin/orders/${order._id}`}
                      className="flex items-center justify-between py-3.5 sm:py-4 transition hover:bg-[#16231D] px-2 sm:px-3 -mx-2 sm:mx-0 rounded-xl sm:rounded-2xl group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white group-hover:text-emerald-400 transition-colors text-xs sm:text-sm">
                            #{order._id.slice(-6).toUpperCase()}
                          </p>
                          {/* Inline Badge Logic */}
                          {order.orderType === "B2B" ? (
                            <span className="rounded bg-amber-900/40 px-1.5 py-0.5 text-[8px] font-bold text-amber-400 uppercase">
                              B2B
                            </span>
                          ) : order.fulfillmentType === "FRANCHISE" ? (
                            <span className="rounded bg-blue-900/40 px-1.5 py-0.5 text-[8px] font-bold text-blue-400 uppercase">
                              Local
                            </span>
                          ) : (
                            <span className="rounded bg-emerald-900/40 px-1.5 py-0.5 text-[8px] font-bold text-emerald-400 uppercase">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[10px] sm:text-xs text-[#F5F2EB]/60">
                          {order.user?.name || "Guest"} •{" "}
                          {order.items?.length || 0} items
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-emerald-300 text-xs sm:text-sm">
                          ₹{Number(order.total || 0).toLocaleString("en-IN")}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold bg-[#080D0A] text-emerald-400 border border-emerald-500/20">
                          {order.orderStatus}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* RIGHT: Recent Enquiries */}
          <section className="rounded-[1.5rem] sm:rounded-[2.5rem] border border-emerald-900/30 bg-[#121E1A] p-5 sm:p-8 shadow-lg flex flex-col justify-between">
            <div>
              <div className="mb-5 sm:mb-6 flex items-center justify-between">
                <div>
                  <span className="eyebrow text-emerald-400/80 text-[9px] sm:text-[10px]">
                    Business
                  </span>
                  <h2 className="mt-0.5 sm:mt-1 text-lg sm:text-xl font-bold text-white font-serif">
                    Recent Enquiries
                  </h2>
                </div>
                <Link
                  to="/admin/enquiries"
                  className="text-[10px] sm:text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 bg-emerald-900/20 px-3 py-1.5 rounded-full"
                >
                  View All{" "}
                  <ArrowUpRight size={12} className="sm:w-3.5 sm:h-3.5" />
                </Link>
              </div>

              {loading ? (
                <LoadingRow message="Loading enquiries..." />
              ) : recentEnquiries.length === 0 ? (
                <EmptyState icon={MessageSquare} message="No enquiries yet." />
              ) : (
                <div className="divide-y divide-emerald-900/30">
                  {recentEnquiries.map((enquiry) => (
                    <Link
                      key={enquiry._id}
                      to={`/admin/enquiries/${enquiry._id}`}
                      className="flex items-center justify-between py-3.5 sm:py-4 transition hover:bg-[#16231D] px-2 sm:px-3 -mx-2 sm:mx-0 rounded-xl sm:rounded-2xl group"
                    >
                      <div className="mr-3">
                        <p className="font-bold text-white group-hover:text-emerald-400 transition-colors text-xs sm:text-sm line-clamp-1">
                          {enquiry.company || enquiry.name || "New enquiry"}
                        </p>
                        <p className="mt-0.5 text-[10px] sm:text-xs text-[#F5F2EB]/60 line-clamp-1">
                          {enquiry.email}
                        </p>
                      </div>
                      <div className="shrink-0">
                        <StatusBadge status={enquiry.status} />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ========================================================= */}
        {/* 🌟 5. FRANCHISE PIPELINE FULL WIDTH SECTION                 */}
        {/* ========================================================= */}
        <section className="pt-2 pb-12">
          <div className="mb-4 sm:mb-5 flex items-center justify-between">
            <div>
              <span className="eyebrow text-emerald-400/80 text-[9px] sm:text-[10px]">
                Partnership Program
              </span>
              <h2 className="mt-0.5 sm:mt-1 text-xl sm:text-2xl font-bold text-white font-serif">
                Franchise Pipeline
              </h2>
            </div>
            <Link
              to="/admin/franchise"
              className="text-[10px] sm:text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 bg-emerald-900/20 px-3 py-1.5 rounded-full shrink-0"
            >
              <span className="hidden sm:inline">View All Approvals</span>
              <span className="sm:hidden">View All</span>
              <ArrowUpRight size={12} className="sm:w-3.5 sm:h-3.5" />
            </Link>
          </div>

          <div className="overflow-hidden rounded-[1.5rem] sm:rounded-3xl border border-emerald-900/30 bg-[#121E1A] shadow-lg">
            {loading ? (
              <LoadingRow message="Loading franchise requests..." />
            ) : recentFranchise.length === 0 ? (
              <EmptyState
                icon={Store}
                message="No franchise enquiries received yet."
              />
            ) : (
              <div className="divide-y divide-emerald-900/30">
                {recentFranchise.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col gap-4 p-4 sm:p-6 transition hover:bg-[#16231D] md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5 sm:mb-0">
                        <h4 className="font-serif text-base sm:text-lg font-bold text-white">
                          {item.name}
                        </h4>
                        <span
                          className={`px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-[9px] sm:text-xs font-bold border ${item.status === "Approved" ? "bg-emerald-900/40 text-emerald-400 border-emerald-500/20" : item.status === "Rejected" ? "bg-red-950/40 text-red-400 border-red-900/50" : "bg-amber-900/40 text-amber-400 border-amber-500/30"}`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-sm text-[#F5F2EB]/60">
                        {item.email} • {item.phone}
                      </p>
                      <p className="mt-1 sm:mt-1.5 text-[10px] sm:text-xs text-[#F5F2EB]/40 font-medium">
                        Location:{" "}
                        <span className="text-emerald-300">
                          {item.city}, {item.state}
                        </span>{" "}
                        <span className="mx-1 opacity-50">|</span> Budget:{" "}
                        <span className="text-emerald-300">{item.budget}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 sm:pt-0 mt-2 sm:mt-0 border-t border-emerald-900/20 sm:border-0">
                      {item.status !== "Approved" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(item._id, "Approved")
                          }
                          disabled={actionLoading === item._id}
                          className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl sm:rounded-full bg-emerald-600 text-white text-[10px] sm:text-xs font-bold transition hover:bg-emerald-500 cursor-pointer"
                        >
                          <CheckCircle
                            size={12}
                            className="sm:w-3.5 sm:h-3.5"
                          />{" "}
                          Approve
                        </button>
                      )}
                      {item.status !== "Rejected" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(item._id, "Rejected")
                          }
                          disabled={actionLoading === item._id}
                          className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl sm:rounded-full bg-red-950 border border-red-900 text-red-400 text-[10px] sm:text-xs font-bold transition hover:bg-red-900 hover:text-white cursor-pointer"
                        >
                          <XCircle size={12} className="sm:w-3.5 sm:h-3.5" />{" "}
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

// 🌟 SMART FINANCIAL STAT CARD
function StatCard({ icon: Icon, label, value, sub, href, theme = "emerald" }) {
  const themeColors = {
    emerald:
      "bg-emerald-900/30 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
    amber:
      "bg-amber-900/30 border-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
    blue: "bg-blue-900/30 border-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]",
  };

  const content = (
    <div className="group rounded-[1.25rem] sm:rounded-[2rem] border border-emerald-900/30 bg-[#121E1A] p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 shadow-md flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-2xl border ${themeColors[theme]} shrink-0`}
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        {href && (
          <ArrowUpRight className="w-4 h-4 text-[#F5F2EB]/30 transition group-hover:text-emerald-400" />
        )}
      </div>
      <div>
        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#F5F2EB]/50">
          {label}
        </p>
        <p className="mt-1 text-xl sm:text-3xl font-bold font-serif text-white truncate">
          {value}
        </p>
        {sub && (
          <p className="mt-1 text-[9px] sm:text-[11px] text-[#F5F2EB]/40 font-medium line-clamp-1">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
  if (href)
    return (
      <Link to={href} className="block h-full">
        {content}
      </Link>
    );
  return <div className="h-full">{content}</div>;
}

// 🌟 COMPACT SECONDARY METRIC CARD
function MiniStat({ icon: Icon, label, value, href, highlight }) {
  const content = (
    <div
      className={`rounded-2xl border p-3 sm:p-4 transition hover:bg-[#16231D] ${highlight ? "bg-amber-950/20 border-amber-900/50" : "bg-[#080D0A] border-emerald-900/30"}`}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={`w-4 h-4 sm:w-5 sm:h-5 ${highlight ? "text-amber-500" : "text-emerald-500"}`}
        />
        <div>
          <p className="text-sm sm:text-base font-bold text-white font-serif">
            {value}
          </p>
          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#F5F2EB]/40">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
  if (href) return <Link to={href}>{content}</Link>;
  return content;
}

function StatusBadge({ status }) {
  return (
    <span className="whitespace-nowrap rounded-full bg-[#080D0A] border border-emerald-500/20 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[9px] sm:text-xs font-bold text-emerald-400 shadow-sm">
      {status || "Unknown"}
    </span>
  );
}

function LoadingRow({ message }) {
  return (
    <div className="p-6 sm:p-8 text-center text-xs sm:text-sm text-[#F5F2EB]/50">
      {message}
    </div>
  );
}

function EmptyState({ icon: Icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center">
      <div className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-emerald-900/20 text-emerald-500/50">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-[#F5F2EB]/50">
        {message}
      </p>
    </div>
  );
}
