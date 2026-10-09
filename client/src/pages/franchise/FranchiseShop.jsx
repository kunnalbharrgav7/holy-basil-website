import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { ShoppingCart, Plus, Minus, Loader2, Search } from "lucide-react";
import toast from "react-hot-toast";
import ProductCardSkeleton from "../../components/ProductCardSkeleton";

export default function FranchiseShop() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({}); // { productId: quantity }
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // 🌟 Naya Search State

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Quantity change with Minimum Order Rule (12 units)
  const handleQuantityChange = (productId, delta, maxStock) => {
    setCart((prev) => {
      const current = prev[productId] || 0;

      if (current === 0 && delta > 0) {
        if (12 > maxStock) {
          toast.error(`Stock insufficient. Minimum order is 12 units.`);
          return prev;
        }
        return { ...prev, [productId]: 12 };
      }

      const updated = current + delta * 12;

      if (updated <= 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }

      if (updated > maxStock) {
        toast.error(`Only ${maxStock} units available in stock`);
        return prev;
      }

      return { ...prev, [productId]: updated };
    });
  };

  const totalItemsCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const estimatedTotal = Object.entries(cart).reduce(
    (sum, [productId, qty]) => {
      const product = products.find((p) => p._id === productId);
      const price = product?.wholesalePrice || product?.price || 0;
      return sum + price * qty;
    },
    0,
  );

  const handlePlaceOrder = async () => {
    if (Object.keys(cart).length === 0) {
      toast.error("Please add at least one product to order");
      return;
    }

    for (const [productId, qty] of Object.entries(cart)) {
      if (qty < 12) {
        toast.error(
          "Minimum order quantity is 12 units per item for B2B orders.",
        );
        return;
      }
    }

    try {
      setSubmitting(true);
      const items = Object.entries(cart).map(([productId, quantity]) => ({
        product: productId,
        quantity,
      }));

      const orderData = {
        items,
        shippingAddress: {
          address: "Franchise Registered Outlet",
          city: "Local Hub",
          postalCode: "000000",
          country: "India",
        },
        paymentMethod: "cod",
      };

      const { data } = await api.post("/orders", orderData);
      toast.success("B2B Order placed successfully!");
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      console.error("Order placement failed:", err);
      toast.error(err.response?.data?.message || "Failed to place B2B order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl pb-24 animate-in fade-in duration-300 px-2 sm:px-4">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-emerald-900/30 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400">
            Wholesale Portal • Min. Order: 12 Units
          </span>
          <h1 className="mt-1 font-serif text-2xl font-bold text-white md:text-3xl">
            B2B Bulk Ordering
          </h1>
        </div>

        {/* Floating Cart Summary Pill */}
        <div className="flex items-center gap-3 rounded-xl border border-emerald-900/40 bg-[#121E1A] px-4 py-2.5 shadow-lg">
          <div>
            <p className="text-[9px] uppercase font-bold text-emerald-400/60">
              Cart Summary
            </p>
            <p className="font-bold text-white text-xs sm:text-sm">
              {totalItemsCount} Units Selected
            </p>
          </div>
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={submitting || totalItemsCount === 0}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            {submitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <ShoppingCart size={14} />
            )}
            <span>Place Order</span>
          </button>
        </div>
      </div>

      {/* 🌟 SEARCH BAR */}
      <div className="mb-6 relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-emerald-400/50 pointer-events-none">
          <Search size={18} />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products by name for bulk order..."
          className="w-full rounded-2xl border border-emerald-900/40 bg-[#121E1A] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition focus:border-emerald-500 shadow-inner placeholder:text-[#F5F2EB]/30"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const qty = cart[product._id] || 0;
            const wholesalePrice = product.wholesalePrice || product.price;

            return (
              <div
                key={product._id}
                className="group flex flex-col justify-between rounded-2xl border border-emerald-900/30 bg-[#121E1A] p-4 shadow-md transition-all hover:border-emerald-500/40"
              >
                <div>
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-[#080D0A] border border-emerald-900/40">
                    <img
                      src={
                        product.images?.[0] || "https://via.placeholder.com/300"
                      }
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 rounded-full bg-[#080D0A]/80 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-md">
                      Stock: {product.inventory}
                    </div>
                  </div>

                  <h3 className="font-serif text-sm font-bold text-white line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-[#F5F2EB]/60 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="mt-4 border-t border-emerald-900/30 pt-3">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-400/60 block">
                        Wholesale (Per unit)
                      </span>
                      <span className="font-serif text-lg font-bold text-emerald-300">
                        ₹{wholesalePrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-[#F5F2EB]/40 block">
                        MRP
                      </span>
                      <span className="text-xs font-semibold line-through text-[#F5F2EB]/50">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {qty === 0 ? (
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(product._id, 1, product.inventory)
                      }
                      disabled={product.inventory < 12}
                      className="w-full rounded-xl bg-emerald-900/30 border border-emerald-500/30 py-2.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400 transition hover:bg-emerald-600 hover:text-white disabled:opacity-40"
                    >
                      {product.inventory >= 12
                        ? "+ Add Min 12 Units"
                        : "Stock < 12"}
                    </button>
                  ) : (
                    <div className="flex items-center justify-between rounded-xl bg-[#080D0A] border border-emerald-500/40 p-1">
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(
                            product._id,
                            -1,
                            product.inventory,
                          )
                        }
                        className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-900/30 text-emerald-400 transition hover:bg-emerald-600 hover:text-white"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-serif text-sm font-bold text-white">
                        {qty} Units
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(
                            product._id,
                            1,
                            product.inventory,
                          )
                        }
                        className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-900/30 text-emerald-400 transition hover:bg-emerald-600 hover:text-white"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center text-[#F5F2EB]/50">
            <p className="text-base font-serif">
              No products found matching "{searchQuery}"
            </p>
          </div>
        )}
      </div>

      {/* Sticky Bottom Checkout Bar */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-3xl rounded-2xl border border-emerald-500/40 bg-[#121E1A]/95 p-3 sm:p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white shadow-md">
              <ShoppingCart size={18} />
            </div>
            <div>
              <p className="text-[11px] text-[#F5F2EB]/60">
                Bulk Total ({totalItemsCount} units)
              </p>
              <p className="font-serif text-lg font-bold text-emerald-300">
                ₹{estimatedTotal.toLocaleString("en-IN")}{" "}
                <span className="text-[9px] text-emerald-400/60 font-sans font-normal">
                  (+GST & Royalty)
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="w-full sm:w-auto rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] transition hover:bg-emerald-500 disabled:opacity-50"
          >
            {submitting ? "Processing..." : "Confirm & Place B2B Order"}
          </button>
        </div>
      )}
    </div>
  );
}
