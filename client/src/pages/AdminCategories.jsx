import { useEffect, useState } from "react";
import { Plus, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import imageCompression from "browser-image-compression";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../services/categoryService";
import { uploadProductImage } from "../services/uploadService";
import { CategorySkeleton } from "../components/Skeletons";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ name: "", description: "", image: "" });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1080,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const data = await uploadProductImage(compressedFile);
      setForm({ ...form, image: data.url });
    } catch (err) {
      console.error(err);
      setError("Image upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) {
      setError("Please upload an image for the category.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await createCategory(form);
      setForm({ name: "", description: "", image: "" });
      fetchCategories();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await deleteCategory(id);
      setCategories(categories.filter((cat) => cat._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete category.");
    }
  };

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-12 bg-[#080D0A] text-[#F5F2EB]">
      <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-[350px_1fr] items-start">
        {/* Left Side: Add Category Form */}
        <aside className="sticky top-24 rounded-[2rem] border border-emerald-900/30 bg-[#121E1A] p-6 md:p-8 shadow-lg">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-400/80">
            New Category
          </span>
          <h2 className="font-serif text-2xl text-white mt-1 mb-6">
            Add Category
          </h2>

          {error && (
            <div className="mb-4 rounded-xl bg-red-950/40 border border-red-900/50 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-emerald-400/70">
                Category Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. Shilajits"
                className="mt-1 w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] px-4 py-2.5 outline-none text-sm text-white placeholder-[#F5F2EB]/20 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-emerald-400/70">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="2"
                className="mt-1 w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] px-4 py-2.5 outline-none text-sm text-white placeholder-[#F5F2EB]/20 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-emerald-400/70">
                Category Image
              </label>
              {form.image ? (
                <div className="mt-2 relative rounded-xl overflow-hidden border border-emerald-900/40 aspect-video bg-[#080D0A]">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: "" })}
                    className="absolute top-2 right-2 bg-red-950/80 rounded-full p-1.5 shadow backdrop-blur-sm border border-red-900/50 hover:bg-red-600 transition-colors"
                  >
                    <Trash2
                      size={14}
                      className="text-red-300 hover:text-white"
                    />
                  </button>
                </div>
              ) : (
                <label className="mt-2 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-900/50 bg-[#080D0A] py-6 cursor-pointer hover:bg-emerald-900/20 transition">
                  {uploading ? (
                    <Loader2
                      className="animate-spin text-emerald-400"
                      size={24}
                    />
                  ) : (
                    <ImageIcon className="text-emerald-500/40" size={24} />
                  )}
                  <span className="text-xs font-semibold text-emerald-400">
                    {uploading ? "Uploading..." : "Click to upload image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={saving || uploading}
              className="btn-primary w-full py-3 mt-4 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Create Category"}
            </button>
          </form>
        </aside>

        {/* Right Side: Category List */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <h1 className="font-serif text-3xl text-white">All Categories</h1>
            <p className="text-sm text-[#F5F2EB]/50 font-medium">
              {categories.length} Total
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {loading ? (
              <CategorySkeleton count={4} />
            ) : (
              categories.map((category) => (
                <div
                  key={category._id}
                  className="group relative overflow-hidden rounded-2xl bg-[#121E1A] border border-emerald-900/30 p-2 shadow-sm transition hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:border-emerald-500/30"
                >
                  <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-[#080D0A] border border-emerald-900/20 mb-3 relative">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="absolute top-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-red-950/80 text-red-400 shadow backdrop-blur border border-red-900/50 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="px-2 pb-2">
                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-xs text-[#F5F2EB]/50 mt-0.5 line-clamp-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
