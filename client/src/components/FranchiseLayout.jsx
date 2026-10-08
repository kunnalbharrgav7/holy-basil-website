import { useState } from "react";
import { NavLink, useLocation, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  ShoppingBag,
  Wallet,
  User as UserIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Menu,
  X,
  Package,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/franchise-portal",
    end: true,
  },
  { label: "Place Order", icon: ShoppingCart, path: "/franchise-portal/shop" },
  { label: "My Orders", icon: ShoppingBag, path: "/franchise-portal/orders" },
  {
    label: "My Stock",
    icon: Package,
    path: "/franchise-portal/stock",
  },
  {
    label: "Royalty Ledger",
    icon: Wallet,
    path: "/franchise-portal/royalties",
  },
  { label: "My Profile", icon: UserIcon, path: "/franchise-portal/profile" },
];

export default function FranchiseLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("franchiseSidebarCollapsed") === "true";
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem("franchiseSidebarCollapsed", String(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#080D0A] text-[#F5F2EB]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-[#080D0A]/85 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-40 flex h-screen flex-col
          border-r border-emerald-900/30 bg-[#0B1310] backdrop-blur-xl
          transition-all duration-300
          ${collapsed ? "w-[76px]" : "w-[260px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo / Brand Header */}
        <div className="flex h-20 items-center border-b border-emerald-900/30 px-4">
          <Link
            to="/"
            className={`flex items-center gap-3 overflow-hidden transition-opacity hover:opacity-80 ${collapsed ? "w-full justify-center" : ""}`}
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-900/30 border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <Leaf size={20} />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold tracking-wide text-white">
                  HOLY BASIL
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/60">
                  Franchise Portal
                </p>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="ml-auto rounded-xl p-2 text-[#F5F2EB]/50 hover:bg-emerald-900/30 hover:text-emerald-400 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-emerald-900/40 [&::-webkit-scrollbar-thumb]:rounded-full">
          <p
            className={`mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/50 ${collapsed ? "text-center" : ""}`}
          >
            {collapsed ? "•••" : "Business"}
          </p>

          <div className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-2xl px-3 py-3.5 text-sm font-semibold transition-all duration-200
                    ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-500/50"
                        : "text-[#F5F2EB]/60 hover:bg-emerald-900/20 hover:text-emerald-400"
                    }
                    ${collapsed ? "justify-center" : ""}`
                  }
                >
                  <Icon size={20} strokeWidth={1.8} className="shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                  {collapsed && <Tooltip label={item.label} />}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* User / Logout Footer */}
        <div className="border-t border-emerald-900/30 p-3 bg-[#0B1310]">
          {!collapsed && (
            <div className="mb-3 rounded-2xl bg-[#121E1A] border border-emerald-900/40 px-3 py-3">
              <p className="truncate text-sm font-bold text-white">
                {user?.name || "Franchise Partner"}
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-900/50 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                  {user?.franchiseTier || "Standard"}
                </span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={logout}
            title={collapsed ? "Logout" : undefined}
            className={`group relative flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-950/40 hover:text-red-300 border border-transparent hover:border-red-900/50 ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut size={19} />
            {!collapsed && <span>Logout</span>}
            {collapsed && <Tooltip label="Logout" />}
          </button>

          <button
            type="button"
            onClick={toggleSidebar}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`mt-2 hidden w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-[#F5F2EB]/50 transition hover:bg-emerald-900/20 hover:text-emerald-400 lg:flex ${collapsed ? "justify-center" : ""}`}
          >
            {collapsed ? (
              <ChevronRight size={19} />
            ) : (
              <>
                <ChevronLeft size={19} />
                <span>Collapse sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center border-b border-emerald-900/30 bg-[#0B1310] px-4 backdrop-blur-xl lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-900/30 border border-emerald-500/20 text-emerald-400 shadow-sm"
        >
          <Menu size={21} />
        </button>

        <Link to="/" className="ml-3 transition-opacity hover:opacity-80">
          <p className="text-sm font-bold text-white">Holy Basil</p>
          <p className="text-[10px] uppercase tracking-wider text-emerald-400/60">
            Franchise Portal
          </p>
        </Link>
      </div>

      {/* Main Content Area */}
      <div
        className={`min-h-screen transition-all duration-300 ${collapsed ? "lg:pl-[76px]" : "lg:pl-[260px]"}`}
      >
        <div className="pt-[70px] lg:pt-8 p-6 lg:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function Tooltip({ label }) {
  return (
    <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-[#121E1A] border border-emerald-900/50 shadow-xl shadow-black px-3 py-2 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 z-50">
      {label}
    </span>
  );
}
