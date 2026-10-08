import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isLiked = isInWishlist(product._id);
  const cartBtnRef = useRef(null);
  const imageRef = useRef(null);

  const image =
    product.images?.[0] ||
    product.image ||
    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80";

  // --- Magnetic Button Effect ---
  useEffect(() => {
    const el = cartBtnRef.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      xTo(relX * 0.35);
      yTo(relY * 0.35);
    };

    const handleLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const handleImageEnter = () => {
    gsap.to(imageRef.current, {
      scale: 1.08,
      duration: 0.8,
      ease: "power3.out",
    });
  };

  const handleImageLeave = () => {
    gsap.to(imageRef.current, { scale: 1, duration: 0.8, ease: "power3.out" });
  };

  // 🌟 B2B Wholesale Pricing Logic
  const { user } = useAuth();
  const isFranchise = user?.role === "franchise";

  const effectivePrice =
    isFranchise && product.wholesalePrice
      ? product.wholesalePrice
      : product.price;

  const originalPrice = isFranchise
    ? product.compareAtPrice || product.price
    : product.compareAtPrice;

  const hasDiscount = originalPrice && originalPrice > effectivePrice;

  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - effectivePrice) / originalPrice) * 100)
    : 0;

  const handleWishlistClick = () => {
    toggleWishlist(product);
    if (isLiked) {
      toast("Removed from wishlist", { icon: "💔" });
    } else {
      toast.success("Added to wishlist!");
    }
  };

  const minQty = isFranchise ? 12 : 1;

  const handleCartClick = () => {
    // 🌟 BUG FIX: Send minQty (12 for franchise, 1 for regular)
    addToCart(product, minQty);
    toast.success(`Added ${minQty} to cart!`);
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      // 🌟 Updated with Dark Theme Card Background & Border
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-emerald-900/30 bg-[#121E1A] p-2.5 sm:p-3 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)]"
    >
      <div className="relative mb-3 sm:mb-4">
        <Link
          to={`/products/${product.slug}`}
          onMouseEnter={handleImageEnter}
          onMouseLeave={handleImageLeave}
          // 🌟 Dark container for image background
          className="block aspect-[4/4.5] overflow-hidden rounded-xl bg-[#080D0A]"
        >
          <img
            ref={imageRef}
            src={image}
            alt={product.name}
            className="h-full w-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
          />
        </Link>
        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1.5 z-10">
          {product.inventory === 0 && (
            <span className="rounded-md bg-red-600/90 px-1.5 py-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
              Sold Out
            </span>
          )}
          {product.isBestSeller && (
            <span className="rounded-md bg-emerald-700/90 px-1.5 py-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
              Best Seller
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-1 sm:px-2 pb-1 sm:pb-2">
        <Link
          to={`/products/${product.slug}`}
          className="group/title inline-block"
        >
          {/* 🌟 White Title for Dark Theme */}
          <h3 className="font-serif text-sm sm:text-lg font-bold text-white group-hover/title:text-emerald-400 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-[10px] sm:text-xs text-[#F5F2EB]/50 line-clamp-1">
          {product.category || "Ayurvedic Formulation"}
        </p>

        {/* BOTTOM ACTION ROW */}
        <div className="mt-auto pt-3 sm:pt-4 flex items-end justify-between gap-1 sm:gap-2">
          {/* Price & Discount Section */}
          <div className="flex flex-col items-start gap-1.5 min-w-0 flex-1">
            {hasDiscount && (
              <span className="text-[8px] sm:text-[9px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded-sm uppercase tracking-wider border border-emerald-800/50 whitespace-nowrap">
                {discountPercentage}% OFF
              </span>
            )}

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span
                className={`rounded-md px-1.5 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-bold text-white whitespace-nowrap ${isFranchise && product.wholesalePrice ? "bg-amber-600" : "bg-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.3)]"}`}
              >
                ₹{Number(effectivePrice).toLocaleString("en-IN")}
              </span>

              {hasDiscount && (
                <span className="text-[9px] sm:text-[10px] font-semibold text-[#F5F2EB]/40 line-through whitespace-nowrap">
                  ₹{Number(originalPrice).toLocaleString("en-IN")}
                </span>
              )}

              {isFranchise && product.wholesalePrice && (
                <span className="text-[9px] font-bold text-amber-400 ml-1">
                  B2B Rate
                </span>
              )}
            </div>
          </div>

          {/* Icons Section (Heart & Cart) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 pb-0.5">
            <button
              type="button"
              onClick={handleWishlistClick}
              className={`transition-colors p-1 sm:p-1.5 ${
                isLiked
                  ? "text-red-500"
                  : "text-[#F5F2EB]/60 hover:text-red-500"
              }`}
            >
              <Heart
                className="w-4 h-4 sm:w-[16px] sm:h-[16px]"
                fill={isLiked ? "currentColor" : "none"}
              />
            </button>
            <button
              ref={cartBtnRef}
              type="button"
              onClick={handleCartClick}
              disabled={product.inventory === 0}
              className="grid h-7 w-7 sm:h-8 sm:w-8 shrink-0 place-items-center rounded-full border border-emerald-500/30 text-emerald-400 transition-colors hover:bg-emerald-600 hover:text-white disabled:opacity-50"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
