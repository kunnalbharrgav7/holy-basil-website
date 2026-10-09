import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";

import { getProductBySlug, getProducts } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import { DetailSkeleton } from "../components/Skeletons";

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSection, setOpenSection] = useState("description");

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getProductBySlug(slug);
        setProduct(data);
        const allProducts = await getProducts();
        let similar = allProducts.filter(
          (p) => p.category === data.category && p._id !== data._id,
        );
        if (similar.length < 4) {
          const others = allProducts.filter(
            (p) => p._id !== data._id && !similar.some((s) => s._id === p._id),
          );
          similar = [...similar, ...others].slice(0, 4);
        } else {
          similar = similar.slice(0, 4);
        }
        setSimilarProducts(similar);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Product not found.");
      } finally {
        setLoading(false);
      }
    };
    loadProductData();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading)
    return (
      <main className="min-h-screen bg-[#080D0A] py-10 md:py-16">
        <DetailSkeleton />
      </main>
    );
  if (error || !product)
    return (
      <main className="min-h-screen bg-[#080D0A] py-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 font-serif text-xl">
            {error || "Product not found."}
          </p>
          <Link to="/products" className="btn-primary mt-6 inline-flex">
            Back to collection
          </Link>
        </div>
      </main>
    );

  const image =
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80";
  const isLiked = isInWishlist(product._id);
  const isFranchise = user?.role === "franchise";
  const effectivePrice =
    isFranchise && product?.wholesalePrice
      ? product.wholesalePrice
      : product?.price;
  const originalPrice = isFranchise
    ? product?.compareAtPrice || product?.price
    : product?.compareAtPrice;
  const hasDiscount = originalPrice && originalPrice > effectivePrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - effectivePrice) / originalPrice) * 100)
    : 0;

  // 🌟 BUG FIX: Setup dynamic minimum quantity based on user role
  const minQty = isFranchise ? 12 : 1;

  const handleCartClick = () => {
    // 🌟 BUG FIX: Send minQty (12 for franchise, 1 for regular)
    addToCart(product, minQty);
    toast.success(`Added ${minQty} to cart!`);
  };

  const handleBuyNowClick = () => {
    const buyNowItem = {
      ...product,
      price: effectivePrice,
      compareAtPrice: originalPrice,
      quantity: minQty, // 🌟 BUG FIX: Replaced hardcoded '1' with dynamic 'minQty'
    };
    navigate("/checkout", { state: { directBuyItem: buyNowItem } });
  };

  const handleWishlistClick = () => {
    toggleWishlist(product);
    if (isLiked) {
      toast("Removed from wishlist", { icon: "💔" });
    } else {
      toast.success("Added to wishlist!");
    }
  };

  const AccordionItem = ({ id, title, children }) => {
    const isOpen = openSection === id;
    return (
      <div className="border-b border-emerald-900/30 py-5">
        <button
          onClick={() => setOpenSection(isOpen ? "" : id)}
          className="flex w-full items-center justify-between text-left font-serif text-lg text-white hover:text-emerald-400 transition-colors"
        >
          {title}
          <span className="text-emerald-400/60 transition-transform duration-300">
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </span>
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"}`}
        >
          <div className="text-sm leading-relaxed text-[#F5F2EB]/60 pb-2">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#080D0A] text-[#F5F2EB] py-10 md:py-16">
      <div className="container-hba mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Link
          to="/products"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400/80 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft size={16} /> Back to collection
        </Link>

        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7 overflow-hidden rounded-[2.5rem] bg-[#121E1A] border border-emerald-900/30 shadow-lg sticky top-28">
            <img
              src={image}
              alt={product.name}
              className="aspect-square w-full object-cover sm:aspect-[4/3] lg:aspect-square transition-transform duration-1000 hover:scale-105 opacity-90 hover:opacity-100"
            />
          </div>

          <div className="lg:col-span-5 flex flex-col pt-2 lg:pt-8">
            <span className="eyebrow inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400/80">
              {product.category || "Collection"}
            </span>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-white sm:text-5xl">
              {product.name}
            </h1>

            <div className="mt-6 flex flex-wrap items-end gap-3">
              <div
                className={`text-3xl font-serif font-bold ${isFranchise && product.wholesalePrice ? "text-amber-400" : "text-emerald-300"}`}
              >
                ₹{Number(effectivePrice).toLocaleString("en-IN")}
              </div>
              {hasDiscount && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-semibold text-[#F5F2EB]/40 line-through">
                    ₹{Number(originalPrice).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-900 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                    {discountPercentage}% OFF
                  </span>
                  {isFranchise && product.wholesalePrice && (
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-900/30 border border-amber-500/30 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                      B2B Rate
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleCartClick}
                disabled={product.inventory === 0}
                className="btn-primary flex-1 py-4 text-base shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag size={18} />{" "}
                {product.inventory === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNowClick}
                disabled={product.inventory === 0}
                className="flex-1 flex items-center justify-center gap-2 rounded-full border-2 border-emerald-500/50 bg-emerald-900/30 text-white py-4 text-sm font-bold tracking-wider uppercase transition-all hover:bg-emerald-600 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                Buy Now
              </button>
              <button
                type="button"
                onClick={handleWishlistClick}
                className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl border transition-all cursor-pointer ${isLiked ? "border-red-500 bg-red-950/40 text-red-400" : "border-emerald-900/40 bg-[#121E1A] text-[#F5F2EB] hover:border-emerald-400 hover:bg-emerald-900/20"}`}
              >
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="mt-12 border-t border-emerald-900/30">
              <AccordionItem id="description" title="Description">
                <p>{product.description}</p>
              </AccordionItem>
              {product.ingredients?.length > 0 && (
                <AccordionItem id="ingredients" title="Ingredients">
                  <ul className="space-y-1.5">
                    {product.ingredients.map((ing, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-1">•</span>
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionItem>
              )}
              {product.usage && (
                <AccordionItem id="usage" title="Usage & Directions">
                  <p>{product.usage}</p>
                </AccordionItem>
              )}
              <AccordionItem id="quality" title="Quality & Verification">
                <p>
                  Quality-focused positioning is central to Holy Basil Ayurveda.
                  Every formulation undergoes exhaustive clinical testing to
                  ensure absolute purity, safety, and potency.
                </p>
              </AccordionItem>
            </div>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div className="mt-32 border-t border-emerald-900/30 pt-16">
            <h2 className="font-serif text-3xl md:text-4xl text-white text-center mb-10">
              You might also like
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {similarProducts.map((simProduct) => (
                <ProductCard key={simProduct._id} product={simProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
