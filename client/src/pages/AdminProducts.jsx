import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminProducts, deleteProduct } from "../services/productService";
import AdminStockManager from "../components/AdminStockManager";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  X,
  Search, // 🌟 Search icon import kiya
  Loader2,
} from "lucide-react";
import ProductCardSkeleton from "../components/ProductCardSkeleton";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProductForStock, setSelectedProductForStock] = useState(null);

  // 🌟 Naya Search State
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAdminProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete product.");
    }
  };

  // 🌟 Search Filtering Logic (Name aur Category dono me search karega)
  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading)
    return (
      <main className="min-h-screen px-3 py-8 sm:px-6 lg:px-8 lg:py-12 bg-[#080D0A]">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen px-3 py-8 sm:px-6 lg:px-8 lg:py-12 bg-[#080D0A] text-[#F5F2EB]">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        {/* 🌟 Header Section Optimized for Mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-emerald-900/30">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-400/80">
              Catalogue Management
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-white mt-1">
              Products
            </h1>
          </div>
          <Link
            to="/admin/products/add"
            className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl sm:rounded-full bg-emerald-600 px-5 py-3 sm:py-2.5 text-[11px] sm:text-xs font-bold text-white transition hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)] shrink-0"
          >
            <Plus size={16} className="w-4 h-4" /> <span>Add New Product</span>
          </Link>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-900/50 bg-red-950/40 p-4 text-xs sm:text-sm text-red-400">
            {error}
          </div>
        )}

        {/* 🌟 SEARCH BAR SECTION */}
        <div className="relative w-full max-w-2xl mx-auto sm:mx-0">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search
              size={18}
              className="text-emerald-500/50 w-4 h-4 sm:w-5 sm:h-5"
            />
          </div>
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121E1A] border border-emerald-900/40 rounded-xl sm:rounded-2xl py-3 sm:py-3.5 pl-10 sm:pl-12 pr-4 text-xs sm:text-sm text-white placeholder:text-[#F5F2EB]/30 focus:outline-none focus:border-emerald-500/60 focus:bg-[#16231D] transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#F5F2EB]/30 hover:text-emerald-400 transition"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* 🌟 Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-900/20 text-emerald-500/50 mb-4">
              <Package size={24} />
            </div>
            <p className="text-lg font-bold text-white font-serif">
              No products found
            </p>
            <p className="text-sm text-[#F5F2EB]/50 mt-1">
              {searchQuery
                ? `No results matching "${searchQuery}"`
                : "Your catalogue is currently empty."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredProducts.map((product) => {
              const isLowStock =
                product.inventory <= (product.lowStockThreshold || 5);
              return (
                <div
                  key={product._id}
                  className="bg-[#121E1A] border border-emerald-900/30 rounded-[1.25rem] sm:rounded-[2rem] p-3 sm:p-6 shadow-lg flex flex-col justify-between transition hover:border-emerald-500/50"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-6">
                    <div className="h-24 w-full sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl sm:rounded-2xl bg-[#080D0A] border border-emerald-900/50">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-emerald-500/30">
                          <Package size={20} className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 w-full">
                      <span className="text-[8px] sm:text-[10px] uppercase font-bold text-emerald-400 truncate block">
                        {product.category || "Uncategorized"}
                      </span>
                      <h3 className="font-serif font-bold text-white text-xs sm:text-base line-clamp-2 sm:line-clamp-1 mt-0.5">
                        {product.name}
                      </h3>
                      <p className="text-emerald-300 font-bold text-[11px] sm:text-sm mt-0.5">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 pt-2 sm:pt-4 border-t border-emerald-900/30">
                    <span
                      className={`inline-flex items-center justify-center w-max rounded-full px-2 sm:px-2.5 py-0.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider border ${
                        isLowStock
                          ? "bg-red-950/40 text-red-400 border-red-900/50"
                          : "bg-emerald-900/30 text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {product.inventory} units
                    </span>

                    <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2">
                      <button
                        onClick={() => setSelectedProductForStock(product)}
                        className="p-1.5 sm:p-2 flex-1 sm:flex-none flex justify-center rounded-lg sm:rounded-xl bg-emerald-900/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition border border-emerald-500/20"
                        title="Manage Stock"
                      >
                        <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className="p-1.5 sm:p-2 flex-1 sm:flex-none flex justify-center rounded-lg sm:rounded-xl bg-[#080D0A] text-[#F5F2EB] hover:text-emerald-400 transition border border-emerald-900/40"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-1.5 sm:p-2 flex-1 sm:flex-none flex justify-center rounded-lg sm:rounded-xl bg-red-950/30 text-red-400 hover:bg-red-600 hover:text-white transition border border-red-900/50"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 🌟 Stock Update Modal */}
        {selectedProductForStock && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
            <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-[#121E1A] p-5 sm:p-6 pt-10 sm:pt-12 shadow-2xl border border-emerald-900/30">
              <button
                onClick={() => setSelectedProductForStock(null)}
                className="absolute right-4 top-4 z-20 grid h-8 w-8 place-items-center rounded-full bg-[#080D0A] text-[#F5F2EB]/50 hover:text-emerald-400 border border-emerald-900/40"
              >
                <X size={16} />
              </button>
              <AdminStockManager
                product={selectedProductForStock}
                onStockUpdated={(res) => {
                  fetchProducts();
                  setSelectedProductForStock((prev) => ({
                    ...prev,
                    inventory: res.inventory,
                  }));
                }}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
