import { useEffect, useState } from "react";
import { RefreshCw, Store, CheckCircle, XCircle } from "lucide-react";
import {
  getAdminFranchiseRequests,
  updateFranchiseStatus,
} from "../services/franchiseService";

export default function AdminFranchise() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState("All");

  // 🌟 NAYA: Har application ke liye selected tier store karne ke liye state
  const [selectedTiers, setSelectedTiers] = useState({});

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminFranchiseRequests();
      setRequests(data || []);
    } catch (err) {
      setError("Unable to load franchise requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setActionLoading(id);
      const tierToAssign = selectedTiers[id] || "standard"; // Default to standard if not selected

      // 🌟 Pass franchiseTier when approving
      await updateFranchiseStatus(
        id,
        newStatus,
        newStatus === "Approved" ? tierToAssign : undefined,
      );

      setRequests((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item,
        ),
      );
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredRequests =
    filter === "All"
      ? requests
      : requests.filter((item) => item.status === filter);

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 bg-[#080D0A] text-[#F5F2EB]">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-emerald-900/30 pb-4 sm:pb-6">
          <div>
            <span className="eyebrow text-emerald-400 text-[10px] sm:text-xs">
              Partnership Management
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-white mt-1">
              Franchise Enquiries
            </h1>
            <p className="text-xs sm:text-sm text-[#F5F2EB]/60 mt-1 sm:mt-1.5">
              Review partner applications and update pipeline statuses.
            </p>
          </div>
          <button
            onClick={loadRequests}
            disabled={loading}
            className="btn-outline w-full sm:w-auto justify-center py-2.5 px-5 text-[11px] sm:text-xs inline-flex items-center gap-2 shrink-0"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />{" "}
            Refresh Data
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="w-full overflow-x-auto pb-4 custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="inline-flex items-center gap-1.5 bg-[#121E1A] p-1.5 sm:p-2 rounded-2xl border border-emerald-900/30 min-w-min">
            {["All", "Pending", "Approved", "Rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition flex-shrink-0 ${
                  filter === tab
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-[#F5F2EB]/60 hover:text-white hover:bg-[#16231D]"
                }`}
              >
                {tab} (
                {tab === "All"
                  ? requests.length
                  : requests.filter((r) => r.status === tab).length}
                )
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-900/50 bg-red-950/40 p-4 text-xs sm:text-sm text-red-400">
            {error}
          </div>
        )}

        {/* List Container */}
        <div className="overflow-hidden rounded-2xl sm:rounded-[2.5rem] border border-emerald-900/30 bg-[#121E1A] shadow-lg">
          {loading ? (
            <p className="p-12 text-center text-xs sm:text-sm text-[#F5F2EB]/50">
              Loading requests...
            </p>
          ) : filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-900/20 text-emerald-500/50">
                <Store size={20} />
              </div>
              <p className="mt-4 text-lg font-bold text-white font-serif">
                No enquiries found
              </p>
              <p className="mt-1.5 text-xs text-[#F5F2EB]/50">
                Currently 0 results for "{filter}".
              </p>
            </div>
          ) : (
            <div className="divide-y divide-emerald-900/30">
              {filteredRequests.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col gap-4 p-5 sm:p-6 transition hover:bg-[#16231D] md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h4 className="font-serif text-lg sm:text-xl font-bold text-white">
                        {item.name}
                      </h4>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold border tracking-wider uppercase ${
                          item.status === "Approved"
                            ? "bg-emerald-900/40 text-emerald-400 border-emerald-500/20"
                            : item.status === "Rejected"
                              ? "bg-red-950/40 text-red-400 border-red-900/50"
                              : "bg-amber-900/40 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="text-[11px] sm:text-sm text-[#F5F2EB]/60">
                      {item.email}{" "}
                      <span className="hidden sm:inline mx-1.5 opacity-50">
                        •
                      </span>
                      <br className="sm:hidden" />
                      <span className="sm:inline-block mt-0.5 sm:mt-0">
                        {item.phone}
                      </span>
                    </p>

                    <div className="mt-3 space-y-1">
                      <p className="text-[10px] sm:text-xs text-[#F5F2EB]/40 font-medium">
                        Location:{" "}
                        <span className="text-emerald-300 ml-0.5">
                          {item.city}, {item.state}
                        </span>
                      </p>
                      <p className="text-[10px] sm:text-xs text-[#F5F2EB]/40 font-medium">
                        Budget:{" "}
                        <span className="text-emerald-300 ml-0.5">
                          {item.budget}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons & Tier Dropdown */}
                  <div className="flex flex-wrap items-center gap-3 pt-4 mt-1 border-t border-emerald-900/20 md:border-0 md:pt-0 md:mt-0">
                    {item.status !== "Approved" && (
                      <div className="flex items-center gap-2">
                        {/* 🌟 Tier Selection Dropdown before Approval */}
                        <select
                          value={selectedTiers[item._id] || "standard"}
                          onChange={(e) =>
                            setSelectedTiers({
                              ...selectedTiers,
                              [item._id]: e.target.value,
                            })
                          }
                          className="bg-[#080D0A] border border-emerald-900/50 text-emerald-400 text-xs rounded-xl px-3 py-2.5 outline-none"
                        >
                          <option value="standard">Standard (5%)</option>
                          <option value="gold">Gold (4%)</option>
                          <option value="platinum">Platinum (3%)</option>
                        </select>

                        <button
                          onClick={() =>
                            handleStatusUpdate(item._id, "Approved")
                          }
                          disabled={actionLoading === item._id}
                          className="inline-flex justify-center items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-[11px] sm:text-xs font-bold hover:bg-emerald-500 transition-colors"
                        >
                          <CheckCircle size={14} className="sm:w-4 sm:h-4" />{" "}
                          Approve
                        </button>
                      </div>
                    )}

                    {item.status !== "Rejected" && (
                      <button
                        onClick={() => handleStatusUpdate(item._id, "Rejected")}
                        disabled={actionLoading === item._id}
                        className="inline-flex justify-center items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-950 border border-red-900 text-red-400 text-[11px] sm:text-xs font-bold hover:bg-red-900 hover:text-white transition-colors"
                      >
                        <XCircle size={14} className="sm:w-4 sm:h-4" /> Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
