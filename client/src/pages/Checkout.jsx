import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  CreditCard,
  Banknote,
  Check,
  Plus,
  Minus,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderService";
import { useAuth } from "../context/AuthContext";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../services/paymentService";
import api from "../services/api";

export default function Checkout() {
  const { cart = [], clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isFranchise = user?.role === "franchise";

  const initialDirectBuy =
    location.state?.directBuyItem || location.state?.selectedCartItems?.[0];
  const appliedCoupon = location.state?.appliedCoupon || null;

  const [directBuyItem, setDirectBuyItem] = useState(
    initialDirectBuy
      ? { ...initialDirectBuy, quantity: initialDirectBuy.quantity || 1 }
      : null,
  );
  const [selectedDirectBuy, setSelectedDirectBuy] = useState(
    Boolean(directBuyItem),
  );
  const [checkoutCart, setCheckoutCart] = useState(
    cart
      .filter(
        (item) =>
          (item._id || item.id) !==
          (initialDirectBuy?._id || initialDirectBuy?.id),
      )
      .map((item) => ({ ...item, quantity: item.quantity || 1 })),
  );
  const [selectedCartIds, setSelectedCartIds] = useState(
    checkoutCart.map((item) => item._id || item.id),
  );

  const [couponCode, setCouponCode] = useState(
    appliedCoupon ? appliedCoupon.code : "",
  );
  const [couponDiscount, setCouponDiscount] = useState(
    appliedCoupon ? appliedCoupon.discountAmount : 0,
  );
  const [couponMessage, setCouponMessage] = useState({ type: "", text: "" });
  const [isApplying, setIsApplying] = useState(false);

  const toggleDirectBuy = () => setSelectedDirectBuy(!selectedDirectBuy);
  const toggleCartItem = (id) =>
    setSelectedCartIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );

  const updateItemQuantity = (id, newQty, isDirect = false) => {
    const minQty = isFranchise ? 12 : 1;
    if (newQty < minQty) return;
    if (isDirect) setDirectBuyItem((prev) => ({ ...prev, quantity: newQty }));
    else
      setCheckoutCart((prev) =>
        prev.map((item) =>
          (item._id || item.id) === id ? { ...item, quantity: newQty } : item,
        ),
      );
  };

  const activeItems = [
    ...(directBuyItem && selectedDirectBuy ? [directBuyItem] : []),
    ...checkoutCart.filter((item) =>
      selectedCartIds.includes(item._id || item.id),
    ),
  ];

  const activeSubtotal = activeItems.reduce((sum, item) => {
    const effectivePrice =
      isFranchise && item.wholesalePrice ? item.wholesalePrice : item.price;
    return sum + effectivePrice * (item.quantity || 1);
  }, 0);
  const activeMRP = activeItems.reduce((sum, item) => {
    const originalPrice = isFranchise
      ? item.compareAtPrice || item.price
      : item.compareAtPrice || item.price;
    return sum + originalPrice * (item.quantity || 1);
  }, 0);

  const activeDiscount = activeMRP - activeSubtotal;
  const gst = Math.round(activeSubtotal * 0.18);
  const deliveryCharge = 0;

  const finalTotal = activeSubtotal + gst + deliveryCharge - couponDiscount;
  const activeCount = activeItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0,
  );

  // 👇 ADDED: district field in state
  const [shipping, setShipping] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
  });
  const [billing, setBilling] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
  });
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode) return;
    setIsApplying(true);
    setCouponMessage({ type: "", text: "" });

    try {
      const cartItemsForCoupon = activeItems.map((item) => ({
        product: item._id || item.id,
        price:
          isFranchise && item.wholesalePrice ? item.wholesalePrice : item.price,
        quantity: item.quantity || 1,
      }));

      const response = await api.post("/apply-coupon", {
        code: couponCode,
        cartItems: cartItemsForCoupon,
      });

      setCouponDiscount(response.data.discountAmount);
      setCouponMessage({ type: "success", text: response.data.message });
    } catch (err) {
      setCouponDiscount(0);
      setCouponMessage({
        type: "error",
        text: err.response?.data?.message || "Invalid coupon code",
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleClearCoupon = (e) => {
    e.preventDefault();
    setCouponCode("");
    setCouponDiscount(0);
    setCouponMessage({ type: "", text: "" });
  };

  if (!checkoutCart.length && !directBuyItem) {
    return (
      <main className="min-h-screen bg-[#080D0A] text-[#F5F2EB] py-20 flex items-center justify-center">
        <div className="container-hba px-4">
          <div className="flex flex-col items-center justify-center rounded-[3rem] bg-[#121E1A] py-24 shadow-lg border border-emerald-900/30 text-center px-4 max-w-2xl mx-auto">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-[#080D0A] text-emerald-400 border border-emerald-500/20 mb-6">
              <ShoppingBag size={32} />
            </div>
            <h1 className="font-serif text-3xl text-white">
              Your bag is empty
            </h1>
            <p className="mt-3 text-sm text-[#F5F2EB]/60 mb-8">
              Add a product before proceeding to checkout.
            </p>
            <Link
              to="/products"
              className="btn-primary inline-flex items-center gap-2 px-8 py-3.5"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleShippingChange = (e) =>
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  const handleBillingChange = (e) =>
    setBilling({ ...billing, [e.target.name]: e.target.value });

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (activeItems.length === 0) {
      setError("Please select at least one item to purchase.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const orderItems = activeItems.map((item) => {
        const effectivePrice =
          isFranchise && item.wholesalePrice ? item.wholesalePrice : item.price;
        const originalPrice =
          isFranchise && item.wholesalePrice
            ? item.price
            : item.compareAtPrice || item.price;
        return {
          product: item._id || item.id,
          name: item.name,
          price: effectivePrice,
          compareAtPrice: originalPrice,
          quantity: item.quantity || 1,
        };
      });

      const orderPayload = {
        items: orderItems,
        shippingAddress: shipping,
        billingAddress: sameAsShipping ? shipping : billing,
        mrpTotal: activeMRP,
        discount: activeDiscount,
        couponCode: couponDiscount > 0 ? couponCode : undefined,
        couponDiscount: couponDiscount > 0 ? couponDiscount : 0,
        subtotal: activeSubtotal,
        gst: gst,
        deliveryCharge: deliveryCharge,
        total: finalTotal,
        orderStatus: "Pending",
      };

      if (paymentMethod === "cod") {
        const order = await createOrder({
          ...orderPayload,
          paymentMethod: "cod",
          paymentStatus: "Pending",
        });
        clearCart();
        navigate(`/order-success/${order._id}`);
        return;
      }

      if (paymentMethod === "online") {
        const res = await loadRazorpayScript();
        if (!res) {
          setError(
            "Razorpay SDK failed to load. Please check your internet connection.",
          );
          setLoading(false);
          return;
        }
        const razorpayOrder = await createRazorpayOrder(finalTotal);
        const options = {
          key:
            import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TTsy9ShPccUeNk",
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Holy Basil Ayurveda",
          description: "Premium Wellness Products",
          order_id: razorpayOrder.id,
          prefill: {
            name: shipping.name,
            email: user?.email || "",
            contact: shipping.phone,
          },
          theme: { color: "#34D399" }, // Emerald 400
          handler: async function (response) {
            try {
              setLoading(true);
              await verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              const finalOrder = await createOrder({
                ...orderPayload,
                paymentMethod: "online",
                paymentStatus: "Completed",
                transactionId: response.razorpay_payment_id,
              });
              clearCart();
              navigate(`/order-success/${finalOrder._id}`);
            } catch (err) {
              console.error("Payment verification failed", err);
              setError(
                "Payment verification failed. If amount was deducted, please contact support.",
              );
            } finally {
              setLoading(false);
            }
          },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function (response) {
          setError(response.error.description);
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Unable to process your order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080D0A] text-[#F5F2EB] py-16 md:py-24">
      <div className="container-hba mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400/80 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft size={16} /> Back to cart
        </Link>
        <div className="mt-8 mb-12">
          <span className="eyebrow inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400/80">
            Checkout
          </span>
          <h1 className="mt-4 font-serif text-4xl text-white sm:text-5xl">
            Complete your order.
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-start"
        >
          <div className="space-y-8">
            <section className="rounded-[2.5rem] bg-[#121E1A] p-8 sm:p-10 shadow-lg border border-emerald-900/30">
              <h2 className="font-serif text-2xl text-white mb-2">
                Select Items to Purchase
              </h2>
              <p className="text-xs text-[#F5F2EB]/50 mb-6">
                Check items to include and adjust quantities as needed.
              </p>

              <div className="space-y-3">
                {directBuyItem && (
                  <div
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border-2 transition-all gap-4 ${selectedDirectBuy ? "border-emerald-500/50 bg-[#0B1310]" : "border-emerald-900/20 bg-[#080D0A] opacity-60"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        onClick={toggleDirectBuy}
                        className={`w-6 h-6 rounded-lg grid place-items-center border-2 cursor-pointer transition-colors shrink-0 ${selectedDirectBuy ? "bg-emerald-600 border-emerald-600 text-white" : "border-emerald-900/50 bg-transparent hover:border-emerald-400/50"}`}
                      >
                        {selectedDirectBuy && (
                          <Check size={14} strokeWidth={3} />
                        )}
                      </div>
                      <div>
                        <p className="font-serif font-medium text-white text-sm">
                          {directBuyItem.name}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          {(() => {
                            const effectivePrice =
                              isFranchise && directBuyItem.wholesalePrice
                                ? directBuyItem.wholesalePrice
                                : directBuyItem.price;
                            const originalPrice = isFranchise
                              ? directBuyItem.compareAtPrice ||
                                directBuyItem.price
                              : directBuyItem.compareAtPrice ||
                                directBuyItem.price;
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
                                <span
                                  className={`text-xs font-bold ${isFranchise && directBuyItem.wholesalePrice ? "text-amber-400" : "text-emerald-400"}`}
                                >
                                  ₹{effectivePrice.toLocaleString("en-IN")} each
                                </span>
                                {hasDiscount && (
                                  <span className="text-[10px] text-[#F5F2EB]/40 line-through">
                                    ₹{originalPrice.toLocaleString("en-IN")}
                                  </span>
                                )}
                                {hasDiscount && (
                                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-900/50 px-1 py-0.5 rounded border border-emerald-500/30">
                                    {discountPercentage}% OFF
                                  </span>
                                )}
                                {isFranchise &&
                                  directBuyItem.wholesalePrice && (
                                    <span className="text-[9px] font-bold text-amber-500 bg-amber-900/30 px-1.5 py-0.5 rounded border border-amber-500/30">
                                      B2B Rate
                                    </span>
                                  )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="flex items-center gap-2 rounded-full border border-emerald-900/40 px-3 py-1 bg-[#080D0A]">
                        <button
                          type="button"
                          onClick={() =>
                            updateItemQuantity(
                              directBuyItem._id || directBuyItem.id,
                              directBuyItem.quantity - 1,
                              true,
                            )
                          }
                          disabled={
                            directBuyItem.quantity <= (isFranchise ? 12 : 1)
                          }
                          className={`p-1 transition-colors ${directBuyItem.quantity <= (isFranchise ? 12 : 1) ? "text-[#F5F2EB]/20 cursor-not-allowed" : "text-emerald-400 hover:text-emerald-300"}`}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold text-white w-5 text-center">
                          {directBuyItem.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateItemQuantity(
                              directBuyItem._id || directBuyItem.id,
                              directBuyItem.quantity + 1,
                              true,
                            )
                          }
                          className="text-emerald-400 hover:text-emerald-300 p-1"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <strong
                        className={`font-serif text-sm ${isFranchise && directBuyItem.wholesalePrice ? "text-amber-400" : "text-emerald-300"}`}
                      >
                        ₹
                        {(
                          (isFranchise && directBuyItem.wholesalePrice
                            ? directBuyItem.wholesalePrice
                            : directBuyItem.price) * directBuyItem.quantity
                        ).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>
                )}
                {checkoutCart.map((item) => {
                  const itemId = item._id || item.id;
                  const isSelected = selectedCartIds.includes(itemId);
                  return (
                    <div
                      key={itemId}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border-2 transition-all gap-4 ${isSelected ? "border-emerald-500/50 bg-[#0B1310]" : "border-emerald-900/20 bg-[#080D0A] opacity-60"}`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          onClick={() => toggleCartItem(itemId)}
                          className={`w-6 h-6 rounded-lg grid place-items-center border-2 cursor-pointer transition-colors shrink-0 ${isSelected ? "bg-emerald-600 border-emerald-600 text-white" : "border-emerald-900/50 bg-transparent hover:border-emerald-400/50"}`}
                        >
                          {isSelected && <Check size={14} strokeWidth={3} />}
                        </div>
                        <div>
                          <p className="font-serif font-medium text-white text-sm">
                            {item.name}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            {(() => {
                              const effectivePrice =
                                isFranchise && item.wholesalePrice
                                  ? item.wholesalePrice
                                  : item.price;
                              const originalPrice = isFranchise
                                ? item.compareAtPrice || item.price
                                : item.compareAtPrice || item.price;
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
                                  <span
                                    className={`text-xs font-bold ${isFranchise && item.wholesalePrice ? "text-amber-400" : "text-emerald-400"}`}
                                  >
                                    ₹{effectivePrice.toLocaleString("en-IN")}{" "}
                                    each
                                  </span>
                                  {hasDiscount && (
                                    <span className="text-[10px] text-[#F5F2EB]/40 line-through">
                                      ₹{originalPrice.toLocaleString("en-IN")}
                                    </span>
                                  )}
                                  {hasDiscount && (
                                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-900/50 px-1 py-0.5 rounded border border-emerald-500/30">
                                      {discountPercentage}% OFF
                                    </span>
                                  )}
                                  {isFranchise && item.wholesalePrice && (
                                    <span className="text-[9px] font-bold text-amber-500 bg-amber-900/30 px-1.5 py-0.5 rounded border border-amber-500/30">
                                      B2B Rate
                                    </span>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        <div className="flex items-center gap-2 rounded-full border border-emerald-900/40 px-3 py-1 bg-[#080D0A]">
                          <button
                            type="button"
                            onClick={() =>
                              updateItemQuantity(
                                itemId,
                                item.quantity - 1,
                                false,
                              )
                            }
                            disabled={item.quantity <= (isFranchise ? 12 : 1)}
                            className={`p-1 transition-colors ${item.quantity <= (isFranchise ? 12 : 1) ? "text-[#F5F2EB]/20 cursor-not-allowed" : "text-emerald-400 hover:text-emerald-300"}`}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold text-white w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const minQty = isFranchise ? 12 : 1;
                              if (item.quantity < minQty)
                                updateItemQuantity(itemId, minQty, false);
                              else
                                updateItemQuantity(
                                  itemId,
                                  item.quantity + 1,
                                  false,
                                );
                            }}
                            className="text-emerald-400 hover:text-emerald-300 p-1"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="text-right">
                          {(() => {
                            const effectivePrice =
                              isFranchise && item.wholesalePrice
                                ? item.wholesalePrice
                                : item.price;
                            const qty = item.quantity || 1;
                            return (
                              <strong
                                className={`font-serif text-sm block ${isFranchise && item.wholesalePrice ? "text-amber-400" : "text-emerald-300"}`}
                              >
                                ₹
                                {(effectivePrice * qty).toLocaleString("en-IN")}
                              </strong>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[2.5rem] bg-[#121E1A] p-8 sm:p-10 shadow-lg border border-emerald-900/30">
              <h2 className="font-serif text-2xl text-white mb-8">
                Shipping Information
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  label="Full name"
                  name="name"
                  value={shipping.name}
                  onChange={handleShippingChange}
                  required
                />
                <Input
                  label="Phone"
                  name="phone"
                  value={shipping.phone}
                  onChange={handleShippingChange}
                  required
                />
                <div className="md:col-span-2">
                  <Input
                    label="Address"
                    name="address"
                    value={shipping.address}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <Input
                  label="City"
                  name="city"
                  value={shipping.city}
                  onChange={handleShippingChange}
                  required
                />
                {/* 👇 District Field ADDED Here 👇 */}
                <Input
                  label="District"
                  name="district"
                  value={shipping.district}
                  onChange={handleShippingChange}
                  required
                />
                <Input
                  label="State"
                  name="state"
                  value={shipping.state}
                  onChange={handleShippingChange}
                  required
                />
                <Input
                  label="Pincode"
                  name="pincode"
                  value={shipping.pincode}
                  onChange={handleShippingChange}
                  required
                />
              </div>
            </section>

            <section className="rounded-[2.5rem] bg-[#121E1A] p-8 sm:p-10 shadow-lg border border-emerald-900/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <h2 className="font-serif text-2xl text-white">
                  Billing Address
                </h2>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-[#F5F2EB]/80">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={() => setSameAsShipping(!sameAsShipping)}
                    className="w-4 h-4 accent-emerald-500"
                  />
                  Same as shipping
                </label>
              </div>
              {!sameAsShipping && (
                <div className="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-top-4">
                  <Input
                    label="Full name"
                    name="name"
                    value={billing.name}
                    onChange={handleBillingChange}
                    required
                  />
                  <Input
                    label="Phone"
                    name="phone"
                    value={billing.phone}
                    onChange={handleBillingChange}
                    required
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Address"
                      name="address"
                      value={billing.address}
                      onChange={handleBillingChange}
                      required
                    />
                  </div>
                  <Input
                    label="City"
                    name="city"
                    value={billing.city}
                    onChange={handleBillingChange}
                    required
                  />
                  {/* 👇 District Field ADDED Here 👇 */}
                  <Input
                    label="District"
                    name="district"
                    value={billing.district}
                    onChange={handleBillingChange}
                    required
                  />
                  <Input
                    label="State"
                    name="state"
                    value={billing.state}
                    onChange={handleBillingChange}
                    required
                  />
                  <Input
                    label="Pincode"
                    name="pincode"
                    value={billing.pincode}
                    onChange={handleBillingChange}
                    required
                  />
                </div>
              )}
            </section>

            <section className="rounded-[2.5rem] bg-[#121E1A] p-8 sm:p-10 shadow-lg border border-emerald-900/30">
              <h2 className="font-serif text-2xl text-white mb-8">
                Payment Method
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <label
                  className={`flex cursor-pointer flex-col gap-4 rounded-2xl border-2 p-5 transition-colors ${paymentMethod === "online" ? "border-emerald-500 bg-emerald-900/20" : "border-emerald-900/30 bg-[#080D0A] hover:border-emerald-500/40"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard
                        size={20}
                        className={
                          paymentMethod === "online"
                            ? "text-emerald-400"
                            : "text-[#F5F2EB]/40"
                        }
                      />
                      <span className="font-bold text-white">
                        Online Payment
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 accent-emerald-500"
                    />
                  </div>
                  <p className="text-xs text-[#F5F2EB]/50">
                    Pay securely via UPI, Cards, or Netbanking.
                  </p>
                </label>

                <label
                  className={`flex cursor-pointer flex-col gap-4 rounded-2xl border-2 p-5 transition-colors ${paymentMethod === "cod" ? "border-emerald-500 bg-emerald-900/20" : "border-emerald-900/30 bg-[#080D0A] hover:border-emerald-500/40"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Banknote
                        size={20}
                        className={
                          paymentMethod === "cod"
                            ? "text-emerald-400"
                            : "text-[#F5F2EB]/40"
                        }
                      />
                      <span className="font-bold text-white">
                        Cash on Delivery
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 accent-emerald-500"
                    />
                  </div>
                  <p className="text-xs text-[#F5F2EB]/50">
                    Pay in cash or UPI when your order arrives.
                  </p>
                </label>
              </div>
            </section>
            {error && (
              <div className="rounded-2xl border border-red-900/50 bg-red-950/40 p-4 text-sm text-red-400">
                {error}
              </div>
            )}
          </div>

          <aside className="sticky top-28 overflow-hidden rounded-[2.5rem] bg-[#0B1310] p-8 sm:p-10 border border-emerald-900/40 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <h2 className="font-serif text-2xl text-white">Order Summary</h2>
            <div className="mt-8 space-y-6">
              {activeItems.length === 0 ? (
                <p className="text-xs text-[#F5F2EB]/40 italic">
                  No items selected.
                </p>
              ) : (
                activeItems.map((item, index) => {
                  const effectivePrice =
                    isFranchise && item.wholesalePrice
                      ? item.wholesalePrice
                      : item.price;
                  const originalPrice = isFranchise
                    ? item.compareAtPrice || item.price
                    : item.compareAtPrice || item.price;
                  const hasDiscount =
                    originalPrice && originalPrice > effectivePrice;
                  const qty = item.quantity || 1;
                  return (
                    <div
                      key={`${item._id || item.id}-${index}`}
                      className="flex justify-between gap-4 text-sm border-b border-emerald-900/30 pb-4 last:border-none"
                    >
                      <div>
                        <p className="font-serif text-base text-white">
                          {item.name}
                        </p>
                        <p className="text-xs text-[#F5F2EB]/50 mt-1">
                          Qty: {qty}{" "}
                          {isFranchise && item.wholesalePrice && (
                            <span className="text-amber-500 font-bold ml-1">
                              | B2B
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <strong
                          className={`font-serif text-base block ${isFranchise && item.wholesalePrice ? "text-amber-400" : "text-emerald-300"}`}
                        >
                          ₹{(effectivePrice * qty).toLocaleString("en-IN")}
                        </strong>
                        {hasDiscount && (
                          <span className="text-[10px] text-[#F5F2EB]/40 line-through">
                            ₹{(originalPrice * qty).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-8 border-t border-emerald-900/40 pt-6 border-b pb-6">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#F5F2EB]/60 mb-3 block">
                Gift Card or Discount Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={couponDiscount > 0}
                  placeholder="ENTER CODE"
                  className="w-full bg-[#060A08] border border-emerald-900/40 rounded-xl px-4 py-3 text-xs text-white placeholder-[#F5F2EB]/30 focus:outline-none focus:border-emerald-500 transition-colors uppercase disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={
                    couponDiscount > 0 ? handleClearCoupon : handleApplyCoupon
                  }
                  disabled={isApplying || (!couponCode && couponDiscount === 0)}
                  className={`font-bold text-xs uppercase tracking-wider px-5 rounded-xl transition-all disabled:opacity-50 ${
                    couponDiscount > 0
                      ? "bg-red-950/50 text-red-400 border border-red-900/50 hover:bg-red-600 hover:text-white"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white"
                  }`}
                >
                  {isApplying ? "..." : couponDiscount > 0 ? "Remove" : "Apply"}
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
                <span>Total MRP ({activeCount} items)</span>
                <span className="line-through text-[#F5F2EB]/40">
                  ₹{activeMRP.toLocaleString("en-IN")}
                </span>
              </div>
              {activeDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Discount on MRP</span>
                  <span>- ₹{activeDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Coupon Discount</span>
                  <span>- ₹{couponDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between border-t border-emerald-900/30 pt-4">
                <span>Subtotal</span>
                <span className="font-semibold text-white">
                  ₹{(activeSubtotal - couponDiscount).toLocaleString("en-IN")}
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
            <button
              type="submit"
              disabled={loading || activeItems.length === 0}
              className="btn-primary mt-8 flex w-full justify-center py-4 text-base shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:shadow-none cursor-pointer"
            >
              {loading
                ? "Processing..."
                : paymentMethod === "online"
                  ? "Proceed to Payment"
                  : "Place Order (COD)"}
            </button>
          </aside>
        </form>
      </div>
    </main>
  );
}

function Input({ label, name, value, onChange, required }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-emerald-400/70">
        {label}
      </span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-2xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3.5 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 shadow-sm"
      />
    </label>
  );
}
