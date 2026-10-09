import { useState } from "react";
import { NavLink, useLocation, Outlet, Link } from "react-router-dom";
import logoImg from "../assets/Logo/logo.png";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Leaf,
  Menu,
  X,
  Clock3,
  LoaderCircle,
  Sparkles,
  CheckCircle2,
  List,
  Plus,
  Store,
  Ticket,
  Users,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin", end: true },
  { label: "Categories", icon: Leaf, path: "/admin/categories" },
  { label: "Franchise", icon: Store, path: "/admin/franchise" },
  { label: "Active Partners", icon: Users, path: "/admin/active-franchise" },
  { label: "Coupons", icon: Ticket, path: "/admin/coupons" },
  {
    label: "Products",
    icon: Package,
    path: "/admin/products",
    children: [
      { label: "All Products", icon: List, path: "/admin/products" },
      { label: "Add Product", icon: Plus, path: "/admin/products/add" },
    ],
  },
  {
    label: "Orders",
    icon: ShoppingBag,
    path: "/admin/orders",
    children: [
      { label: "All Orders", icon: List, path: "/admin/orders" },
      { label: "Pending", icon: Clock3, path: "/admin/orders?status=Pending" },
      {
        label: "Processing",
        icon: LoaderCircle,
        path: "/admin/orders?status=Processing",
      },
    ],
  },
  {
    label: "Enquiries",
    icon: MessageSquare,
    path: "/admin/enquiries",
    children: [
      { label: "All Enquiries", icon: List, path: "/admin/enquiries" },
      { label: "New", icon: Sparkles, path: "/admin/enquiries?status=New" },
      {
        label: "Completed",
        icon: CheckCircle2,
        path: "/admin/enquiries?status=Completed",
      },
    ],
  },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("adminSidebarCollapsed") === "true";
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  const [openMenu, setOpenMenu] = useState(() => {
    if (location.pathname.startsWith("/admin/products")) return "products";
    if (location.pathname.startsWith("/admin/orders")) return "orders";
    if (location.pathname.startsWith("/admin/enquiries")) return "enquiries";
    return null;
  });

  const toggleSidebar = () => {
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem("adminSidebarCollapsed", String(next));
      return next;
    });
  };

  const toggleMenu = (label) => {
    if (collapsed) {
      setCollapsed(false);
      localStorage.setItem("adminSidebarCollapsed", "false");
    }
    setOpenMenu((current) => (current === label ? null : label));
  };

  const isParentActive = (item) => {
    if (item.label === "Products")
      return location.pathname.startsWith("/admin/products");
    if (item.label === "Orders")
      return location.pathname.startsWith("/admin/orders");
    if (item.label === "Enquiries")
      return location.pathname.startsWith("/admin/enquiries");
    return false;
  };

  return (
    // 🌟 Dark Admin Layout Wrapper (No Main Navbar)
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

      {/* Sidebar - Now starts from top-0 */}
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
            <img 
              src={logoImg} 
              alt="Logo" 
              className="h-10 w-10 object-contain shrink-0" 
            />

            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold tracking-wide text-white">
                  HOLY BASIL
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/60">
                  Administration
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
            {collapsed ? "•••" : "Management"}
          </p>

          <div className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const hasChildren = item.children?.length > 0;
              const parentActive = isParentActive(item);
              const menuKey = item.label.toLowerCase();
              const isMenuOpen = openMenu === menuKey;

              if (!hasChildren) {
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
              }

              return (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => toggleMenu(menuKey)}
                    title={collapsed ? item.label : undefined}
                    className={`group relative flex w-full items-center gap-3 rounded-2xl px-3 py-3.5 text-sm font-semibold transition-all duration-200
                      ${
                        parentActive
                          ? "bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-500/50"
                          : "text-[#F5F2EB]/60 hover:bg-emerald-900/20 hover:text-emerald-400"
                      }
                      ${collapsed ? "justify-center" : ""}`}
                  >
                    <Icon size={20} strokeWidth={1.8} className="shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}
                        />
                      </>
                    )}
                    {collapsed && <Tooltip label={item.label} />}
                  </button>

                  {!collapsed && isMenuOpen && (
                    <div className="ml-5 mt-2 space-y-1 border-l border-emerald-900/30 pl-3">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        const [childPath, queryString] = child.path.split("?");
                        const childParams = new URLSearchParams(
                          queryString || "",
                        );
                        const currentParams = new URLSearchParams(
                          location.search,
                        );
                        const isChildActive =
                          location.pathname === childPath &&
                          childParams.get("status") ===
                            currentParams.get("status");

                        return (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition
                              ${
                                isChildActive
                                  ? "bg-emerald-900/40 text-emerald-400 border border-emerald-500/20 shadow-sm"
                                  : "text-[#F5F2EB]/50 hover:bg-emerald-900/20 hover:text-emerald-400"
                              }`}
                          >
                            <ChildIcon size={15} />
                            <span>{child.label}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* User / Logout Footer */}
        <div className="border-t border-emerald-900/30 p-3 bg-[#0B1310]">
          {!collapsed && (
            <div className="mb-3 rounded-2xl bg-[#121E1A] border border-emerald-900/40 px-3 py-3">
              <p className="truncate text-sm font-bold text-white">
                {user?.name || "Administrator"}
              </p>
              <p className="mt-1 truncate text-xs text-[#F5F2EB]/50">
                {user?.email || "Admin account"}
              </p>
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
            Admin
          </p>
        </Link>
      </div>

      {/* Main Content Area (Pushes correctly based on sidebar width) */}
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
