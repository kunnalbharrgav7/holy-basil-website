import { useState, useEffect } from "react";
import { Trash2, Plus, Power, Ticket } from "lucide-react";
import api from "../services/api"; // Path check kar lijiyega
import toast from "react-hot-toast";
import { TableSkeleton } from "../components/Skeletons";

export default function ManageCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    expiryDate: "",
    applicableProducts: [],
  });

  // Fetch all coupons
  const fetchCoupons = async () => {
    try {
      setFetching(true);
      const { data } = await api.get("/coupons/all");
      setCoupons(data.coupons);
    } catch (error) {
      toast.error("Failed to load coupons");
    } finally {
      setFetching(false);
    }
  };

  // 👇 Add Product fetch inside useEffect 👇
  useEffect(() => {
    fetchCoupons();
    // Fetch products to show in dropdown/list
    api
      .get("/products")
      .then((res) => {
        // Adjust path if your products API gives data in a different structure
        setProducts(res.data.products || res.data || []);
      })
      .catch(() => toast.error("Failed to load products"));
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create Coupon
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Yahan URL update kiya
      await api.post("/coupons/create", formData);
      toast.success("Coupon created successfully!");
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minOrderAmount: "",
        expiryDate: "",
        applicableProducts: [],
      });
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  // Toggle Status
  const toggleStatus = async (id) => {
    try {
      // Yahan URL update kiya
      const { data } = await api.put(`/coupons/toggle/${id}`);
      toast.success(data.message);
      fetchCoupons();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // Delete Coupon
  const deleteCoupon = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      // Yahan URL update kiya
      await api.delete(`/coupons/${id}`);
      toast.success("Coupon deleted!");
      fetchCoupons();
    } catch (error) {
      toast.error("Failed to delete coupon");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto bg-[#080D0A] min-h-screen text-[#F5F2EB]">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-emerald-900/40 p-3 rounded-xl border border-emerald-500/20">
          <Ticket className="text-emerald-400" size={24} />
        </div>
        <h1 className="font-serif text-3xl text-white">Manage Coupons</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* CREATE COUPON FORM */}
        <div className="lg:col-span-1 bg-[#121E1A] p-6 rounded-3xl border border-emerald-900/30 h-fit">
          <h2 className="text-lg font-serif text-white mb-6">
            Create New Coupon
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#F5F2EB]/60 block mb-2">
                Coupon Code
              </label>
              <input
                type="text"
                name="code"
                required
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
                placeholder="e.g. WELCOME20"
                className="w-full bg-[#080D0A] border border-emerald-900/40 rounded-xl px-4 py-2.5 text-xs text-white uppercase focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#F5F2EB]/60 block mb-2">
                  Discount Type
                </label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  className="w-full bg-[#080D0A] border border-emerald-900/40 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#F5F2EB]/60 block mb-2">
                  Value
                </label>
                <input
                  type="number"
                  name="discountValue"
                  required
                  value={formData.discountValue}
                  onChange={handleChange}
                  placeholder="e.g. 20"
                  className="w-full bg-[#080D0A] border border-emerald-900/40 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#F5F2EB]/60 block mb-2">
                Min Order Amount (₹)
              </label>
              <input
                type="number"
                name="minOrderAmount"
                value={formData.minOrderAmount}
                onChange={handleChange}
                placeholder="e.g. 1000 (0 for no limit)"
                className="w-full bg-[#080D0A] border border-emerald-900/40 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#F5F2EB]/60 block mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                name="expiryDate"
                required
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full bg-[#080D0A] border border-emerald-900/40 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#F5F2EB]/60 block mb-2">
                Applicable Products (Optional)
              </label>
              <div className="max-h-40 overflow-y-auto border border-emerald-900/40 rounded-xl p-3 bg-[#080D0A] space-y-2 custom-scrollbar">
                <label className="flex items-center gap-3 text-xs text-[#F5F2EB]/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.applicableProducts.length === 0}
                    onChange={() =>
                      setFormData({ ...formData, applicableProducts: [] })
                    }
                    className="w-4 h-4 accent-emerald-500 rounded bg-[#121E1A] border-emerald-900/50"
                  />
                  Apply to ALL Products
                </label>
                <div className="border-t border-emerald-900/30 my-2"></div>
                {products.map((p) => (
                  <label
                    key={p._id}
                    className="flex items-center gap-3 text-xs text-white cursor-pointer hover:text-emerald-400 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.applicableProducts.includes(p._id)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        if (isChecked) {
                          setFormData({
                            ...formData,
                            applicableProducts: [
                              ...formData.applicableProducts,
                              p._id,
                            ],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            applicableProducts:
                              formData.applicableProducts.filter(
                                (id) => id !== p._id,
                              ),
                          });
                        }
                      }}
                      className="w-4 h-4 accent-emerald-500 rounded bg-[#121E1A] border-emerald-900/50"
                    />
                    {p.name}
                  </label>
                ))}
              </div>
              <p className="text-[9px] text-[#F5F2EB]/40 mt-1.5 italic">
                Select specific products, or leave "Apply to ALL" checked.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Plus size={16} /> {loading ? "Creating..." : "Create Coupon"}
            </button>
          </form>
        </div>

        {/* COUPONS LIST */}
        <div className="lg:col-span-2 bg-[#121E1A] p-6 rounded-3xl border border-emerald-900/30">
          <h2 className="text-lg font-serif text-white mb-6">
            Active & Past Coupons
          </h2>
          {fetching ? (
            <TableSkeleton rows={4} columns={6} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-emerald-900/30 text-[10px] uppercase tracking-widest text-[#F5F2EB]/50">
                    <th className="pb-3 font-bold pl-2">Code</th>
                    <th className="pb-3 font-bold">Discount</th>
                    <th className="pb-3 font-bold">Min Order</th>
                    <th className="pb-3 font-bold">Expiry</th>
                    <th className="pb-3 font-bold">Status</th>
                    <th className="pb-3 font-bold text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b border-emerald-900/20 last:border-0 hover:bg-[#080D0A]/50 transition-colors"
                  >
                    <td className="py-4 pl-2 font-bold text-emerald-400">
                      {c.code}
                    </td>
                    <td className="py-4">
                      {c.discountType === "percentage"
                        ? `${c.discountValue}%`
                        : `₹${c.discountValue}`}
                    </td>
                    <td className="py-4">₹{c.minOrderAmount}</td>
                    <td className="py-4 text-[#F5F2EB]/70">
                      {new Date(c.expiryDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${c.isActive ? "bg-emerald-900/40 text-emerald-400" : "bg-red-900/40 text-red-400"}`}
                      >
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-2">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => toggleStatus(c._id)}
                          className={`p-1.5 rounded-lg transition-colors ${c.isActive ? "bg-amber-900/30 text-amber-500 hover:bg-amber-500 hover:text-white" : "bg-emerald-900/30 text-emerald-500 hover:bg-emerald-500 hover:text-white"}`}
                          title={c.isActive ? "Deactivate" : "Activate"}
                        >
                          <Power size={16} />
                        </button>
                        <button
                          onClick={() => deleteCoupon(c._id)}
                          className="p-1.5 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {coupons.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-8 text-center text-xs text-[#F5F2EB]/40 italic"
                    >
                      No coupons found. Create one to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
