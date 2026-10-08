import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import {
  Package,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Search,
  X,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getProducts } from "../services/productService";

export default function BulkOrder() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // 🌟 Search State
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isFranchise = user?.role === "franchise";
  const MOQ = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data.filter((p) => p.published !== false));
      } catch (error) {
        console.error("Failed to load products for bulk order", error);
      } finally {
        setLoading(false);
      }
    };
    if (isFranchise) fetchProducts();
  }, [isFranchise]);

  if (user && !isFranchise) return <Navigate to="/products" replace />;

  const updateQuantity = (productId, action) => {
    setQuantities((prev) => {
      const currentQty = prev[productId] || 0;
      let newQty = currentQty;
      if (action === "increment")
        newQty = currentQty === 0 ? MOQ : currentQty + 1;
      else if (action === "decrement")
        newQty = currentQty <= MOQ ? 0 : currentQty - 1;
      return { ...prev, [productId]: newQty };
    });
  };

  const handleBulkAdd = () => {
    const selectedProducts = products.filter((p) => quantities[p._id] > 0);
    selectedProducts.forEach((product) => {
      const qty = quantities[product._id];
      addToCart(product, qty);
    });
    navigate("/cart");
  };

  // 🌟 Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalItemsSelected = Object.values(quantities).reduce(
    (a, b) => a + b,
    0,
  );
  const totalAmount = products.reduce((sum, p) => {
    const qty = quantities[p._id] || 0;
    const price = p.wholesalePrice || p.price;
    return sum + price * qty;
  }, 0);

  if (loading)
    return (
      <main className="min-h-screen bg-[#080D0A] py-20 text-center">
        <p className="text-emerald-400">Loading Bulk Order Catalogue...</p>
      </main>
    );

  return (
    <main className="min-h-screen bg-[#080D0A] py-12 md:py-24 relative pb-40 text-[#F5F2EB]">
      <div className="container-hba mx-auto px-3 sm:px-4 max-w-5xl space-y-6 sm:space-y-8">
        <div>
          <span className="inline-block rounded-full bg-amber-900/30 border border-amber-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-3 sm:mb-4 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
            B2B Franchise Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white md:text-5xl">
            Quick Bulk Order
          </h1>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-[#F5F2EB]/60">
            Select quantities for multiple products at once.{" "}
            <strong className="text-amber-400 block sm:inline mt-1 sm:mt-0">
              Minimum Order Quantity (MOQ) is {MOQ} per product.
            </strong>
          </p>
        </div>

        {/* 🌟 SEARCH BAR */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search
              size={18}
              className="text-emerald-500/50 w-4 h-4 sm:w-5 sm:h-5"
            />
          </div>
          <input
            type="text"
            placeholder="Search products to order..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121E1A] border border-emerald-900/40 rounded-xl sm:rounded-2xl py-3 sm:py-3.5 pl-10 sm:pl-12 pr-10 text-xs sm:text-sm text-white placeholder:text-[#F5F2EB]/30 focus:outline-none focus:border-emerald-500/60 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#F5F2EB]/30 hover:text-emerald-400 transition cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-[2rem] bg-[#121E1A] p-12 text-center border border-emerald-900/30">
            <Package size={32} className="mx-auto text-emerald-500/30 mb-3" />
            <p className="text-white font-serif font-bold text-lg">
              No products found
            </p>
            <p className="text-xs text-[#F5F2EB]/50 mt-1">
              No results matching "{searchQuery}"
            </p>
          </div>
        ) : (
          <>
            {/* 📱 MOBILE VIEW: MODERN CARDS */}
            <div className="block md:hidden space-y-3">
              {filteredProducts.map((product) => {
                const qty = quantities[product._id] || 0;
                const effectivePrice = product.wholesalePrice || product.price;
                const originalPrice = product.compareAtPrice || product.price;

                return (
                  <div
                    key={product._id}
                    className={`rounded-2xl border p-4 transition-all ${
                      qty > 0
                        ? "bg-amber-900/10 border-amber-500/40"
                        : "bg-[#121E1A] border-emerald-900/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-14 h-14 rounded-xl object-cover border border-emerald-900/30 shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-[#080D0A] border border-emerald-900/20 flex items-center justify-center text-emerald-500/30 shrink-0">
                          <Package size={20} />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="font-serif font-bold text-white text-sm line-clamp-2">
                          {product.name}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="line-through text-xs text-[#F5F2EB]/40">
                            ₹{originalPrice.toLocaleString("en-IN")}
                          </span>
                          <strong className="text-amber-400 text-xs sm:text-sm">
                            ₹{effectivePrice.toLocaleString("en-IN")}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-emerald-900/20">
                      <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                        {qty > 0 ? `${qty} Units Added` : "Select Quantity"}
                      </span>

                      <div
                        className={`flex items-center gap-2 rounded-full border px-3 py-1 transition-colors ${
                          qty > 0
                            ? "border-amber-500/40 bg-amber-900/20"
                            : "border-emerald-900/40 bg-[#080D0A]"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(product._id, "decrement")
                          }
                          className={`${
                            qty > 0
                              ? "text-amber-400 hover:text-amber-300"
                              : "text-[#F5F2EB]/40 hover:text-[#F5F2EB]"
                          } p-1 cursor-pointer`}
                        >
                          <Minus size={14} />
                        </button>
                        <span
                          className={`text-xs font-bold w-5 text-center ${
                            qty > 0 ? "text-amber-400" : "text-[#F5F2EB]/60"
                          }`}
                        >
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(product._id, "increment")
                          }
                          className="text-emerald-400 hover:text-emerald-300 p-1 cursor-pointer"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 💻 DESKTOP VIEW: CLEAN TABLE */}
            <div className="hidden md:block rounded-[2rem] bg-[#121E1A] shadow-lg border border-emerald-900/30 overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left min-w-[700px]">
                  <thead className="bg-[#0B1310] border-b border-emerald-900/30">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-emerald-400/60">
                        Product
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-emerald-400/60">
                        Original Price
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-emerald-400/60">
                        B2B Rate
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-emerald-400/60 text-right">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/20">
                    {filteredProducts.map((product) => {
                      const qty = quantities[product._id] || 0;
                      const effectivePrice =
                        product.wholesalePrice || product.price;
                      const originalPrice =
                        product.compareAtPrice || product.price;

                      return (
                        <tr
                          key={product._id}
                          className={`transition-colors ${
                            qty > 0 ? "bg-amber-900/10" : "hover:bg-[#16231D]"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-12 h-12 rounded-lg object-cover border border-emerald-900/30"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-[#080D0A] border border-emerald-900/20 flex items-center justify-center text-emerald-500/30">
                                  <Package size={20} />
                                </div>
                              )}
                              <p className="font-serif font-medium text-white">
                                {product.name}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="line-through text-sm text-[#F5F2EB]/40">
                              ₹{originalPrice.toLocaleString("en-IN")}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <strong className="text-amber-400">
                              ₹{effectivePrice.toLocaleString("en-IN")}
                            </strong>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-3">
                              <div
                                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors ${
                                  qty > 0
                                    ? "border-amber-500/40 bg-amber-900/20"
                                    : "border-emerald-900/40 bg-[#080D0A]"
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(product._id, "decrement")
                                  }
                                  className={`${
                                    qty > 0
                                      ? "text-amber-400 hover:text-amber-300"
                                      : "text-[#F5F2EB]/40 hover:text-[#F5F2EB]"
                                  } p-1 cursor-pointer`}
                                >
                                  <Minus size={14} />
                                </button>
                                <span
                                  className={`text-sm font-bold w-6 text-center ${
                                    qty > 0
                                      ? "text-amber-400"
                                      : "text-[#F5F2EB]/60"
                                  }`}
                                >
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(product._id, "increment")
                                  }
                                  className="text-emerald-400 hover:text-emerald-300 p-1 cursor-pointer"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {totalItemsSelected > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0B1310] border-t border-emerald-900/40 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] p-4 md:p-6 z-50 animate-in slide-in-from-bottom-full">
          <div className="container-hba mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
              <div className="bg-amber-900/30 border border-amber-500/20 text-amber-400 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.15)] shrink-0">
                <ShoppingBag size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-emerald-400/80">
                  Selected for Bulk Order
                </p>
                <p className="font-serif text-lg sm:text-xl text-white">
                  {totalItemsSelected} Items{" "}
                  <span className="text-lg mx-1.5 font-sans text-amber-600">
                    |
                  </span>{" "}
                  ₹{totalAmount.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
            <button
              onClick={handleBulkAdd}
              className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
            >
              Add to Cart & Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
