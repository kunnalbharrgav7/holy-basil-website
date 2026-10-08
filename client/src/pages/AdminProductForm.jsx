import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";
import {
  createProduct,
  getAdminProducts,
  updateProduct,
} from "../services/productService";
import { uploadProductImage } from "../services/uploadService";

const emptyProduct = {
  name: "",
  slug: "",
  category: "",
  description: "",
  price: "",
  compareAtPrice: "",
  wholesalePrice: "",
  inventory: "",
  images: "",
  ingredients: "",
  usage: "",
  featured: false,
  isBestSeller: false,
  published: true,
  seoTitle: "",
  seoDescription: "",
};

export default function AdminProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);
  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!editing) {
      setForm(emptyProduct);
      setLoading(false);
      return;
    }
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const products = await getAdminProducts();
        const product = products.find((item) => item._id === id);
        if (!product) {
          setError("Product not found.");
          return;
        }
        setForm({
          name: product.name || "",
          slug: product.slug || "",
          category: product.category || "",
          description: product.description || "",
          price: product.price ?? "",
          compareAtPrice: product.compareAtPrice ?? "",
          wholesalePrice: product.wholesalePrice ?? "",
          inventory: product.inventory ?? "",
          images: (product.images || []).join("\n"),
          ingredients: (product.ingredients || []).join("\n"),
          usage: product.usage || "",
          featured: Boolean(product.featured),
          isBestSeller: Boolean(product.isBestSeller),
          published: product.published !== false,
          seoTitle: product.seo?.title || "",
          seoDescription: product.seo?.description || "",
        });
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [editing, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      const productData = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice
          ? Number(form.compareAtPrice)
          : undefined,
        wholesalePrice: form.wholesalePrice
          ? Number(form.wholesalePrice)
          : undefined,
        inventory: Number(form.inventory || 0),
        images: form.images
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        ingredients: form.ingredients
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        usage: form.usage.trim(),
        featured: form.featured,
        isBestSeller: form.isBestSeller,
        published: form.published,
        seo: {
          title: form.seoTitle.trim(),
          description: form.seoDescription.trim(),
        },
      };
      if (editing) {
        await updateProduct(id, productData);
      } else {
        await createProduct(productData);
      }
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
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
      setForm((current) => ({
        ...current,
        images: current.images ? `${current.images}\n${data.url}` : data.url,
      }));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (loading)
    return (
      <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-12 bg-[#080D0A]">
        <div className="container-hba">
          <div className="rounded-[2rem] border border-emerald-900/30 bg-[#121E1A] p-10 text-center">
            <p className="text-[#F5F2EB]/50">Loading product...</p>
          </div>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-12 bg-[#080D0A] text-[#F5F2EB]">
      <div className="container-hba max-w-4xl mx-auto">
        <div>
          <span className="eyebrow text-emerald-400/80">
            Product management
          </span>
          <h1 className="mt-4 text-4xl font-bold text-white font-serif">
            {editing ? "Edit product" : "Add product"}
          </h1>
          <p className="mt-4 max-w-2xl text-[#F5F2EB]/60">
            {editing
              ? "Update the details of your Holy Basil Ayurveda product."
              : "Add a new product to your Holy Basil Ayurveda catalogue."}
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-900/50 bg-red-950/40 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-[2rem] border border-emerald-900/30 bg-[#121E1A] p-6 md:p-8 shadow-lg"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-bold text-emerald-400/80">
                Product name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-emerald-400/80">
                Slug
              </label>
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="example-product"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-emerald-400/80">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-colors appearance-none"
              >
                <option value="" disabled className="bg-[#121E1A]">
                  Select a category
                </option>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option
                      key={cat._id}
                      value={cat.name}
                      className="bg-[#121E1A]"
                    >
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Loading categories...
                  </option>
                )}
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-emerald-400/80">
                Price
              </label>
              <input
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-emerald-400/80">
                Compare-at price
              </label>
              <input
                name="compareAtPrice"
                type="number"
                min="0"
                value={form.compareAtPrice}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-amber-500/80">
                Wholesale Price (B2B)
              </label>
              <input
                name="wholesalePrice"
                type="number"
                min="0"
                value={form.wholesalePrice}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-amber-900/40 bg-[#080D0A] px-4 py-3 text-amber-100 outline-none focus:border-amber-500/50 transition-colors placeholder:text-amber-900/40"
                placeholder="Optional Franchise Rate"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-emerald-400/80">
                Inventory
              </label>
              <input
                name="inventory"
                type="number"
                min="0"
                value={form.inventory}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-bold text-emerald-400/80">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="mt-2 w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          <div className="mt-6">
            <label className="text-sm font-bold text-emerald-400/80">
              Product images
            </label>
            <div className="mt-3 flex flex-col gap-4 rounded-2xl border border-dashed border-emerald-900/50 bg-[#080D0A] p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-bold text-emerald-400">
                  Upload product image
                </p>
                <p className="mt-1 text-xs text-[#F5F2EB]/40">
                  JPG, PNG or WebP · Automatically optimized
                </p>
              </div>
              <label className="btn-outline cursor-pointer text-center">
                {uploading ? "Uploading..." : "Choose image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              name="images"
              value={form.images}
              onChange={handleChange}
              rows="3"
              placeholder="Uploaded image URLs will appear here"
              className="mt-4 w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-colors placeholder:text-[#F5F2EB]/20"
            />
            {form.images && (
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                {form.images
                  .split("\n")
                  .filter(Boolean)
                  .map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="overflow-hidden rounded-2xl border border-emerald-900/40 bg-[#080D0A]"
                    >
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="aspect-square w-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="mt-6">
            <label className="text-sm font-bold text-emerald-400/80">
              Ingredients
            </label>
            <textarea
              name="ingredients"
              value={form.ingredients}
              onChange={handleChange}
              rows="3"
              placeholder="One ingredient per line"
              className="mt-2 w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-colors placeholder:text-[#F5F2EB]/20"
            />
          </div>

          <div className="mt-6">
            <label className="text-sm font-bold text-emerald-400/80">
              Usage
            </label>
            <textarea
              name="usage"
              value={form.usage}
              onChange={handleChange}
              rows="3"
              className="mt-2 w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-bold text-emerald-400/80">
                SEO title
              </label>
              <input
                name="seoTitle"
                value={form.seoTitle}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-emerald-400/80">
                SEO description
              </label>
              <input
                name="seoDescription"
                value={form.seoDescription}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 border-t border-emerald-900/30 pt-6">
            <label className="flex items-center gap-3 text-sm font-bold cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="w-5 h-5 accent-emerald-500 rounded border-emerald-900/50 bg-[#080D0A]"
              />
              <span className="text-white">Featured</span>
            </label>
            <label className="flex items-center gap-3 text-sm font-bold cursor-pointer">
              <input
                type="checkbox"
                name="isBestSeller"
                checked={form.isBestSeller}
                onChange={handleChange}
                className="w-5 h-5 accent-emerald-500 rounded border-emerald-900/50 bg-[#080D0A]"
              />
              <span className="text-white">Best Seller</span>
            </label>
            <label className="flex items-center gap-3 text-sm font-bold cursor-pointer">
              <input
                type="checkbox"
                name="published"
                checked={form.published}
                onChange={handleChange}
                className="w-5 h-5 accent-emerald-500 rounded border-emerald-900/50 bg-[#080D0A]"
              />
              <span className="text-white">Published</span>
            </label>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full sm:w-auto px-8"
            >
              {saving
                ? "Saving..."
                : editing
                  ? "Update product"
                  : "Create product"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="btn-outline w-full sm:w-auto px-8 border-red-900/50 text-red-400 hover:bg-red-900 hover:text-white hover:border-red-900"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
