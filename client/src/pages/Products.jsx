import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import { getProducts } from "../services/productService";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const searchFromUrl = searchParams.get("search") || "";
  const [cat, setCat] = useState(categoryFromUrl || "All");
  const [q, setQ] = useState(searchFromUrl);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setQ(searchFromUrl);
  }, [searchFromUrl]);
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Unable to load products.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    setCat(categoryFromUrl || "All");
  }, [categoryFromUrl]);

  const categories = useMemo(() => {
    const unique = [
      ...new Set(products.map((p) => p.category).filter(Boolean)),
    ];
    return ["All", ...unique];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const searchTerm = q.toLowerCase().trim();
      const productCat = (product.category || "").toLowerCase();
      const selectedCat = cat.toLowerCase();
      const matchesCategory =
        cat === "All" ||
        productCat === selectedCat ||
        productCat.includes(selectedCat);
      const matchesSearch =
        !searchTerm ||
        product.name?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        productCat.includes(searchTerm);
      return matchesCategory && matchesSearch;
    });
  }, [products, cat, q]);

  const handleCategoryChange = (category) => {
    setCat(category);
    const nextParams = new URLSearchParams(searchParams);
    if (category === "All") nextParams.delete("category");
    else nextParams.set("category", category);
    setSearchParams(nextParams);
  };

  return (
    <main className="min-h-screen bg-[#080D0A] text-[#F5F2EB] py-10 md:py-16">
      <div className="container-hba mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="relative mb-10 flex min-h-[14rem] h-auto md:h-64 w-full flex-col justify-center overflow-hidden rounded-[2rem] bg-[#121E1A] border border-emerald-900/30 p-6 sm:p-8 md:p-12 shadow-lg">
          <div className="relative z-10 max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/80">
              — Collections
            </span>
            <h1 className="mt-2 font-serif text-3xl text-white sm:text-4xl md:text-5xl">
              Explore the Botanical Collection
            </h1>
            <p className="mt-3 text-sm text-[#F5F2EB]/60 max-w-md">
              Discover our premium range of thoughtfully formulated Ayurvedic
              products for your daily rituals.
            </p>
          </div>
          <div className="absolute right-0 top-0 h-full w-full sm:w-1/2 bg-gradient-to-l from-emerald-600/10 to-transparent mix-blend-overlay pointer-events-none" />
        </div>

        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-white">
            {cat === "All" ? "All Products" : `${cat} Collection`}
          </h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-2 rounded-full bg-[#121E1A] border border-emerald-500/30 px-4 py-2 text-sm font-semibold text-emerald-400 shadow-sm md:hidden"
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        <div className="flex flex-col gap-10 md:flex-row items-start">
          <aside
            className={`w-full shrink-0 md:w-60 lg:w-72 ${isSidebarOpen ? "block" : "hidden md:block"}`}
          >
            <div className="sticky top-24 rounded-3xl bg-[#121E1A] border border-emerald-900/30 p-6 shadow-md">
              <div className="relative mb-8">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400/50"
                />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-full border border-emerald-900/40 bg-[#080D0A] py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-emerald-500 shadow-sm placeholder-[#F5F2EB]/30"
                />
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400/80">
                    Category
                  </h3>
                  <button
                    onClick={() => handleCategoryChange("All")}
                    className="text-[10px] text-[#F5F2EB]/40 hover:text-emerald-400"
                  >
                    Reset
                  </button>
                </div>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex cursor-pointer items-center gap-3 group"
                    >
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={cat === category}
                          onChange={() => handleCategoryChange(category)}
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-emerald-900/50 bg-[#080D0A] checked:border-emerald-500 checked:bg-emerald-600 transition-all"
                        />
                        <svg
                          className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100 text-white"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path
                            d="M3 8L6 11L11 3.5"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            stroke="currentColor"
                          />
                        </svg>
                      </div>
                      <span
                        className={`text-sm transition-colors ${cat === category ? "font-bold text-emerald-400" : "text-[#F5F2EB]/70 group-hover:text-white"}`}
                      >
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 w-full">
            {loading && (
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            )}
            {error && !loading && (
              <div className="py-20 text-center text-red-400">{error}</div>
            )}
            {!loading && !error && (
              <>
                <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
                  {filtered.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                {!filtered.length && (
                  <div className="flex flex-col items-center justify-center py-20 text-center rounded-[2.5rem] bg-[#121E1A] border border-emerald-900/30">
                    <p className="font-serif text-xl text-white">
                      No products found.
                    </p>
                    <p className="mt-2 text-sm text-[#F5F2EB]/50">
                      Try adjusting your search or category filters.
                    </p>
                    <button
                      onClick={() => {
                        setQ("");
                        handleCategoryChange("All");
                      }}
                      className="btn-outline mt-6"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
