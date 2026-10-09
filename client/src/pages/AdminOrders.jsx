import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Eye, RefreshCw, ShoppingBag, Filter, X, MapPin } from "lucide-react";
import { getAdminOrders, updateOrderStatus } from "../services/orderService";
import { StatsSkeleton, TableSkeleton } from "../components/Skeletons";

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];
const PAYMENT_STATUSES = ["Pending", "Paid", "Completed", "Failed", "Refunded"];

export default function AdminOrders() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 🌟 1. EXTRACT NEW SMART PARAMETERS FROM URL
  const statusFilter = searchParams.get("status");
  const viewFilter = searchParams.get("view");
  const fulfillmentFilter = searchParams.get("fulfillment");
  const revenueFilter = searchParams.get("revenue"); // Kept for backward compatibility

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminOrders();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // 🌟 2. SMART FILTERING LOGIC
  let filteredOrders = orders;

  if (viewFilter === "admin_revenue") {
    // Sirf wo orders jo Admin ne fulfill kiye aur payment aa gayi
    filteredOrders = orders.filter(
      (o) =>
        o.fulfillmentType !== "FRANCHISE" &&
        o.orderType !== "B2B" &&
        (o.paymentStatus === "Completed" || o.paymentStatus === "Paid"),
    );
  } else if (viewFilter === "pending_settlements") {
    // Sirf wo orders jahan Franchise ne deliver kiya, par online payment (Admin ke paas) hai
    filteredOrders = orders.filter(
      (o) =>
        o.fulfillmentType === "FRANCHISE" &&
        o.paymentMethod === "online" &&
        o.orderStatus === "Delivered",
    );
  } else if (fulfillmentFilter) {
    // Franchise ne kitne orders handle kiye (overall)
    filteredOrders = orders.filter(
      (o) => o.fulfillmentType === fulfillmentFilter,
    );
  } else if (statusFilter) {
    // Jaise Pending Orders
    filteredOrders = orders.filter((o) => o.orderStatus === statusFilter);
  } else if (revenueFilter) {
    // Old fallback
    filteredOrders = orders.filter(
      (o) =>
        (o.paymentStatus === "Paid" || o.paymentStatus === "Completed") &&
        o.orderStatus === "Delivered",
    );
  }

  const handleStatusChange = async (id, field, value) => {
    try {
      setUpdatingId(id);
      setError("");
      const updated = await updateOrderStatus(id, { [field]: value });
      setOrders((current) =>
        current.map((order) => (order._id === id ? updated : order)),
      );
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Unable to update order.");
    } finally {
      setUpdatingId(null);
    }
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  // Check if any filter is active for the banner
  const hasActiveFilters =
    viewFilter || fulfillmentFilter || statusFilter || revenueFilter;

  return (
    <main className="min-h-screen px-3 py-6 sm:px-6 lg:px-8 lg:py-12 bg-[#080D0A] text-[#F5F2EB]">
      <div className="container-hba max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between border-b border-emerald-900/30 pb-4 sm:pb-6">
          <div>
            <span className="eyebrow block text-emerald-400/80 text-[10px] sm:text-[11px]">
              Commerce
            </span>
            <h1 className="mt-1 sm:mt-2 text-3xl sm:text-5xl font-bold text-white font-serif">
              Orders Management
            </h1>
            <p className="mt-1.5 sm:mt-2 text-[#F5F2EB]/60 text-xs sm:text-sm">
              Manage customer orders, track payments, and monitor hyperlocal
              fulfillment statuses.
            </p>
          </div>
          <button
            onClick={loadOrders}
            disabled={loading}
            className="btn-outline inline-flex items-center justify-center gap-2 py-2.5 px-5 text-[11px] sm:text-xs w-full md:w-auto"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />{" "}
            Refresh Data
          </button>
        </div>

        {/* 🌟 3. DYNAMIC ACTIVE FILTER NOTIFICATION BANNER */}
        {hasActiveFilters && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-emerald-900/20 border border-emerald-500/30 px-4 sm:px-5 py-3 text-xs sm:text-sm text-emerald-300">
            <div className="flex items-center gap-2">
              <Filter size={16} className="shrink-0" />
              <span>
                Showing filtered view:{" "}
                <strong>
                  {viewFilter === "admin_revenue" && "Direct Admin Revenue"}
                  {viewFilter === "pending_settlements" &&
                    "Pending Settlements"}
                  {fulfillmentFilter === "FRANCHISE" &&
                    "Franchise Handled Orders"}
                  {statusFilter && `Status: ${statusFilter}`}
                  {revenueFilter && !viewFilter && "Verified Revenue Orders"}
                </strong>{" "}
                ({filteredOrders.length} results)
              </span>
            </div>
            <button
              onClick={clearFilters}
              className="inline-flex justify-center items-center gap-1 text-[10px] sm:text-xs font-bold text-white hover:text-emerald-400 bg-[#080D0A] px-3 py-1.5 sm:py-2 rounded-full border border-emerald-900/40 shrink-0"
            >
              <X size={14} /> Clear Filter
            </button>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-900/50 bg-red-950/40 px-4 py-3 sm:px-5 sm:py-4 text-xs sm:text-sm text-red-400">
            {error}
          </div>
        )}

        {/* SUMMARY CARDS - Responsive Grid */}
        {loading ? (
          <StatsSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            <SummaryCard label="Total Orders" value={orders.length} />
            <SummaryCard
              label="Pending Fulfillment"
              value={
                orders.filter((order) => order.orderStatus === "Pending").length
              }
            />
            <SummaryCard
              label="Franchise Handled"
              value={
                orders.filter((order) => order.fulfillmentType === "FRANCHISE")
                  .length
              }
            />
            <SummaryCard
              label="Successfully Delivered"
              value={
                orders.filter((order) => order.orderStatus === "Delivered").length
              }
            />
          </div>
        )}

        {/* ORDERS TABLE SECTION */}
        <section>
          <div className="overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] border border-emerald-900/30 bg-[#121E1A] shadow-lg mt-8">
            {loading ? (
              <TableSkeleton rows={6} columns={7} />
            ) : filteredOrders.length === 0 ? (
              <EmptyOrders />
            ) : (
              <>
                {/* 📱 MOBILE VIEW: CARDS */}
                <div className="md:hidden divide-y divide-emerald-900/30">
                  {filteredOrders.map((order) => (
                    <MobileOrderCard
                      key={order._id}
                      order={order}
                      updating={updatingId === order._id}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>

                {/* 💻 DESKTOP VIEW: TABLE */}
                <div className="hidden md:block overflow-x-auto custom-scrollbar">
                  <table className="w-full min-w-[1050px]">
                    <thead>
                      <tr className="border-b border-emerald-900/30 text-left bg-[#0B1310]">
                        {[
                          "Order",
                          "Customer",
                          "Total",
                          "Payment Status",
                          "Order Status",
                          "Fulfillment",
                          "Date",
                          "View",
                        ].map((head) => (
                          <th
                            key={head}
                            className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-emerald-400/60"
                          >
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <OrderRow
                          key={order._id}
                          order={order}
                          updating={updatingId === order._id}
                          onStatusChange={handleStatusChange}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

// 🌟 Helper Component for Smart Fulfillment Badges
function FulfillmentBadge({ order }) {
  if (order.orderType === "B2B") {
    return (
      <span className="rounded border border-amber-500/30 bg-amber-900/40 px-1.5 py-0.5 text-[8px] font-bold text-amber-400 uppercase tracking-wider shadow-sm flex items-center gap-1 w-fit">
        B2B Wholesale
      </span>
    );
  }

  if (order.fulfillmentType === "FRANCHISE") {
    return (
      <span
        className="rounded border border-blue-500/30 bg-blue-900/40 px-1.5 py-0.5 text-[8px] font-bold text-blue-400 uppercase tracking-wider shadow-sm flex items-center gap-1 w-fit"
        title={`Routing Stage: ${order.routingStage}`}
      >
        <MapPin size={8} /> Franchise Local
      </span>
    );
  }

  return (
    <span className="rounded border border-emerald-500/30 bg-emerald-900/40 px-1.5 py-0.5 text-[8px] font-bold text-emerald-400 uppercase tracking-wider shadow-sm flex items-center gap-1 w-fit">
      Central Admin
    </span>
  );
}

// 🌟 Mobile-Optimized Order Card
function MobileOrderCard({ order, updating, onStatusChange }) {
  return (
    <div className="p-4 hover:bg-[#16231D] transition-colors flex flex-col gap-3">
      <div className="flex justify-between items-start gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="font-bold text-emerald-400 text-sm">
              #{order._id.slice(-6).toUpperCase()}
            </p>
            <FulfillmentBadge order={order} />
          </div>
          <p className="font-semibold text-white text-xs truncate max-w-[150px]">
            {order.user?.name || "Guest Customer"}
          </p>
          <p className="text-[10px] text-[#F5F2EB]/50 mt-0.5">
            {order.items?.length || 0} item
            {order.items?.length === 1 ? "" : "s"} •{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN")}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <p className="font-bold text-emerald-300 font-serif text-base">
            ₹{Number(order.total || 0).toLocaleString("en-IN")}
          </p>
          <Link
            to={`/admin/orders/${order._id}`}
            className="grid h-8 w-8 place-items-center rounded-full bg-emerald-900/30 text-emerald-400 transition hover:bg-emerald-600 hover:text-white border border-emerald-500/20"
          >
            <Eye size={14} />
          </Link>
        </div>
      </div>

      <div className="flex gap-2 mt-1">
        <select
          value={order.paymentStatus || "Pending"}
          disabled={updating}
          onChange={(e) =>
            onStatusChange(order._id, "paymentStatus", e.target.value)
          }
          className="flex-1 rounded-xl border border-emerald-900/40 bg-[#080D0A] px-2.5 py-2 text-[10px] sm:text-xs font-bold text-emerald-400 outline-none focus:border-emerald-500/50 cursor-pointer"
        >
          {PAYMENT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select
          value={order.orderStatus || "Pending"}
          disabled={updating}
          onChange={(e) =>
            onStatusChange(order._id, "orderStatus", e.target.value)
          }
          className="flex-1 rounded-xl border border-emerald-900/40 bg-[#080D0A] px-2.5 py-2 text-[10px] sm:text-xs font-bold text-emerald-400 outline-none focus:border-emerald-500/50 cursor-pointer"
        >
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// 🌟 Desktop Order Row
function OrderRow({ order, updating, onStatusChange }) {
  return (
    <tr className="border-b border-emerald-900/20 last:border-0 hover:bg-[#16231D] transition-colors">
      <td className="px-6 py-5">
        <div className="flex flex-col gap-1">
          <p className="font-bold text-emerald-400">
            #{order._id.slice(-6).toUpperCase()}
          </p>
          <p className="mt-1 text-xs text-[#F5F2EB]/40">
            {order.items?.length || 0} item
            {order.items?.length === 1 ? "" : "s"}
          </p>
        </div>
      </td>
      <td className="px-6 py-5">
        <p className="font-semibold text-white">
          {order.user?.name || "Guest Customer"}
        </p>
        <p className="mt-1 text-xs text-[#F5F2EB]/50">
          {order.user?.email || "No email"}
        </p>
      </td>
      <td className="px-6 py-5 text-emerald-300 font-bold font-serif">
        ₹{Number(order.total || 0).toLocaleString("en-IN")}
      </td>
      <td className="px-6 py-5">
        <select
          value={order.paymentStatus || "Pending"}
          disabled={updating}
          onChange={(event) =>
            onStatusChange(order._id, "paymentStatus", event.target.value)
          }
          className="rounded-full border border-emerald-900/40 bg-[#080D0A] px-3.5 py-2 text-xs font-bold text-emerald-400 outline-none focus:border-emerald-500/50 cursor-pointer"
        >
          {PAYMENT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </td>
      <td className="px-6 py-5">
        <select
          value={order.orderStatus || "Pending"}
          disabled={updating}
          onChange={(event) =>
            onStatusChange(order._id, "orderStatus", event.target.value)
          }
          className="rounded-full border border-emerald-900/40 bg-[#080D0A] px-3.5 py-2 text-xs font-bold text-emerald-400 outline-none focus:border-emerald-500/50 cursor-pointer"
        >
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </td>

      {/* 👇 New Column for Fulfillment Identity */}
      <td className="px-6 py-5">
        <FulfillmentBadge order={order} />
      </td>

      <td className="px-6 py-5 text-sm text-[#F5F2EB]/50">
        {new Date(order.createdAt).toLocaleDateString("en-IN")}
      </td>
      <td className="px-6 py-5">
        <Link
          to={`/admin/orders/${order._id}`}
          className="grid h-9 w-9 place-items-center rounded-full bg-emerald-900/30 text-emerald-400 transition hover:bg-emerald-600 hover:text-white border border-emerald-500/20"
          title="View Order Details"
        >
          <Eye size={16} />
        </Link>
      </td>
    </tr>
  );
}

// 🌟 Responsive Summary Card
function SummaryCard({ label, value, fullWidthMobile }) {
  return (
    <div
      className={`rounded-[1.25rem] sm:rounded-[2rem] border border-emerald-900/30 bg-[#121E1A] p-4 sm:p-6 shadow-md h-full flex flex-col justify-center ${fullWidthMobile ? "col-span-2 lg:col-span-1" : ""}`}
    >
      <p className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[#F5F2EB]/50">
        {label}
      </p>
      <p className="mt-1 sm:mt-2 text-xl sm:text-3xl font-bold font-serif text-white">
        {value}
      </p>
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 sm:py-20 text-center">
      <div className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full bg-emerald-900/20 text-emerald-500/50">
        <ShoppingBag size={22} className="sm:w-6 sm:h-6" />
      </div>
      <p className="mt-4 sm:mt-5 text-lg sm:text-xl font-bold text-white font-serif">
        No orders match this filter
      </p>
      <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-[#F5F2EB]/50">
        Try clearing your query or checking back later.
      </p>
    </div>
  );
}
