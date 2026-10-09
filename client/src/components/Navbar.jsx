import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  ShoppingBag,
  X,
  Heart,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import Logo from "./Logo";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

// 🌟 Category list for the dropdown
const productCategories = [
  { name: "Herbal Capsules", query: "Herbal Capsules" },
  { name: "Shilajit", query: "Shilajits" },
  // { name: "Blends Of Shilajit", query: "Blends Of Shilajit" },
  { name: "Herbal Powders", query: "Herbal Powders" },
  { name: "Herbal Oils", query: "Herbal Oils" },
  // { name: "Herbal Churans", query: "Herbal Churans" },
  { name: "Herbal Tablet", query: "Herbal Tablets" },
  { name: "Herbal Syrups", query: "Herbal Syrups" },
  // { name: "Baby Drops", query: "Baby Drops" },
  // { name: "Herbal Juice", query: "Herbal Juice" },
  // { name: "Herbal Ointments", query: "Herbal Ointments" },
  // { name: "Herbal Cosmetics", query: "Herbal Cosmetics" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const { count } = useCart();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    import("../services/productService").then(({ getProducts }) => {
      getProducts().then((products) => {
        const filtered = (Array.isArray(products) ? products : []).filter(
          (p) =>
            p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category?.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        setSearchResults(filtered.slice(0, 5));
      });
    });
  }, [searchQuery]);

  const wishlistCount = wishlist?.length || 0;

  const links = [
    ["/", "Home"],
    ["/about", "About"],
    ["/products", "Products"],
    ["/manufacturing", "Manufacturing"],
    ["/quality", "Quality"],
    ["/franchise", "Franchise"],
    ["/blog", "Insights"],
    ["/contact", "Contact"],
  ];

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  // 🌟 Handle category selection and navigate to products with query
  const handleCategoryClick = (query) => {
    setCategoryDropdownOpen(false);
    setOpen(false);
    navigate(`/products?category=${encodeURIComponent(query)}`);
  };

  return (
    // 🌟 Dark Navbar Background
    <header className="fixed inset-x-0 top-0 z-50 w-full max-w-full overflow-x-clip border-b border-emerald-900/30 bg-[#080D0A]/80 backdrop-blur-xl">
      {/* 🌟 Announcement Bar */}
      <div className="bg-[#121E1A] text-emerald-400 text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase py-2.5 overflow-hidden flex border-b border-emerald-900/40">
        <div className="flex animate-marquee whitespace-nowrap w-max items-center">
          <span className="mx-5 sm:mx-8 shrink-0">
            🌿 Pure Himalayan Heritage
          </span>
          <span className="mx-5 sm:mx-8 shrink-0">•</span>
          <span className="mx-5 sm:mx-8 shrink-0">
            Certified Organic Ingredients
          </span>
          <span className="mx-5 sm:mx-8 shrink-0">•</span>
          <span className="mx-5 sm:mx-8 shrink-0">
            Crafted for Modern Wellness
          </span>
          <span className="mx-5 sm:mx-8 shrink-0">•</span>

          <span className="mx-5 sm:mx-8 shrink-0">
            🌿 Pure Himalayan Heritage
          </span>
          <span className="mx-5 sm:mx-8 shrink-0">•</span>
          <span className="mx-5 sm:mx-8 shrink-0">
            Certified Organic Ingredients
          </span>
          <span className="mx-5 sm:mx-8 shrink-0">•</span>
          <span className="mx-5 sm:mx-8 shrink-0">
            Crafted for Modern Wellness
          </span>
          <span className="mx-5 sm:mx-8 shrink-0">•</span>
        </div>
      </div>

      <div className="flex h-20 min-w-0 items-center justify-between gap-2 px-3 sm:px-4 lg:px-5 xl:px-8 2xl:px-10">
        <div className="shrink-0 ml-4 sm:ml-8 lg:ml-12">
          <Logo />
        </div>

        {/* 🌟 Desktop Nav Links */}
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-2 px-1 lg:flex xl:gap-4">
          {links.map(([to, label]) => {
            // 🌟 If link is Products, add Hover Dropdown functionality
            if (to === "/products") {
              return (
                <div
                  key={to}
                  className="relative py-2"
                  onMouseEnter={() => setCategoryDropdownOpen(true)}
                  onMouseLeave={() => setCategoryDropdownOpen(false)}
                >
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `shrink-0 whitespace-nowrap text-[13px] font-semibold transition xl:text-sm flex items-center gap-1 ${
                        isActive
                          ? "text-emerald-400"
                          : "text-[#F5F2EB]/70 hover:text-emerald-400"
                      }`
                    }
                  >
                    {label}{" "}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${categoryDropdownOpen ? "rotate-180 text-emerald-400" : ""}`}
                    />
                  </NavLink>

                  {/* 🌟 Category Dropdown Menu */}
                  {categoryDropdownOpen && (
                    <div className="absolute top-full left-0 w-max min-w-[260px] bg-[#121E1A] border border-emerald-900/60 rounded-2xl shadow-2xl py-3 z-50 animate-fade-in backdrop-blur-md">
                      <div className="max-h-[380px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-emerald-800/55">
                        {productCategories.map((cat, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleCategoryClick(cat.query)}
                            className="w-full text-left px-5 py-2.5 text-xs font-medium text-[#F5F2EB]/90 hover:text-white hover:bg-emerald-950/50 transition-all flex items-center justify-between gap-6 group cursor-pointer whitespace-nowrap"
                          >
                            <span>{cat.name}</span>
                            <span className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              →
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `shrink-0 whitespace-nowrap text-[13px] font-semibold transition xl:text-sm ${
                    isActive
                      ? "text-emerald-400"
                      : "text-[#F5F2EB]/70 hover:text-emerald-400"
                  }`
                }
              >
                {label}
              </NavLink>
            );
          })}
        </nav>

        {/* 🌟 Desktop Actions */}
        <div className="hidden shrink-0 items-center gap-1 lg:flex xl:gap-1.5">
          {user?.role === "franchise" && (
            <Link
              to="/bulk-order"
              className="mr-2 flex h-8 items-center rounded-full bg-amber-500/10 border border-amber-500/30 px-3 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              Bulk Order
            </Link>
          )}

          <button
            onClick={() => setIsSearchOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-emerald-900/30 text-[#F5F2EB]"
          >
            <Search size={18} />
          </button>

          <Link
            to="/wishlist"
            className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-emerald-900/30 text-[#F5F2EB]"
          >
            <Heart size={18} />
            {wishlistCount > 0 && (
              <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-emerald-900/30 text-[#F5F2EB]"
          >
            <ShoppingBag size={19} />
            {count > 0 && (
              <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-emerald-500 px-1 text-[9px] text-white">
                {count}
              </span>
            )}
          </Link>

          <div className="mx-1 h-7 w-px shrink-0 bg-emerald-900/40" />

          {user ? (
            <>
              <Link
                to="/profile"
                className="flex h-10 items-center justify-center rounded-full px-2.5 text-sm font-semibold text-[#F5F2EB]/70 hover:bg-emerald-900/30 hover:text-emerald-400 transition"
              >
                Hi, {user.name?.split(" ")[0] || "there"}
              </Link>
              <button
                onClick={handleLogout}
                className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-emerald-900/50 px-3 text-sm font-semibold text-[#F5F2EB]/80 hover:bg-emerald-900/30 transition"
              >
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex h-10 items-center justify-center rounded-full px-2.5 text-sm font-semibold text-[#F5F2EB]/70 hover:bg-emerald-900/30 hover:text-emerald-400 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="flex h-10 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-900/20 px-3 text-sm font-semibold text-emerald-400 hover:bg-emerald-600 hover:text-white transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* 🌟 Mobile Hamburger Actions */}
        <div className="flex shrink-0 items-center lg:hidden">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-emerald-900/30 text-[#F5F2EB]"
          >
            <Search size={18} />
          </button>
          <Link
            to="/wishlist"
            onClick={() => setOpen(false)}
            className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-emerald-900/30 text-[#F5F2EB]"
          >
            <Heart size={19} />
            {wishlistCount > 0 && (
              <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-emerald-900/30 text-[#F5F2EB]"
          >
            <ShoppingBag size={19} />
            {count > 0 && (
              <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-emerald-500 px-1 text-[9px] text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen((current) => !current)}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-emerald-900/30 text-[#F5F2EB]"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* =====================================================
          EXPANDING SEARCH OVERLAY MODAL (Dark Theme)
      ===================================================== */}
      {isSearchOpen && (
        <div className="absolute inset-x-0 top-0 z-50 bg-[#0B1310] p-4 sm:p-6 shadow-2xl border-b border-emerald-900/50 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
          <div className="container-hba mx-auto max-w-3xl">
            <div className="flex items-center justify-between gap-2 sm:gap-4 border-b border-emerald-900/40 pb-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Search size={22} className="text-emerald-400/60 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search formulations..."
                  className="w-full bg-transparent font-serif text-lg sm:text-xl md:text-2xl text-white outline-none placeholder:text-[#F5F2EB]/30 truncate"
                />
              </div>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="shrink-0 rounded-full bg-emerald-900/30 px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#F5F2EB] hover:bg-emerald-600 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>

            {searchQuery.trim() !== "" && (
              <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-2 py-2 custom-scrollbar">
                {searchResults.length > 0 ? (
                  searchResults.map((product) => {
                    const img = product.images?.[0] || product.image;
                    return (
                      <Link
                        key={product._id}
                        to={`/products/${product.slug}`}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-[#121E1A] hover:bg-[#16231D] border border-emerald-900/30 transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {img && (
                            <img
                              src={img}
                              alt={product.name}
                              className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-xl object-cover border border-emerald-900/40"
                            />
                          )}
                          <div className="truncate">
                            <h4 className="font-serif text-sm sm:text-base text-white group-hover:text-emerald-400 truncate">
                              {product.name}
                            </h4>
                            <p className="text-[10px] sm:text-xs text-[#F5F2EB]/50 truncate">
                              {product.category || "Ayurvedic Formulation"}
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 font-serif text-sm sm:text-base font-bold text-emerald-400">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </span>
                      </Link>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-sm text-[#F5F2EB]/50">
                    No formulations found matching "{searchQuery}".
                  </div>
                )}
                <div className="pt-2 text-center">
                  <button
                    onClick={() => {
                      navigate(
                        `/products?search=${encodeURIComponent(searchQuery)}`,
                      );
                      setIsSearchOpen(false);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-400 underline underline-offset-4 hover:text-emerald-300"
                  >
                    View all results for "{searchQuery}"
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          MOBILE MENU DRAWER (Dark Theme with Toggle Categories)
      ===================================================== */}
      {open && (
        <nav className="w-full max-w-full overflow-x-hidden overflow-y-auto max-h-[calc(100vh-5rem)] pb-10 border-t border-emerald-900/40 bg-[#0B1310] px-4 py-5 sm:px-6 lg:hidden custom-scrollbar">
          {links.map(([to, label]) => {
            // 🌟 Collapsible Category Dropdown for Mobile View
            if (to === "/products") {
              return (
                <div key={to} className="border-b border-emerald-900/20 py-4">
                  <div className="flex items-center justify-between">
                    <Link
                      to={to}
                      onClick={() => setOpen(false)}
                      className="text-lg font-semibold text-white hover:text-emerald-400"
                    >
                      {label}
                    </Link>
                    <button
                      onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                      className="p-2 text-emerald-400 cursor-pointer"
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${mobileProductsOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>

                  {/* Toggle sub-list for categories */}
                  {mobileProductsOpen && (
                    <div className="pl-4 space-y-2.5 border-l border-emerald-500/30 mt-3 pt-1 animate-fade-in">
                      {productCategories.map((cat, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleCategoryClick(cat.query)}
                          className="block text-left text-sm text-[#F5F2EB]/70 hover:text-emerald-400 py-1 cursor-pointer w-full"
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="block border-b border-emerald-900/20 py-4 text-lg font-semibold text-white hover:text-emerald-400"
              >
                {label}
              </Link>
            );
          })}

          {user ? (
            <div className="mt-6 space-y-3 bg-[#121E1A] p-4 rounded-2xl border border-emerald-900/30">
              <div className="pb-2 mb-2 border-b border-emerald-900/20">
                <p className="text-sm text-[#F5F2EB]/60 text-center">
                  Signed in as{" "}
                  <span className="font-semibold text-white">{user.name}</span>
                </p>
              </div>

              {/* 🌟 Naya Profile & Dashboard Button */}
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-900/20 px-3 py-3 text-sm font-semibold text-emerald-400 hover:bg-emerald-600 hover:text-white transition"
              >
                <User size={16} /> Profile & Dashboard
              </Link>

              {user.role === "franchise" && (
                <Link
                  to="/bulk-order"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-3 text-sm font-bold text-amber-400"
                >
                  <ShoppingBag size={16} /> Bulk Order Portal
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-emerald-900/50 px-3 py-3 text-sm font-semibold text-[#F5F2EB]/80 hover:bg-emerald-900/30"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex min-w-0 items-center justify-center rounded-full border border-emerald-500/30 px-3 py-3.5 text-sm font-semibold text-emerald-50 hover:bg-emerald-900/30"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="flex min-w-0 items-center justify-center rounded-full bg-emerald-600 px-3 py-3.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:bg-emerald-500"
              >
                Sign Up
              </Link>
            </div>
          )}
          <Link
            to="/quote"
            onClick={() => setOpen(false)}
            className="btn-primary mt-4 w-full py-4 text-center block"
          >
            Request a Quote
          </Link>
        </nav>
      )}
    </header>
  );
}
