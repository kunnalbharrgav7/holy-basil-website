import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Breadcrumbs() {
  const location = useLocation();
  const { user } = useAuth();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Agar user Home page par hai, toh breadcrumbs mat dikhao
  if (pathnames.length === 0) return null;

  return (
    // 🌟 Ekdum clean transparent container bina border/background ke
    <nav
      aria-label="Breadcrumb"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2 relative z-10"
    >
      <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#F5F2EB]/40">
        <Link
          to="/"
          className="hover:text-emerald-400 transition-colors shrink-0"
        >
          HOME
        </Link>

        {pathnames.map((value, index) => {
          let routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          // Format text (e.g., 'about' -> 'ABOUT')
          let formattedName = decodeURIComponent(value).replace(/-/g, " ");

          // 🌟 Context-aware handling for order-success
          if (value === "order-success") {
            if (user?.role === "franchise") {
              routeTo = "/franchise-portal/orders";
              formattedName = "STORE ORDERS";
            } else if (user?.role === "admin") {
              routeTo = "/admin/orders";
              formattedName = "ALL ORDERS";
            } else {
              routeTo = "/orders";
              formattedName = "MY ORDERS";
            }
          } else if (
            isLast &&
            pathnames[index - 1] === "order-success" &&
            value.length === 24
          ) {
            // Display clean short receipt ID e.g., #242289 instead of full 24-char ObjectId
            formattedName = `#${value.slice(-6).toUpperCase()}`;
          }

          return (
            <div key={routeTo + index} className="flex items-center gap-2 shrink-0">
              <ChevronRight size={12} className="text-[#F5F2EB]/20" />
              {isLast ? (
                <span className="text-emerald-400">{formattedName}</span>
              ) : (
                <Link
                  to={routeTo}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {formattedName}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
