import React, { useState } from "react";
import { adjustProductStock } from "../services/productService";
import { Package, AlertTriangle, Loader2 } from "lucide-react";

export default function AdminStockManager({ product, onStockUpdated }) {
  const [quantityChange, setQuantityChange] = useState("");
  const [type, setType] = useState("restock");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isLowStock = product.inventory <= (product.lowStockThreshold || 5);

  const handleStockSubmit = async (e) => {
    e.preventDefault();
    if (!quantityChange || Number(quantityChange) === 0) {
      setError("Please enter a valid quantity change.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await adjustProductStock(product._id, {
        quantityChange: Number(quantityChange),
        type,
        note: note.trim(),
      });

      setSuccess("Stock updated successfully!");
      setQuantityChange("");
      setNote("");

      if (onStockUpdated) {
        onStockUpdated(response);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update stock.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 🌟 Dark Surface Component
    <div className="rounded-2xl border border-emerald-900/30 bg-[#121E1A] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h4 className="font-serif text-lg text-white">{product.name}</h4>
          <p className="text-xs text-[#F5F2EB]/50">SKU Inventory Control</p>
        </div>
        <div
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${
            isLowStock
              ? "bg-red-950/40 text-red-400 border-red-900/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
              : "bg-emerald-900/20 text-emerald-400 border-emerald-900/50"
          }`}
        >
          {isLowStock && <AlertTriangle size={14} />}
          <span>Stock: {product.inventory} units</span>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mt-4 rounded-xl bg-red-950/30 border border-red-900/30 p-3 text-xs text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 rounded-xl bg-emerald-950/30 border border-emerald-900/30 p-3 text-xs text-emerald-400">
          {success}
        </div>
      )}

      {/* 🌟 Dark Form */}
      <form onSubmit={handleStockSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-400/70">
              Adjustment Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            >
              <option value="restock" className="bg-[#121E1A]">
                Restock (Add)
              </option>
              <option value="adjustment" className="bg-[#121E1A]">
                Manual Correction (Add/Subtract)
              </option>
              <option value="return" className="bg-[#121E1A]">
                Customer Return
              </option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-400/70">
              Quantity (+ add, - subtract)
            </label>
            <input
              type="number"
              value={quantityChange}
              onChange={(e) => setQuantityChange(e.target.value)}
              placeholder="e.g. 20 or -5"
              required
              className="mt-1 w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] px-3 py-2 text-sm text-white placeholder-[#F5F2EB]/20 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-400/70">
            Audit Note / Reason
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Received new supplier batch"
            className="mt-1 w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] px-3 py-2 text-sm text-white placeholder-[#F5F2EB]/20 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:bg-[#16231D] disabled:text-[#F5F2EB]/30 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Package size={16} />
          )}
          <span>Update Inventory & Log Audit</span>
        </button>
      </form>

      {/* 🌟 Dark Audit History */}
      {product.stockHistory && product.stockHistory.length > 0 && (
        <div className="mt-6 border-t border-emerald-900/30 pt-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400/70 mb-3">
            Recent Stock History
          </p>
          <div className="max-h-32 overflow-y-auto space-y-2 text-xs pr-1 custom-scrollbar">
            {product.stockHistory
              .slice(-3)
              .reverse()
              .map((history, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-[#080D0A] border border-emerald-900/20 p-2.5 rounded-lg"
                >
                  <div>
                    <span className="font-bold uppercase text-emerald-400">
                      {history.type}
                    </span>
                    <span className="text-[#F5F2EB]/80">
                      :{" "}
                      {history.quantityChanged > 0
                        ? `+${history.quantityChanged}`
                        : history.quantityChanged}{" "}
                      (Total: {history.newStock})
                    </span>
                    {history.note && (
                      <p className="text-[10px] text-[#F5F2EB]/40 mt-0.5">
                        {history.note}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-[#F5F2EB]/40 shrink-0">
                    {new Date(history.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
