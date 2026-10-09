import { useState, useEffect } from "react";
import api from "../../services/api";
import { Package, History, Loader2, MinusCircle, X, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function FranchiseStock() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for local sale/adjustment
  const [selectedStock, setSelectedStock] = useState(null);
  const [subtractQty, setSubtractQty] = useState("");
  const [saleNote, setSaleNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const { data } = await api.get("/franchise-stock");
      setStocks(data);
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
      toast.error("Failed to load local stock inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustStock = async (e) => {
    e.preventDefault();
    if (!selectedStock) return;

    const qty = Number(subtractQty);
    if (!qty || qty <= 0) {
      toast.error("Enter a valid quantity to reduce");
      return;
    }

    if (qty > selectedStock.quantity) {
      toast.error(
        `Cannot reduce more than available stock (${selectedStock.quantity})`,
      );
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await api.patch(
        `/franchise-stock/${selectedStock._id}/adjust`,
        {
          quantityToSubtract: qty,
          note: saleNote || "Local retail sale",
        },
      );

      // Update state locally
      setStocks((prev) =>
        prev.map((item) => (item._id === data._id ? data : item)),
      );

      toast.success("Stock updated successfully!");
      setSelectedStock(null);
      setSubtractQty("");
      setSaleNote("");
    } catch (err) {
      console.error("Failed to adjust stock:", err);
      toast.error(err.response?.data?.message || "Failed to update stock");
    } finally {
      setSubmitting(false);
    }
  };

  const StockSkeleton = () => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col justify-between rounded-[2rem] border border-emerald-900/30 bg-[#121E1A] p-6 shadow-lg animate-pulse"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-2xl bg-emerald-900/30"></div>
            <div className="space-y-2">
              <div className="h-5 w-24 bg-emerald-900/40 rounded"></div>
              <div className="h-4 w-16 bg-emerald-900/20 rounded"></div>
            </div>
          </div>
          <div className="my-5 h-24 rounded-2xl bg-[#080D0A] border border-emerald-900/20"></div>
          <div className="border-t border-emerald-900/20 pt-4 space-y-2">
            <div className="h-4 w-1/3 bg-emerald-900/30 rounded"></div>
            <div className="h-8 w-full bg-emerald-900/20 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl pb-24 animate-in fade-in duration-300 px-2 sm:px-4">
      {/* Header */}
      <div className="mb-8 border-b border-emerald-900/30 pb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400">
          Local Godown / Store
        </span>
        <h1 className="mt-1 font-serif text-3xl font-bold text-white md:text-4xl">
          My Inventory Stock
        </h1>
        <p className="mt-2 text-xs text-[#F5F2EB]/60">
          Stock is automatically synced here when B2B wholesale orders are
          marked as "Delivered". You can record local retail sales below.
        </p>
      </div>

      {/* Stock Cards Grid */}
      {loading ? (
        <StockSkeleton />
      ) : stocks.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stocks.map((item) => {
            const product = item.product;
            if (!product) return null;

            return (
              <div
                key={item._id}
                className="group flex flex-col justify-between rounded-[2rem] border border-emerald-900/40 bg-[#121E1A] p-6 shadow-lg transition-all hover:border-emerald-500/40"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#080D0A] border border-emerald-900/50">
                      <img
                        src={
                          product.images?.[0] ||
                          "https://via.placeholder.com/150"
                        }
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white line-clamp-1">
                        {product.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 mt-1 rounded-md bg-emerald-900/40 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                        In Stock
                      </span>
                    </div>
                  </div>

                  {/* Quantity Display Box */}
                  <div className="my-5 rounded-2xl bg-[#080D0A] border border-emerald-900/40 p-4 text-center">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-400/60">
                      Available Quantity
                    </p>
                    <p className="font-serif text-3xl font-bold text-emerald-300 mt-1">
                      {item.quantity}{" "}
                      <span className="text-xs font-sans text-[#F5F2EB]/60 font-normal">
                        Units
                      </span>
                    </p>
                  </div>
                </div>

                {/* Actions & History */}
                <div className="border-t border-emerald-900/30 pt-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#F5F2EB]/50 flex items-center gap-1">
                      <History size={12} /> Recent Logs
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedStock(item)}
                      className="flex items-center gap-1 rounded-xl bg-emerald-900/30 border border-emerald-500/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 transition hover:bg-emerald-600 hover:text-white"
                    >
                      <MinusCircle size={14} /> Record Sale
                    </button>
                  </div>

                  {item.stockHistory && item.stockHistory.length > 0 ? (
                    <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1 text-xs text-[#F5F2EB]/80">
                      {item.stockHistory
                        .slice(-2)
                        .reverse()
                        .map((log, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-emerald-900/10 px-2.5 py-1 rounded-lg border border-emerald-900/20"
                          >
                            <span
                              className={`font-medium ${log.quantityChanged > 0 ? "text-emerald-400" : "text-amber-400"}`}
                            >
                              {log.quantityChanged > 0
                                ? `+${log.quantityChanged}`
                                : log.quantityChanged}{" "}
                              units
                            </span>
                            <span className="text-[10px] text-[#F5F2EB]/50">
                              {new Date(log.date).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#F5F2EB]/40 italic">
                      No history logged yet.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-emerald-900/50 bg-[#121E1A] py-20 text-center">
          <div className="bg-[#080D0A] p-4 rounded-full border border-emerald-900/50 mb-4 text-emerald-400">
            <Package size={32} />
          </div>
          <p className="font-serif text-xl font-bold text-white">
            No Inventory Stock Found
          </p>
          <p className="mt-1 text-sm text-[#F5F2EB]/50 max-w-sm">
            Your inventory stock is empty. Once your B2B orders are marked as
            "Delivered" by Admin, items will automatically appear here.
          </p>
        </div>
      )}

      {/* 🌟 RECORD SALE MODAL */}
      {selectedStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-emerald-900/50 bg-[#121E1A] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-emerald-900/30 pb-4 mb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Reduce Stock
                </span>
                <h3 className="font-serif text-xl font-bold text-white">
                  {selectedStock.product?.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStock(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#080D0A] border border-emerald-900/50 text-[#F5F2EB]/60 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAdjustStock} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/70 block mb-1">
                  Quantity to Reduce (Available: {selectedStock.quantity})
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedStock.quantity}
                  value={subtractQty}
                  onChange={(e) => setSubtractQty(e.target.value)}
                  placeholder="Enter units sold e.g. 5"
                  required
                  className="w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] py-3 px-4 text-sm text-white outline-none transition focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/70 block mb-1">
                  Note / Reference (Optional)
                </label>
                <input
                  type="text"
                  value={saleNote}
                  onChange={(e) => setSaleNote(e.target.value)}
                  placeholder="e.g. Sold to local walk-in customer"
                  className="w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] py-3 px-4 text-sm text-white outline-none transition focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  <span>Confirm & Deduct</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStock(null)}
                  className="rounded-xl border border-emerald-500/30 bg-[#080D0A] px-5 py-3 text-xs font-bold text-emerald-400 transition hover:bg-emerald-900/40"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
