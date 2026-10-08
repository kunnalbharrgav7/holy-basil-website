import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  IndianRupee,
  Store,
  CheckCircle,
  Clock,
  Filter,
  X,
} from "lucide-react";
import {
  getRoyaltySummary,
  updateRoyaltyStatus,
} from "../services/orderService";

export default function AdminRoyalties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get("status");
  const [royaltyData, setRoyaltyData] = useState({
    totalRoyaltyGenerated: 0,
    totalPendingRoyalty: 0,
    orders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRoyalties = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getRoyaltySummary();
      setRoyaltyData(
        data || {
          totalRoyaltyGenerated: 0,
          totalPendingRoyalty: 0,
          orders: [],
        },
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch royalties",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoyalties();
  }, []);

  const handleMarkAsPaid = async (orderId) => {
    try {
      await updateRoyaltyStatus(orderId, "Paid");
      fetchRoyalties(); // Refresh data after update
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update royalty status");
    }
  };

  const clearFilter = () => {
    setSearchParams({});
  };

  const filteredOrders =
    statusFilter === "pending"
      ? royaltyData.orders.filter((order) => order.royaltyStatus === "Pending")
      : royaltyData.orders;

  return (
    <main className="min-h-screen px-3 py-6 sm:px-6 lg:px-8 bg-[#080D0A] text-[#F5F2EB]">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col gap-3 sm:gap-4 border-b border-emerald-900/30 pb-4 sm:pb-6">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-emerald-400 hover:text-emerald-300 w-fit uppercase tracking-widest bg-emerald-900/20 px-3 py-1.5 rounded-full"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-1 sm:mt-2">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-400/80">
                FOFO Management
              </span>
              <h1 className="mt-1 text-3xl sm:text-4xl font-bold font-serif text-white">
                Royalty Ledger (Admin Collection)
              </h1>
            </div>
            <button
              onClick={fetchRoyalties}
              disabled={loading}
              className="btn-outline w-full sm:w-auto justify-center py-2.5 px-5 text-[11px] sm:text-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />{" "}
              Refresh Data
            </button>
          </div>
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="rounded-2xl border border-red-900/50 bg-red-950/40 px-4 py-3 sm:px-5 sm:py-4 text-xs sm:text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ACTIVE FILTER BANNER */}
        {statusFilter === "pending" && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-amber-900/20 border border-amber-500/30 px-4 sm:px-5 py-3 text-xs sm:text-sm text-amber-400">
            <div className="flex items-center gap-2 font-bold">
              <Filter size={16} className="shrink-0" /> Showing strictly
              'Pending' royalty records owed by franchises
            </div>
            <button
              onClick={clearFilter}
              className="inline-flex justify-center items-center gap-1 text-[10px] sm:text-xs font-bold text-white hover:text-amber-400 bg-[#080D0A] px-3 py-1.5 rounded-full border border-amber-900/40 transition shrink-0 cursor-pointer"
            >
              <X size={14} /> View All
            </button>
          </div>
        )}

        {/* 🌟 SUMMARY CARDS (Clickable to Filter) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          {/* Total Generated Card */}
          <div
            onClick={() => clearFilter()}
            className={`cursor-pointer rounded-[1.5rem] sm:rounded-[2.5rem] border p-4 sm:p-8 shadow-lg transition-all hover:border-emerald-500/50 ${!statusFilter ? "bg-gradient-to-br from-[#121E1A] to-[#0B1310] border-emerald-500 ring-2 ring-emerald-500/20" : "bg-gradient-to-br from-[#121E1A] to-[#0B1310] border-emerald-900/30"}`}
          >
            <p className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[#F5F2EB]/50 flex items-center gap-1.5 sm:gap-2 truncate">
              <IndianRupee
                size={12}
                className="sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0"
              />{" "}
              Total Generated (Click to View All)
            </p>
            <p className="mt-2 sm:mt-3 text-xl sm:text-4xl font-bold font-serif text-white truncate">
              ₹
              {(royaltyData.totalRoyaltyGenerated || 0).toLocaleString("en-IN")}
            </p>
          </div>

          {/* Total Pending Card */}
          <div
            onClick={() => setSearchParams({ status: "pending" })}
            className={`cursor-pointer rounded-[1.5rem] sm:rounded-[2.5rem] border p-4 sm:p-8 shadow-lg transition-all hover:border-amber-500/50 ${statusFilter === "pending" ? "bg-gradient-to-br from-[#1a1810] to-[#0D0A08] border-amber-500 ring-2 ring-amber-500/20 scale-[1.02]" : "bg-gradient-to-br from-[#1a1810] to-[#0D0A08] border-amber-900/30"}`}
          >
            <p className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[#F5F2EB]/50 flex items-center gap-1.5 sm:gap-2 truncate">
              <Clock
                size={12}
                className="sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0"
              />{" "}
              Total Pending Dues (Click to Filter)
            </p>
            <p className="mt-2 sm:mt-3 text-xl sm:text-4xl font-bold font-serif text-amber-400 truncate">
              ₹{(royaltyData.totalPendingRoyalty || 0).toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* TABLE & MOBILE CARD VIEW */}
        <div className="overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] border border-emerald-900/30 bg-[#121E1A] shadow-lg">
          {loading ? (
            <div className="p-10 sm:p-16 text-center text-xs sm:text-sm text-[#F5F2EB]/50">
              Loading database records...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 sm:p-16 text-center">
              <Store
                size={28}
                className="sm:w-8 sm:h-8 text-emerald-500/30 mb-3"
              />
              <p className="text-xs sm:text-sm text-[#F5F2EB]/50 font-serif">
                No {statusFilter === "pending" ? "pending" : ""} royalty records
                found.
              </p>
            </div>
          ) : (
            <>
              {/* 📱 MOBILE CARD VIEW */}
              <div className="md:hidden divide-y divide-emerald-900/30">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    className="p-4 flex flex-col gap-3 hover:bg-[#16231D] transition-colors"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-bold text-white text-sm">
                          #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <p className="font-semibold text-emerald-300 text-xs flex items-center gap-1 mt-1">
                          <Store size={12} /> {order.user?.name || "Unknown"}
                        </p>
                        <p className="text-[10px] text-[#F5F2EB]/50 mt-0.5 truncate max-w-[180px]">
                          {order.user?.email}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-serif font-bold text-emerald-400 text-sm">
                          ₹{order.royaltyAmount?.toLocaleString("en-IN")}
                        </p>
                        <span className="text-[9px] text-emerald-400/60 block">
                          ({order.royaltyPercentage || 5}%)
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-emerald-900/20">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#F5F2EB]/60">
                          Order Val: ₹{order.total?.toLocaleString("en-IN")}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${order.royaltyStatus === "Paid" ? "bg-emerald-900/30 text-emerald-400 border-emerald-500/20" : "bg-amber-900/30 text-amber-400 border-amber-500/20"}`}
                        >
                          {order.royaltyStatus === "Paid" ? (
                            <CheckCircle size={10} />
                          ) : (
                            <Clock size={10} />
                          )}
                          {order.royaltyStatus || "Pending"}
                        </span>
                      </div>

                      <div>
                        {order.royaltyStatus !== "Paid" ? (
                          <button
                            onClick={() => handleMarkAsPaid(order._id)}
                            className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-500 transition shadow-sm cursor-pointer"
                          >
                            Mark Paid
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-[#F5F2EB]/30 flex items-center gap-1">
                            <CheckCircle size={12} /> Settled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 💻 DESKTOP TABLE VIEW */}
              <div className="hidden md:block overflow-x-auto custom-scrollbar">
                <table className="w-full min-w-[950px]">
                  <thead>
                    <tr className="border-b border-emerald-900/30 text-left bg-[#0B1310]">
                      {[
                        "Order ID",
                        "Franchise Details",
                        "Order Value",
                        "Royalty Amount",
                        "Status",
                        "Action",
                      ].map((head) => (
                        <th
                          key={head}
                          className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-emerald-400/60"
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/20">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-[#16231D] transition-colors"
                      >
                        <td className="px-6 py-5 font-bold text-white text-sm">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-semibold text-emerald-300 text-sm flex items-center gap-1.5">
                            <Store size={14} /> {order.user?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-[#F5F2EB]/50 mt-1">
                            {order.user?.email}
                          </p>
                        </td>
                        <td className="px-6 py-5 text-sm text-[#F5F2EB]/80">
                          ₹{order.total?.toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-5 font-serif font-bold text-emerald-400 text-base">
                          ₹{order.royaltyAmount?.toLocaleString("en-IN")}
                          <span className="text-[10px] text-emerald-400/50 block font-sans">
                            ({order.royaltyPercentage || 5}%)
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${order.royaltyStatus === "Paid" ? "bg-emerald-900/30 text-emerald-400 border-emerald-500/20" : "bg-amber-900/30 text-amber-400 border-amber-500/20"}`}
                          >
                            {order.royaltyStatus === "Paid" ? (
                              <CheckCircle size={12} />
                            ) : (
                              <Clock size={12} />
                            )}{" "}
                            {order.royaltyStatus || "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          {order.royaltyStatus !== "Paid" ? (
                            <button
                              onClick={() => handleMarkAsPaid(order._id)}
                              className="px-4 py-2 rounded-full bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-500 transition shadow-sm cursor-pointer"
                            >
                              Mark as Paid
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-[#F5F2EB]/30 flex items-center gap-1.5">
                              <CheckCircle size={14} /> Settled
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
