import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api"; // 👈 API import for Coupon validation

export default function Cart() {
  const { cart = [], updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isFranchise = user?.role === "franchise";

  const [selectedIds, setSelectedIds] = useState(
    cart.map((item) => item._id || item.id),
  );

  // 👈 Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState({ type: "", text: "" });
  const [isApplying, setIsApplying] = useState(false);

  const toggleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  const selectedItems = cart.filter((item) =>
    selectedIds.includes(item._id || item.id),
  );

  const totalMRP = selectedItems.reduce((sum, item) => {
    const originalPrice = isFranchise
      ? item.compareAtPrice || item.price
      : item.compareAtPrice || item.price;
    return sum + originalPrice * (item.quantity || 1);
  }, 0);

  const selectedSubtotal = selectedItems.reduce((sum, item) => {
    const effectivePrice =
      isFranchise && item.wholesalePrice ? item.wholesalePrice : item.price;
    return sum + effectivePrice * (item.quantity || 1);
  }, 0);

  const totalDiscount = totalMRP - selectedSubtotal;
  const gst = Math.round(selectedSubtotal * 0.18);
  const deliveryCharge = 0;

  // 👈 Subtracting coupon discount from Final Total
  const finalTotal = selectedSubtotal + gst + deliveryCharge - couponDiscount;

  // 👈 Coupon Apply Handler
  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsApplying(true);
    setCouponMessage({ type: "", text: "" });

    try {
      // 👇 NAYA ADDITION: Cart ke selected items ka data prepare kar rahe hain
      const cartItemsForCoupon = selectedItems.map((item) => ({
        product: item._id || item.id,
        price:
          isFranchise && item.wholesalePrice ? item.wholesalePrice : item.price,
        quantity: item.quantity || 1,
      }));

      // 👇 API me ab 'cartTotal' ki jagah 'cartItems' bhej rahe hain
      const response = await api.post("/apply-coupon", {
        code: couponCode,
        cartItems: cartItemsForCoupon,
      });

      setCouponDiscount(response.data.discountAmount);
      setCouponMessage({ type: "success", text: response.data.message });
    } catch (error) {
      setCouponDiscount(0);
      setCouponMessage({
        type: "error",
        text: error.response?.data?.message || "Invalid coupon code",
      });
    } finally {
      setIsApplying(false);
    }
  };

  // 👈 Clear Coupon Handler
  const handleClearCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponMessage({ type: "", text: "" });
  };

  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) return;

    // 🌟 BUG FIX (Failsafe): Check if any item violates the Franchise minimum rule
    if (isFranchise) {
      const invalidItem = selectedItems.find(
        (item) => (item.quantity || 1) < 12,
      );
      if (invalidItem) {
        toast.error(
          `Franchise orders require a minimum of 12 quantities per item (${invalidItem.name}).`,
        );
        return; // Prevent checkout
      }
    }

    // 👈 Checkout page par coupon detail pass kar rahe hain
    navigate("/checkout", {
      state: {
        selectedCartItems: selectedItems,
        appliedCoupon:
          couponDiscount > 0
            ? { code: couponCode, discountAmount: couponDiscount }
            : null,
      },
    });
  };

  return (
    <main className="min-h-screen bg-[#080D0A] text-[#F5F2EB] py-16 md:py-24">
      <div className="container-hba mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-12 text-center flex flex-col items-center">
          <span className="eyebrow inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400/80">
            Your Selection
          </span>
          <h1 className="mt-4 font-serif text-4xl text-white sm:text-5xl">
            Shopping Bag
          </h1>
        </div>

        {cart?.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[3rem] bg-[#121E1A] py-24 shadow-lg border border-emerald-900/30 text-center px-4">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-[#080D0A] text-emerald-400 border border-emerald-500/20 mb-6 shadow-inner">
              <ShoppingBag size={32} />
            </div>
            <h2 className="font-serif text-2xl text-white">
              Your bag is empty
            </h2>
            <p className="mt-3 text-sm text-[#F5F2EB]/60 max-w-sm leading-relaxed mb-8">
              Discover our premium range of thoughtfully formulated Ayurvedic
              products for your daily rituals.
            </p>
            <Link
              to="/products"
              className="btn-primary inline-flex items-center gap-2 px-8 py-3.5"
            >
              Explore Collection <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-start mt-8">
            <div className="space-y-4">
              {cart.map((item) => {
                const itemId = item._id || item.id;
                const isSelected = selectedIds.includes(itemId);

                return (
                  <div
                    key={itemId}
                    className={`flex flex-col sm:flex-row gap-6 rounded-[2rem] bg-[#121E1A] p-4 sm:p-6 shadow-md border-2 transition-all ${isSelected ? "border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]" : "border-emerald-900/20 opacity-60 hover:opacity-80"}`}
                  >
                    <div className="flex items-center">
                      <div
                        onClick={() => toggleSelect(itemId)}
                        className={`w-6 h-6 rounded-lg grid place-items-center border-2 cursor-pointer transition-colors shrink-0 ${isSelected ? "bg-emerald-600 border-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "border-emerald-900/50 bg-[#080D0A] hover:border-emerald-400/50"}`}
                      >
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                    </div>
                    <Link
                      to={`/products/${item.slug}`}
                      className="shrink-0 overflow-hidden rounded-2xl bg-[#080D0A] border border-emerald-900/30"
                    >
                      <img
                        src={
                          item.images?.[0] ||
                          "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500&q=80"
                        }
                        alt={item.name}
                        className="h-32 w-full sm:w-32 object-cover transition-transform duration-700 hover:scale-105 opacity-90 hover:opacity-100"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <Link to={`/products/${item.slug}`}>
                            <h3 className="font-serif text-xl text-white hover:text-emerald-400 transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          <span className="mt-1 block text-xs font-bold uppercase tracking-widest text-emerald-400/60">
                            {item.category || "Formulation"}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCart(itemId)}
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-950/50 border border-red-900/50 text-red-400 transition-colors hover:bg-red-600 hover:text-white"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-3 rounded-full border border-emerald-900/40 px-3 py-1.5 bg-[#080D0A]">
                          <button
                            type="button"
                            onClick={() => {
                              const currentQty = item.quantity || 1;
                              const minQty = isFranchise ? 12 : 1;
                              if (currentQty > minQty)
                                updateQuantity(itemId, currentQty - 1);
                            }}
                            disabled={
                              (item.quantity || 1) <= (isFranchise ? 12 : 1)
                            }
                            className={`p-1 transition-colors ${(item.quantity || 1) <= (isFranchise ? 12 : 1) ? "text-[#F5F2EB]/20 cursor-not-allowed" : "text-emerald-400 hover:text-emerald-300"}`}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold text-white w-6 text-center">
                            {item.quantity || 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const currentQty = item.quantity || 1;
                              const minQty = isFranchise ? 12 : 1;
                              if (currentQty < minQty)
                                updateQuantity(itemId, minQty);
                              else updateQuantity(itemId, currentQty + 1);
                            }}
                            className="text-emerald-400 hover:text-emerald-300 p-1"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {(() => {
                            const effectivePrice =
                              isFranchise && item.wholesalePrice
                                ? item.wholesalePrice
                                : item.price;
                            const originalPrice = isFranchise
                              ? item.compareAtPrice || item.price
                              : item.compareAtPrice;
                            const hasDiscount =
                              originalPrice && originalPrice > effectivePrice;
                            const discountPercentage = hasDiscount
                              ? Math.round(
                                  ((originalPrice - effectivePrice) /
                                    originalPrice) *
                                    100,
                                )
                              : 0;
                            return (
                              <>
                                <div
                                  className={`font-serif text-xl font-bold ${isFranchise && item.wholesalePrice ? "text-amber-400" : "text-emerald-300"}`}
                                >
                                  ₹
                                  {Number(
                                    effectivePrice * (item.quantity || 1),
                                  ).toLocaleString("en-IN")}
                                </div>
                                {hasDiscount && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-[#F5F2EB]/40 line-through">
                                      ₹
                                      {Number(
                                        originalPrice * (item.quantity || 1),
                                      ).toLocaleString("en-IN")}
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-900/50 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                                      {discountPercentage}% OFF
                                    </span>
                                  </div>
                                )}
                                {isFranchise && item.wholesalePrice && (
                                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mt-0.5">
                                    B2B Rate
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="sticky top-28 overflow-hidden rounded-[2.5rem] bg-[#0B1310] p-8 sm:p-10 border border-emerald-900/40 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
              <h2 className="font-serif text-2xl text-white">Order Summary</h2>

              {/* 👇 Coupon Input Section 👇 */}
              <div className="mt-8 border-b border-emerald-900/30 pb-6">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#F5F2EB]/60 mb-3 block">
                  Gift Card or Discount Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    disabled={couponDiscount > 0}
                    placeholder="ENTER CODE"
                    className="w-full bg-[#060A08] border border-emerald-900/40 rounded-xl px-4 py-3 text-xs text-white placeholder-[#F5F2EB]/30 focus:outline-none focus:border-emerald-500 transition-colors uppercase disabled:opacity-50"
                  />
                  <button
                    onClick={
                      couponDiscount > 0 ? handleClearCoupon : handleApplyCoupon
                    }
                    disabled={
                      isApplying || (!couponCode && couponDiscount === 0)
                    }
                    className={`font-bold text-xs uppercase tracking-wider px-5 rounded-xl transition-all disabled:opacity-50 ${
                      couponDiscount > 0
                        ? "bg-red-950/50 text-red-400 border border-red-900/50 hover:bg-red-600 hover:text-white"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white"
                    }`}
                  >
                    {isApplying
                      ? "..."
                      : couponDiscount > 0
                        ? "Remove"
                        : "Apply"}
                  </button>
                </div>
                {couponMessage.text && (
                  <p
                    className={`mt-2.5 text-[10px] font-bold tracking-wide uppercase ${couponMessage.type === "error" ? "text-red-400" : "text-emerald-400"}`}
                  >
                    {couponMessage.text}
                  </p>
                )}
              </div>

              <div className="mt-6 space-y-4 text-sm text-[#F5F2EB]/70">
                <div className="flex justify-between">
                  <span>Total MRP ({selectedItems.length} items)</span>
                  <span className="line-through text-[#F5F2EB]/40">
                    ₹{totalMRP.toLocaleString("en-IN")}
                  </span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Discount on MRP</span>
                    <span>- ₹{totalDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {/* 👇 Displaying Coupon Discount Line Item 👇 */}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Coupon Discount</span>
                    <span>- ₹{couponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between border-t border-emerald-900/30 pt-4">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">
                    ₹
                    {(selectedSubtotal - couponDiscount).toLocaleString(
                      "en-IN",
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (18%)</span>
                  <span>₹{gst.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-400 font-medium">Free</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>
              </div>
              <div className="mt-6 border-t border-emerald-900/40 pt-6 flex justify-between items-end">
                <span className="font-serif text-lg text-white">Total</span>
                <strong className="font-serif text-3xl text-emerald-400">
                  ₹{finalTotal.toLocaleString("en-IN")}
                </strong>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-[#F5F2EB]/40">
                Taxes, discounts, and shipping are finalized during the checkout
                process.
              </p>
              <button
                onClick={handleProceedToCheckout}
                disabled={selectedItems.length === 0}
                className="btn-primary mt-8 flex w-full justify-center py-4 text-base shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:shadow-none cursor-pointer"
              >
                Proceed to Checkout
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
