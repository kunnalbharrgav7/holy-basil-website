import { Link } from "react-router-dom";
import { ArrowRight, HeartCrack } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useWishlist } from "../context/WishlistContext";

export default function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <main className="min-h-screen bg-[#080D0A] text-[#F5F2EB] py-16 md:py-24">
      <div className="container-hba mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-12 text-center flex flex-col items-center">
          <span className="eyebrow inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400/80">
            Your Collection
          </span>
          <h1 className="mt-4 font-serif text-4xl text-white sm:text-5xl">
            Wishlist
          </h1>
        </div>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[3rem] bg-[#121E1A] py-24 shadow-lg border border-emerald-900/30 text-center px-4">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-[#080D0A] text-emerald-400 border border-emerald-500/20 mb-6 shadow-inner">
              <HeartCrack size={32} />
            </div>
            <h2 className="font-serif text-2xl text-white">
              Your wishlist is empty
            </h2>
            <p className="mt-3 text-sm text-[#F5F2EB]/60 max-w-sm leading-relaxed mb-8">
              Save your favorite Ayurvedic formulations here so you can easily
              find them later.
            </p>
            <Link
              to="/products"
              className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              Explore Products <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
