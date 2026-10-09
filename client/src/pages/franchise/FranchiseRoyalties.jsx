import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Receipt,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { StatsSkeleton, TableSkeleton } from "../../components/Skeletons";

export default function FranchiseRoyalties() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ paid: 0, pending: 0, total: 0 });

  useEffect(() => {
    const fetchRoyalties = async () => {
      try {
        const { data } = await api.get("/orders/mine");
        const b2bOrders = data.filter((o) => o.orderType === "B2B");

        let paid = 0;
        let pending = 0;

        b2bOrders.forEach((order) => {
          const amt = order.royaltyAmount || 0;
          if (order.royaltyStatus === "Paid") {
            paid += amt;
          } else if (order.royaltyStatus === "Pending") {
            pending += amt;
          }
        });

        setStats({
          paid,
          pending,
          total: paid + pending,
        });

        setOrders(b2bOrders);
      } catch (err) {
        console.error("Failed to fetch royalty ledger:", err);
        toast.error("Failed to load royalty ledger");
      } finally {
        setLoading(false);
      }
    };
    fetchRoyalties();
  }, []);

  return (
    <div className="mx-auto max-w-7xl pb-24 animate-in fade-in duration-300 px-2 sm:px-4">
      {/* Header */}
      <div className="mb-8 border-b border-emerald-900/30 pb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400">
          Brand Fee & Compliance
        </span>
        <h1 className="mt-1 font-serif text-3xl font-bold text-white md:text-4xl">
          Franchise Royalty Ledger
        </h1>
        <p className="mt-2 text-xs text-[#F5F2EB]/60">
          Track brand royalty fees assessed on wholesale orders and monitor your
          settlement status with Holy Basil Ayurveda.
        </p>
      </div>

      {loading ? (
        <>
          <StatsSkeleton count={3} />
          <TableSkeleton rows={4} columns={6} />
        </>
      ) : (
        <>
          {/* Stats Cards (Liability View) */}
          <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {/* Total Incurred */}
            <div className="rounded-[2rem] border border-emerald-900/40 bg-gradient-to-br from-[#121E1A] to-[#0B1310] p-6 shadow-lg">
              <div className="mb-3 inline-flex rounded-xl bg-emerald-900/20 border border-emerald-500/20 p-3 text-emerald-400">
                <Receipt size={20} />
              </div>
              <p className="text-xs text-[#F5F2EB]/60 font-medium">
                Total Royalty Incurred
              </p>
              <p className="mt-1 font-serif text-3xl font-bold text-white">
                ₹{stats.total.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Paid / Cleared */}
            <div className="rounded-[2rem] border border-emerald-900/40 bg-gradient-to-br from-[#121E1A] to-[#0B1310] p-6 shadow-lg">
              <div className="mb-3 inline-flex rounded-xl bg-emerald-900/20 border border-emerald-500/20 p-3 text-emerald-400">
                <CheckCircle2 size={20} />
              </div>
              <p className="text-xs text-[#F5F2EB]/60 font-medium">
                Paid / Settled to Brand
              </p>
              <p className="mt-1 font-serif text-3xl font-bold text-emerald-400">
                ₹{stats.paid.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Outstanding Dues */}
            <div className="rounded-[2rem] border border-amber-900/40 bg-gradient-to-br from-[#121E1A] to-[#0B1310] p-6 shadow-lg">
              <div className="mb-3 inline-flex rounded-xl bg-amber-900/20 border border-amber-500/20 p-3 text-amber-400">
                <AlertCircle size={20} />
              </div>
              <p className="text-xs text-[#F5F2EB]/60 font-medium">
                Outstanding Dues (Payable)
              </p>
              <p className="mt-1 font-serif text-3xl font-bold text-amber-400">
                ₹{stats.pending.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Transaction Ledger Table */}
          <div className="rounded-[2.5rem] border border-emerald-900/30 bg-[#121E1A] p-6 sm:p-8 shadow-lg">
            <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-emerald-900/30 pb-4">
              <h3 className="font-serif text-xl font-bold text-white">
                Royalty Assessment Breakdown
              </h3>
              <span className="text-[11px] text-emerald-400/70 font-mono uppercase">
                Calculated per order value
              </span>
            </div>

            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#F5F2EB]/80">
                  <thead className="text-[10px] uppercase tracking-widest text-emerald-400/60 border-b border-emerald-900/30">
                    <tr>
                      <th className="pb-4 font-semibold">Order ID</th>
                      <th className="pb-4 font-semibold">Date</th>
                      <th className="pb-4 font-semibold">Order Value</th>
                      <th className="pb-4 font-semibold">Royalty Rate</th>
                      <th className="pb-4 font-semibold">Royalty Fee</th>
                      <th className="pb-4 font-semibold text-right">
                        Settlement Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/30">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="transition-colors hover:bg-emerald-900/10"
                  >
                    <td className="py-4 font-bold text-white">
                      #{order._id.substring(order._id.length - 8).toUpperCase()}
                    </td>
                    <td className="py-4 text-xs text-[#F5F2EB]/60">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
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
                    <td className="py-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          order.royaltyStatus === "Paid"
                            ? "bg-emerald-900/30 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-900/20 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {order.royaltyStatus === "Paid" ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                        {order.royaltyStatus === "Paid"
                          ? "Cleared"
                          : "Dues Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-[#F5F2EB]/50">
            <p className="font-serif text-lg">
              No royalty assessments recorded yet.
            </p>
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
}
