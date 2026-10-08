import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import {
  User,
  Mail,
  Phone,
  Store,
  Award,
  Check,
  X,
  Loader2,
  Camera,
  Trash2,
  Edit2,
  MapPin,
  Map,
} from "lucide-react";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";

export default function FranchiseProfile() {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  // 👇 ADDED: storeCity, storeDistrict, and serviceablePincodes
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    avatar: "",
    storeCity: "",
    storeDistrict: "",
    serviceablePincodes: "", // Stored as a comma-separated string for editing
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
        storeCity: user.storeCity || "",
        storeDistrict: user.storeDistrict || "",
        serviceablePincodes: user.serviceablePincodes?.join(", ") || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      avatar: user?.avatar || "",
      storeCity: user?.storeCity || "",
      storeDistrict: user?.storeDistrict || "",
      serviceablePincodes: user?.serviceablePincodes?.join(", ") || "",
    });
    setIsEditing(false);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    try {
      setUploadingImage(true);
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
      toast.success("Avatar uploaded successfully!");
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({ ...prev, avatar: "" }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Convert comma-separated pincodes into a clean array
    const pincodesArray = formData.serviceablePincodes
      .split(",")
      .map((pin) => pin.trim())
      .filter(Boolean); // removes empty strings

    try {
      const response = await api.patch("/users/me", {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        avatar: formData.avatar,
        storeCity: formData.storeCity.trim(),
        storeDistrict: formData.storeDistrict.trim(),
        serviceablePincodes: pincodesArray,
      });
      updateUser(response.data);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl pb-24 animate-in fade-in duration-300 px-2 sm:px-4">
      {/* Header */}
      <div className="mb-8 border-b border-emerald-900/30 pb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400">
          Account Settings
        </span>
        <h1 className="mt-1 font-serif text-3xl font-bold text-white md:text-4xl">
          Franchise Profile & Outlet
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column: ID Card */}
        <div className="md:col-span-1">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#121E1A] to-[#0B1310] p-8 border border-emerald-900/40 shadow-xl text-center">
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full bg-[#080D0A] border border-emerald-900/50 px-3.5 py-1.5 text-xs font-bold text-emerald-400 transition hover:bg-emerald-600 hover:text-white z-10"
              >
                <Edit2 size={12} /> <span>Edit</span>
              </button>
            )}

            {/* Avatar Section */}
            <div className="relative inline-block mt-4">
              <div className="group relative grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-full bg-[#080D0A] border-2 border-emerald-500/30 text-4xl font-serif text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                {(isEditing ? formData.avatar : user?.avatar) &&
                (isEditing ? formData.avatar : user?.avatar).trim() !== "" ? (
                  <img
                    src={isEditing ? formData.avatar : user?.avatar}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-emerald-400 font-serif text-3xl font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "F"}
                  </span>
                )}

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

            <h2 className="mt-4 font-serif text-2xl font-bold text-white tracking-wide">
              {user?.name || "Franchise Partner"}
            </h2>

            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-900/30 border border-emerald-500/30 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              <Store size={14} />
              <span>Franchise • {user?.franchiseTier || "Standard"}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Edit Form */}
        <div className="md:col-span-2">
          <div className="rounded-[2.5rem] border border-emerald-900/30 bg-[#121E1A] p-8 shadow-lg">
            <h3 className="font-serif text-xl font-bold text-white mb-6 border-b border-emerald-900/30 pb-4">
              {isEditing
                ? "Edit Account Details"
                : "Personal & Account Information"}
            </h3>

            {!isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="flex items-center gap-4 rounded-2xl bg-[#080D0A] p-4 border border-emerald-900/40">
                    <div className="bg-[#121E1A] p-3 rounded-xl border border-emerald-900/50 text-emerald-400">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60">
                        Full Name
                      </p>
                      <p className="text-white font-medium text-base mt-0.5">
                        {user?.name}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-4 rounded-2xl bg-[#080D0A] p-4 border border-emerald-900/40">
                    <div className="bg-[#121E1A] p-3 rounded-xl border border-emerald-900/50 text-emerald-400">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60">
                        Phone Number
                      </p>
                      <p className="text-white font-medium text-base mt-0.5">
                        {user?.phone || "No phone added"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4 rounded-2xl bg-[#080D0A] p-4 border border-emerald-900/40">
                  <div className="bg-[#121E1A] p-3 rounded-xl border border-emerald-900/50 text-emerald-400">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60">
                      Email Address (Registered)
                    </p>
                    <p className="text-white font-medium text-base mt-0.5">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* 👇 ADDED: Delivery Geography Section for View Mode 👇 */}
                <h3 className="font-serif text-lg font-bold text-white mt-8 mb-4 border-b border-emerald-900/30 pb-2">
                  Delivery Geography
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 rounded-2xl bg-[#080D0A] p-4 border border-emerald-900/40">
                    <div className="bg-[#121E1A] p-3 rounded-xl border border-emerald-900/50 text-emerald-400">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60">
                        Store City / District
                      </p>
                      <p className="text-white font-medium text-base mt-0.5">
                        {user?.storeCity || "Not set"}
                        {user?.storeDistrict &&
                        user.storeDistrict !== user.storeCity
                          ? ` (${user.storeDistrict})`
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl bg-[#080D0A] p-4 border border-emerald-900/40">
                    <div className="bg-[#121E1A] p-3 rounded-xl border border-emerald-900/50 text-emerald-400">
                      <Map size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60">
                        Serviceable Pincodes
                      </p>
                      <p className="text-white font-medium text-sm mt-0.5 max-w-[200px] truncate">
                        {user?.serviceablePincodes?.length > 0
                          ? user.serviceablePincodes.join(", ")
                          : "No pincodes assigned"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/70 block mb-1.5 ml-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] py-3.5 px-4 text-sm text-white outline-none transition focus:border-emerald-500 shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/70 block mb-1.5 ml-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] py-3.5 px-4 text-sm text-white outline-none transition focus:border-emerald-500 shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/70 block mb-1.5 ml-1">
                    Email Address (Read Only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full cursor-not-allowed rounded-xl border border-emerald-900/30 bg-[#080D0A] py-3.5 px-4 text-sm text-[#F5F2EB]/50 outline-none"
                  />
                </div>

                {/* 👇 ADDED: Delivery Geography Section for Edit Mode 👇 */}
                <h3 className="font-serif text-lg font-bold text-white pt-4 pb-2 border-b border-emerald-900/30">
                  Fulfillment & Routing Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/70 block mb-1.5 ml-1">
                      Store City
                    </label>
                    <input
                      type="text"
                      name="storeCity"
                      placeholder="e.g. Indore"
                      value={formData.storeCity}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] py-3.5 px-4 text-sm text-white outline-none transition focus:border-emerald-500 shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/70 block mb-1.5 ml-1">
                      Store District
                    </label>
                    <input
                      type="text"
                      name="storeDistrict"
                      placeholder="e.g. Indore"
                      value={formData.storeDistrict}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] py-3.5 px-4 text-sm text-white outline-none transition focus:border-emerald-500 shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/70 block mb-1.5 ml-1">
                    Serviceable Pincodes (Tier 1 Priority)
                  </label>
                  <input
                    type="text"
                    name="serviceablePincodes"
                    placeholder="e.g. 452001, 452010, 452016"
                    value={formData.serviceablePincodes}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] py-3.5 px-4 text-sm text-white outline-none transition focus:border-emerald-500 shadow-inner"
                  />
                  <p className="text-[10px] text-[#F5F2EB]/40 mt-1.5 ml-1">
                    Separate multiple pincodes using commas. Orders from these
                    pincodes will route to you first.
                  </p>
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
                    <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center justify-center rounded-xl border border-emerald-500/30 bg-[#080D0A] px-5 py-3.5 text-emerald-400 transition hover:bg-emerald-900/40"
                  >
                    <X size={18} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
