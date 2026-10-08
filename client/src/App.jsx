import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Breadcrumbs from "./components/Breadcrumbs";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";

import {
  About,
  Manufacturing,
  Quality,
  Blog,
  Contact,
  Quote,
} from "./pages/BasicPages";

import { Toaster } from "react-hot-toast";

import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ScrollToTop from "./components/ScrollToTop";

import AdminDashboard from "./pages/AdminDashboard";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminLayout from "./components/AdminLayout";
import AdminProducts from "./pages/AdminProducts";
import AdminProductForm from "./pages/AdminProductForm";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderDetails from "./pages/AdminOrderDetails";
import AdminEnquiries from "./pages/AdminEnquiries";
import AdminEnquiryDetails from "./pages/AdminEnquiryDetails";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import EnquirySuccess from "./pages/EnquirySuccess";
import AdminCategories from "./pages/AdminCategories";
import Franchise from "./pages/Franchise";
import AdminFranchise from "./pages/AdminFranchise";
import BulkOrder from "./pages/BulkOrder";
import AdminRoyalties from "./pages/AdminRoyalties";
import ResetPassword from "./pages/ResetPassword";
import ManageCoupons from "./pages/ManageCoupons";

import ProtectedFranchiseRoute from "./components/ProtectedFranchiseRoute";
import ActiveFranchisePartners from "./pages/ActiveFranchisePartners";
import FranchiseLayout from "./components/FranchiseLayout";
import FranchiseDashboard from "./pages/franchise/FranchiseDashboard";
import FranchiseShop from "./pages/franchise/FranchiseShop";
import FranchiseOrders from "./pages/franchise/FranchiseOrders";
import FranchiseRoyalties from "./pages/franchise/FranchiseRoyalties";
import FranchiseProfile from "./pages/franchise/FranchiseProfile";
import FranchiseStock from "./pages/franchise/FranchiseStock";

function AppContent() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isFranchiseRoute = location.pathname.startsWith("/franchise-portal");
  const isDashboardLayout = isAdminRoute || isFranchiseRoute;

  return (
    <div className="min-h-screen flex flex-col bg-[#080D0A] text-[#F5F2EB]">
      <ScrollToTop />

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#121E1A",
            color: "#F5F2EB",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "100px",
            padding: "12px 24px",
            fontSize: "14px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          },
        }}
      />

      {!isDashboardLayout && <Navbar />}

      <main
        className={`flex-grow ${!isDashboardLayout ? "pt-24 md:pt-[104px]" : ""}`}
      >
        {!isDashboardLayout && <Breadcrumbs />}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="/manufacturing" element={<Manufacturing />} />
          <Route path="/quality" element={<Quality />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/enquiry-success" element={<EnquirySuccess />} />
          <Route path="/franchise" element={<Franchise />} />
          <Route path="/bulk-order" element={<BulkOrder />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Admin Routes */}
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/add" element={<AdminProductForm />} />
              <Route path="products/edit/:id" element={<AdminProductForm />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<AdminOrderDetails />} />
              <Route path="enquiries" element={<AdminEnquiries />} />
              <Route path="enquiries/:id" element={<AdminEnquiryDetails />} />
              <Route path="franchise" element={<AdminFranchise />} />
              <Route path="coupons" element={<ManageCoupons />} />
              <Route path="royalties" element={<AdminRoyalties />} />
              <Route
                path="/admin/active-franchise"
                element={<ActiveFranchisePartners />}
              />
            </Route>
          </Route>

          {/* 🌟 FRANCHISE PORTAL ROUTES */}
          <Route element={<ProtectedFranchiseRoute />}>
            <Route path="/franchise-portal" element={<FranchiseLayout />}>
              <Route index element={<FranchiseDashboard />} />
              <Route path="shop" element={<FranchiseShop />} />
              <Route path="orders" element={<FranchiseOrders />} />
              <Route path="royalties" element={<FranchiseRoyalties />} />
              <Route path="profile" element={<FranchiseProfile />} />
              <Route path="stock" element={<FranchiseStock />} />
            </Route>
          </Route>
        </Routes>
      </main>

      {!isDashboardLayout && <Footer />}
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
