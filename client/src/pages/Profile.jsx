import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Package,
  ShoppingBag,
  MessageSquare,
  ArrowRight,
  Edit2,
  Clock,
  LayoutDashboard,
  Check,
  X,
  Loader2,
  Camera,
  Trash2,
  Store,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import imageCompression from "browser-image-compression";

export default function ProfileBento() {
  const { user, updateUser } = useAuth();

  // 🌟 FIX 1: Added franchise role check
  const isAdmin = user?.role === "admin";
  const isFranchise = user?.role === "franchise";

  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ error: "", success: "" });

  const [formData, setFormData] = useState({ name: "", phone: "", avatar: "" });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  // Orders logic runs only for normal customers (not admin, not franchise)
  useEffect(() => {
    if (user && !isAdmin && !isFranchise) {
      const fetchMyOrders = async () => {
        try {
          const { data } = await api.get("/orders/mine");
          const sortedOrders = data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );
          setRecentOrders(sortedOrders.slice(0, 2));
        } catch (err) {
          console.error("Failed to fetch recent orders:", err);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchMyOrders();
    } else {
      setLoadingOrders(false);
    }
  }, [user, isAdmin, isFranchise]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      avatar: user?.avatar || "",
    });
    setFeedback({ error: "", success: "" });
    setIsEditing(false);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFeedback({ error: "Please select an image file.", success: "" });
      return;
    }
    try {
      setUploadingImage(true);
      setFeedback({ error: "", success: "" });
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 400,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const uploadData = new FormData();
      uploadData.append("image", compressedFile);
      const response = await api.post("/uploads/avatar", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({
        ...prev,
        avatar: response.data.url || response.data.imageUrl,
      }));
    } catch (err) {
      console.error("Image upload failed:", err);
      setFeedback({ error: "Failed to upload image.", success: "" });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveAvatar = () =>
    setFormData((prev) => ({ ...prev, avatar: "" }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ error: "", success: "" });
    try {
      const response = await api.patch("/users/me", {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        avatar: formData.avatar,
      });
      updateUser(response.data);
      setFeedback({ success: "Profile updated successfully!", error: "" });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setFeedback({
        error: err.response?.data?.message || "Failed to update profile.",
        success: "",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080D0A] text-[#F5F2EB] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="mb-12 border-b border-emerald-900/30 pb-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-400/80">
            Your Account
          </span>
          <h1 className="mt-2 font-serif text-4xl text-white md:text-5xl">
            {isAdmin
              ? "Admin Portal"
              : isFranchise
                ? "Franchise Portal"
                : "My Profile"}
          </h1>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          {/* LEFT ID CARD */}
          <div className="w-full md:w-[38%] lg:w-[35%] shrink-0">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#121E1A] to-[#0B1310] p-8 border border-emerald-900/40 shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setFeedback({ error: "", success: "" });
                  }}
                  className="absolute right-6 top-6 flex items-center gap-1.5 rounded-full bg-[#080D0A] border border-emerald-900/50 px-4 py-2 text-xs font-bold text-emerald-400 transition hover:bg-emerald-600 hover:text-white shadow-sm z-10"
                >
                  <Edit2 size={12} /> <span>Edit</span>
                </button>
              )}

              <div className="flex flex-col items-center text-center relative z-10 mt-4">
                <div className="relative inline-block">
                  <div className="group relative grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-full bg-[#080D0A] border-2 border-emerald-500/30 text-4xl font-serif text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    {(isEditing ? formData.avatar : user?.avatar) &&
                    (isEditing ? formData.avatar : user?.avatar).trim() !==
                      "" ? (
                      <img
                        src={isEditing ? formData.avatar : user?.avatar}
                        alt="Profile"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}

                    <span
                      className={`text-emerald-400 font-serif text-3xl font-bold ${(isEditing ? formData.avatar : user?.avatar) && (isEditing ? formData.avatar : user?.avatar).trim() !== "" ? "hidden" : "flex"} items-center justify-center h-full w-full`}
                    >
                      {formData.name
                        ? formData.name.charAt(0).toUpperCase()
                        : user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                    {isEditing && (
                      <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/70 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                        {uploadingImage ? (
                          <Loader2
                            size={24}
                            className="animate-spin text-emerald-400"
                          />
                        ) : (
                          <Camera size={24} />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarUpload}
                          disabled={uploadingImage}
                        />
                      </label>
                    )}
                  </div>
                  {isEditing && formData.avatar && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="absolute bottom-1 right-1 z-10 grid h-8 w-8 place-items-center rounded-full border-2 border-[#121E1A] bg-red-950 text-red-400 shadow-sm transition-colors hover:bg-red-600 hover:text-white"
                      title="Remove Photo"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  <>
                    <h2 className="mt-5 font-serif text-2xl text-white font-bold tracking-wide">
                      {user?.name || "Guest User"}
                    </h2>

                    {/* 🌟 FIX 2: Dynamic Badge based on Role */}
                    <div
                      className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border shadow-sm ${
                        isAdmin
                          ? "bg-amber-900/20 text-amber-400 border-amber-500/30"
                          : isFranchise
                            ? "bg-teal-900/20 text-teal-400 border-teal-500/30"
                            : "bg-emerald-900/20 text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {isAdmin && <ShieldCheck size={14} />}
                      {isFranchise && <Store size={14} />}
                      {isAdmin
                        ? "Administrator"
                        : isFranchise
                          ? `Franchise • ${user?.franchiseTier || "Standard"}`
                          : "Customer"}
                    </div>
                  </>
                ) : (
                  <p className="mt-5 text-xs font-bold uppercase tracking-widest text-emerald-400/80 bg-emerald-900/20 px-4 py-1.5 rounded-full border border-emerald-900/50">
                    Editing Mode
                  </p>
                )}
              </div>

              {feedback.error && (
                <div className="mt-6 rounded-xl border border-red-900/50 bg-red-950/40 p-3 text-center text-xs font-medium text-red-400 shadow-inner">
                  {feedback.error}
                </div>
              )}
              {feedback.success && (
                <div className="mt-6 rounded-xl border border-emerald-900/50 bg-emerald-950/40 p-3 text-center text-xs font-medium text-emerald-400 shadow-inner">
                  {feedback.success}
                </div>
              )}

              <hr className="my-8 border-emerald-900/30" />

              {!isEditing ? (
                <div className="space-y-5 text-sm text-[#F5F2EB]/80 bg-[#080D0A] p-5 rounded-2xl border border-emerald-900/40">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#121E1A] p-2 rounded-lg border border-emerald-900/50 text-emerald-400">
                      <Mail size={16} />
                    </div>
                    <span className="truncate">
                      {user?.email || "No email provided"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-[#121E1A] p-2 rounded-lg border border-emerald-900/50 text-emerald-400">
                      <Phone size={16} />
                    </div>
                    <span>{user?.phone || "No phone added"}</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-5">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/70 block mb-1.5 ml-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400/50"
                      />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-emerald-500 shadow-inner"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/70 block mb-1.5 ml-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400/50"
                      />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-emerald-500 shadow-inner"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/70 block mb-1.5 ml-1">
                      Email (Read Only)
                    </label>
                    <div className="relative opacity-60">
                      <Mail
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400/50"
                      />
                      <input
                        type="email"
                        disabled
                        value={user?.email || ""}
                        className="w-full cursor-not-allowed rounded-xl border border-emerald-900/30 bg-[#080D0A] py-3 pl-11 pr-4 text-sm text-[#F5F2EB]/60 outline-none"
                      />
                    </div>
                  </div>
                  <div className="mt-8 flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-xs font-bold text-white transition hover:bg-emerald-500 disabled:opacity-60 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                      {saving ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Check size={16} />
                      )}
                      <span>
                        {saving ? "Saving Changes..." : "Save Changes"}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex items-center justify-center rounded-xl border border-emerald-500/30 bg-[#080D0A] px-4 py-3.5 text-emerald-400 transition hover:bg-emerald-900/40"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN CONTENT */}
          <div className="w-full flex-1">
            {isAdmin ? (
              // 🛡️ ADMIN CONTROLS
              <div className="rounded-[2rem] sm:rounded-[2.5rem] border border-emerald-900/30 bg-[#121E1A] p-5 sm:p-8 md:p-10 h-full shadow-lg">
                <div className="mb-6 sm:mb-8 flex items-center justify-between border-b border-emerald-900/30 pb-4 sm:pb-6">
                  <h3 className="font-serif text-xl sm:text-2xl text-white font-bold">
                    Admin Controls
                  </h3>
                  <Link
                    to="/admin"
                    className="group flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#080D0A] border border-emerald-900/50 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400 transition hover:bg-emerald-900/30"
                  >
                    <span className="hidden sm:inline">Dashboard</span>
                    <span className="sm:hidden">Dashboard</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-5">
                  <Link
                    to="/admin/products"
                    className="group rounded-2xl sm:rounded-[1.5rem] bg-gradient-to-br from-[#080D0A] to-[#0B1310] border border-emerald-900/40 p-4 sm:p-6 shadow-sm transition-all hover:border-emerald-500/40 hover:-translate-y-1"
                  >
                    <div className="bg-emerald-900/20 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 border border-emerald-500/20">
                      <Package className="text-emerald-400 w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h4 className="font-bold text-white text-sm sm:text-lg">
                      Products
                    </h4>
                    <p className="mt-1.5 text-[9px] sm:text-xs leading-relaxed text-[#F5F2EB]/50 line-clamp-2 sm:line-clamp-none">
                      Manage your inventory, update pricing, and launch new
                      products.
                    </p>
                  </Link>
                  <Link
                    to="/admin/orders"
                    className="group rounded-2xl sm:rounded-[1.5rem] bg-gradient-to-br from-[#080D0A] to-[#0B1310] border border-emerald-900/40 p-4 sm:p-6 shadow-sm transition-all hover:border-emerald-500/40 hover:-translate-y-1"
                  >
                    <div className="bg-emerald-900/20 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 border border-emerald-500/20">
                      <ShoppingBag className="text-emerald-400 w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h4 className="font-bold text-white text-sm sm:text-lg">
                      Orders
                    </h4>
                    <p className="mt-1.5 text-[9px] sm:text-xs leading-relaxed text-[#F5F2EB]/50 line-clamp-2 sm:line-clamp-none">
                      Track customer orders, manage shipping, and process
                      payments.
                    </p>
                  </Link>
                  <Link
                    to="/admin/enquiries"
                    className="group rounded-2xl sm:rounded-[1.5rem] bg-gradient-to-br from-[#080D0A] to-[#0B1310] border border-emerald-900/40 p-4 sm:p-6 shadow-sm transition-all hover:border-emerald-500/40 hover:-translate-y-1"
                  >
                    <div className="bg-emerald-900/20 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 border border-emerald-500/20">
                      <MessageSquare className="text-emerald-400 w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h4 className="font-bold text-white text-sm sm:text-lg">
                      Enquiries
                    </h4>
                    <p className="mt-1.5 text-[9px] sm:text-xs leading-relaxed text-[#F5F2EB]/50 line-clamp-2 sm:line-clamp-none">
                      Respond to franchise applications and bulk B2B quotes.
                    </p>
                  </Link>
                  <Link
                    to="/admin"
                    className="group rounded-2xl sm:rounded-[1.5rem] bg-emerald-900/20 border border-emerald-500/30 p-4 sm:p-6 shadow-sm transition-all hover:bg-emerald-900/40 hover:-translate-y-1"
                  >
                    <div className="bg-[#080D0A] w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 border border-emerald-500/30">
                      <LayoutDashboard className="text-emerald-400 w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h4 className="font-bold text-white text-sm sm:text-lg">
                      Analytics
                    </h4>
                    <p className="mt-1.5 text-[9px] sm:text-xs leading-relaxed text-[#F5F2EB]/70 line-clamp-2 sm:line-clamp-none">
                      View overall revenue, active users, and system metrics.
                    </p>
                  </Link>
                </div>
              </div>
            ) : isFranchise ? (
              // 🌟 FIX 3: FRANCHISE CONTROLS
              <div className="rounded-[2rem] sm:rounded-[2.5rem] border border-emerald-900/30 bg-[#121E1A] p-5 sm:p-8 md:p-10 h-full shadow-lg">
                <div className="mb-6 sm:mb-8 flex items-center justify-between border-b border-emerald-900/30 pb-4 sm:pb-6">
                  <h3 className="font-serif text-xl sm:text-2xl text-white font-bold">
                    Franchise Controls
                  </h3>
                  <Link
                    to="/franchise-portal"
                    className="group flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#080D0A] border border-emerald-900/50 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400 transition hover:bg-emerald-900/30"
                  >
                    <span className="hidden sm:inline">Dashboard</span>
                    <span className="sm:hidden">Dashboard</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-5">
                  <Link
                    to="/franchise-portal/shop"
                    className="group rounded-2xl sm:rounded-[1.5rem] bg-gradient-to-br from-[#080D0A] to-[#0B1310] border border-emerald-900/40 p-4 sm:p-6 shadow-sm transition-all hover:border-emerald-500/40 hover:-translate-y-1"
                  >
                    <div className="bg-emerald-900/20 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 border border-emerald-500/20">
                      <ShoppingCart className="text-emerald-400 w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h4 className="font-bold text-white text-sm sm:text-lg">
                      B2B Shop
                    </h4>
                    <p className="mt-1.5 text-[9px] sm:text-xs leading-relaxed text-[#F5F2EB]/50 line-clamp-2 sm:line-clamp-none">
                      Place bulk orders with your exclusive tier pricing.
                    </p>
                  </Link>
                  <Link
                    to="/franchise-portal/orders"
                    className="group rounded-2xl sm:rounded-[1.5rem] bg-gradient-to-br from-[#080D0A] to-[#0B1310] border border-emerald-900/40 p-4 sm:p-6 shadow-sm transition-all hover:border-emerald-500/40 hover:-translate-y-1"
                  >
                    <div className="bg-emerald-900/20 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 border border-emerald-500/20">
                      <Package className="text-emerald-400 w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h4 className="font-bold text-white text-sm sm:text-lg">
                      My Orders
                    </h4>
                    <p className="mt-1.5 text-[9px] sm:text-xs leading-relaxed text-[#F5F2EB]/50 line-clamp-2 sm:line-clamp-none">
                      Track your franchise orders and download invoices.
                    </p>
                  </Link>
                  <Link
                    to="/franchise-portal/royalties"
                    className="group rounded-2xl sm:rounded-[1.5rem] bg-gradient-to-br from-[#080D0A] to-[#0B1310] border border-emerald-900/40 p-4 sm:p-6 shadow-sm transition-all hover:border-emerald-500/40 hover:-translate-y-1"
                  >
                    <div className="bg-emerald-900/20 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 border border-emerald-500/20">
                      <Wallet className="text-emerald-400 w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h4 className="font-bold text-white text-sm sm:text-lg">
                      Royalties
                    </h4>
                    <p className="mt-1.5 text-[9px] sm:text-xs leading-relaxed text-[#F5F2EB]/50 line-clamp-2 sm:line-clamp-none">
                      Track your earnings and pending payouts from your
                      business.
                    </p>
                  </Link>
                  <Link
                    to="/franchise-portal"
                    className="group rounded-2xl sm:rounded-[1.5rem] bg-emerald-900/20 border border-emerald-500/30 p-4 sm:p-6 shadow-sm transition-all hover:bg-emerald-900/40 hover:-translate-y-1"
                  >
                    <div className="bg-[#080D0A] w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 border border-emerald-500/30">
                      <LayoutDashboard className="text-emerald-400 w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h4 className="font-bold text-white text-sm sm:text-lg">
                      Dashboard
                    </h4>
                    <p className="mt-1.5 text-[9px] sm:text-xs leading-relaxed text-[#F5F2EB]/70 line-clamp-2 sm:line-clamp-none">
                      View your business overview and tier progress.
                    </p>
                  </Link>
                </div>
              </div>
            ) : (
              // 🛒 CUSTOMER RECENT ORDERS
              <div className="rounded-[2.5rem] border border-emerald-900/30 bg-[#121E1A] p-8 md:p-10 h-full shadow-lg">
                <div className="mb-8 flex items-center justify-between border-b border-emerald-900/30 pb-6">
                  <h3 className="font-serif text-2xl text-white font-bold">
                    Recent Orders
                  </h3>
                  <Link
                    to="/orders"
                    className="group flex items-center gap-2 rounded-full bg-[#080D0A] border border-emerald-900/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-400 transition hover:bg-emerald-900/30"
                  >
                    View History{" "}
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>

                {loadingOrders ? (
                  <div className="flex justify-center py-16 text-emerald-400">
                    <Loader2 size={36} className="animate-spin" />
                  </div>
                ) : recentOrders.length > 0 ? (
                  <div className="space-y-5">
                    {recentOrders.map((order) => (
                      <div
                        key={order._id}
                        className="group flex flex-col justify-between gap-5 rounded-[1.5rem] bg-[#080D0A] border border-emerald-900/40 p-6 shadow-sm transition-all hover:border-emerald-500/40 hover:shadow-md sm:flex-row sm:items-center"
                      >
                        <div className="flex items-center gap-5">
                          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#121E1A] text-emerald-400 border border-emerald-900/50 group-hover:border-emerald-500/30 transition-colors">
                            <ShoppingBag size={24} />
                          </div>
                          <div>
                            <p className="font-bold text-white text-lg tracking-wide uppercase">
                              #{order._id.substring(order._id.length - 6)}
                            </p>
                            <p className="text-xs text-[#F5F2EB]/50 mt-1 uppercase tracking-wider font-semibold">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-6 sm:justify-end border-t border-emerald-900/30 pt-4 sm:border-0 sm:pt-0">
                          <div className="text-left sm:text-right">
                            <p className="font-serif font-bold text-xl text-emerald-300">
                              ₹
                              {(
                                order.totalPrice ||
                                order.total ||
                                0
                              ).toLocaleString("en-IN")}
                            </p>
                            <div className="flex items-center sm:justify-end gap-1.5 mt-1.5">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${order.orderStatus === "Delivered" ? "bg-emerald-900/30 text-emerald-400 border-emerald-500/20" : "bg-amber-900/20 text-amber-400 border-amber-500/20"}`}
                              >
                                {order.orderStatus === "Delivered" ? (
                                  <Check size={10} />
                                ) : (
                                  <Clock size={10} />
                                )}
                                {order.orderStatus || "Processing"}
                              </span>
                            </div>
                          </div>
                          <Link
                            to={`/order-success/${order._id}`}
                            className="rounded-xl bg-emerald-900/20 border border-emerald-500/30 px-5 py-2.5 text-xs font-bold text-emerald-400 transition hover:bg-emerald-600 hover:text-white hover:border-emerald-500"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-[2rem] bg-[#080D0A] border border-dashed border-emerald-900/50 py-16 text-center">
                    <div className="bg-[#121E1A] p-4 rounded-full border border-emerald-900/50 mb-5">
                      <ShoppingBag size={32} className="text-emerald-500/40" />
                    </div>
                    <p className="font-serif text-xl font-bold text-white">
                      No orders yet
                    </p>
                    <p className="mt-2 text-sm text-[#F5F2EB]/50 max-w-xs">
                      Your recent purchases and Ayurvedic wellness history will
                      appear here.
                    </p>
                    <Link
                      to="/products"
                      className="mt-8 rounded-full bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                      Explore Products
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
