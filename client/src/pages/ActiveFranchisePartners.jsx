import { useEffect, useState } from "react";
import api from "../services/api";

export default function ActiveFranchisePartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users and filter only franchise role
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const { data } = await api.get("/users/admin/users");
        const franchiseOnly = data.filter((u) => u.role === "franchise");
        setPartners(franchiseOnly);
      } catch (err) {
        console.error("Error fetching franchise partners:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  // Handle Tier Update
  const handleTierChange = async (userId, newTier) => {
    try {
      await api.patch(`/users/admin/users/${userId}/tier`, {
        franchiseTier: newTier,
      });
      setPartners(
        partners.map((p) =>
          p._id === userId ? { ...p, franchiseTier: newTier } : p,
        ),
      );
    } catch (err) {
      console.error("Failed to update tier:", err);
    }
  };

  // Handle Custom Rate Update
  const handleCustomRateChange = async (userId, rate) => {
    try {
      await api.patch(`/users/admin/users/${userId}/tier`, {
        customRoyaltyRate: rate,
      });
      setPartners(
        partners.map((p) =>
          p._id === userId
            ? { ...p, customRoyaltyRate: rate === "" ? null : Number(rate) }
            : p,
        ),
      );
    } catch (err) {
      console.error("Failed to update custom rate:", err);
    }
  };

  if (loading) {
    return <div className="p-6 text-emerald-400">Loading partners...</div>;
  }

  return (
    <div className="p-6 bg-[#080D0A] min-h-screen text-[#F5F2EB]">
      <h2 className="font-serif text-2xl font-bold mb-6 text-white">
        Active Franchise Partners
      </h2>

      <div className="overflow-x-auto rounded-2xl border border-emerald-900/40 bg-[#121E1A]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-emerald-900/40 text-emerald-400 text-xs uppercase tracking-wider">
              <th className="p-4">Partner Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Franchise Tier</th>
              <th className="p-4">Custom Rate (%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-900/20 text-sm">
            {partners.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-stone-500">
                  No active franchise partners found.
                </td>
              </tr>
            ) : (
              partners.map((partner) => (
                <tr
                  key={partner._id}
                  className="hover:bg-emerald-950/20 transition-colors"
                >
                  <td className="p-4 font-bold text-white">{partner.name}</td>
                  <td className="p-4 text-[#F5F2EB]/60">{partner.email}</td>
                  <td className="p-4">
                    <select
                      value={partner.franchiseTier || "standard"}
                      onChange={(e) =>
                        handleTierChange(partner._id, e.target.value)
                      }
                      className="bg-[#080D0A] border border-emerald-900/50 text-emerald-400 text-xs rounded-xl px-3 py-2 outline-none"
                    >
                      <option value="standard">Standard (5%)</option>
                      <option value="gold">Gold (4%)</option>
                      <option value="platinum">Platinum (3%)</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      placeholder="Default"
                      defaultValue={partner.customRoyaltyRate ?? ""}
                      onBlur={(e) =>
                        handleCustomRateChange(partner._id, e.target.value)
                      }
                      className="w-24 bg-[#080D0A] border border-emerald-900/50 text-emerald-400 text-xs rounded-xl px-3 py-2 outline-none"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
