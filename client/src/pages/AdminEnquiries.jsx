import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Building2,
  Mail,
  Phone,
  RefreshCw,
  MessageSquare,
  Save,
  User,
  Filter,
  X,
} from "lucide-react";
import { getAdminEnquiries, updateEnquiry } from "../services/enquiryService";

const ENQUIRY_STATUSES = [
  "New",
  "Contacted",
  "In Discussion",
  "Quotation Sent",
  "Approved",
  "Rejected",
  "Completed",
];

export default function AdminEnquiries() {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get("status");
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminEnquiries();
      setEnquiries(data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Unable to load enquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const filteredEnquiries = statusFilter
    ? enquiries.filter((enquiry) => enquiry.status === statusFilter)
    : enquiries;

  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");
      const updated = await updateEnquiry(id, { status });
      setEnquiries((current) =>
        current.map((enquiry) => (enquiry._id === id ? updated : enquiry)),
      );
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Unable to update enquiry.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleNotesSave = async (id, notes) => {
    try {
      setUpdatingId(id);
      setError("");
      const updated = await updateEnquiry(id, { notes });
      setEnquiries((current) =>
        current.map((enquiry) => (enquiry._id === id ? updated : enquiry)),
      );
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Unable to save notes.");
    } finally {
      setUpdatingId(null);
    }
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <main className="min-h-screen px-3 py-6 sm:px-6 lg:px-8 lg:py-12 bg-[#080D0A] text-[#F5F2EB]">
      <div className="container-hba max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-emerald-900/30 pb-4 sm:pb-6">
          <div>
            <span className="eyebrow block text-emerald-400/80 text-[10px] sm:text-xs">
              Business
            </span>
            <h1 className="mt-1 sm:mt-2 text-3xl sm:text-5xl font-bold text-white font-serif">
              Enquiries Management
            </h1>
            <p className="mt-1 sm:mt-2 text-[#F5F2EB]/60 text-xs sm:text-sm">
              Manage customer enquiries, technical requirements and follow-ups.
            </p>
          </div>
          <button
            onClick={loadEnquiries}
            disabled={loading}
            className="btn-outline w-full sm:w-auto justify-center py-2.5 px-5 text-[11px] sm:text-xs inline-flex items-center gap-2 shrink-0"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />{" "}
            Refresh Data
          </button>
        </div>

        {/* ACTIVE FILTER BANNER */}
        {statusFilter && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-emerald-900/20 border border-emerald-500/30 px-4 sm:px-5 py-3 text-xs sm:text-sm text-emerald-300">
            <div className="flex items-center gap-2">
              <Filter size={16} className="shrink-0" />
              <span>
                Showing filtered view: <strong>Status: {statusFilter}</strong> (
                {filteredEnquiries.length} results)
              </span>
            </div>
            <button
              onClick={clearFilters}
              className="inline-flex justify-center items-center gap-1 text-[10px] sm:text-xs font-bold text-white hover:text-emerald-400 bg-[#080D0A] px-3 py-1.5 sm:py-2 rounded-full border border-emerald-900/40 shrink-0"
            >
              <X size={14} /> Clear Filter
            </button>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-900/50 bg-red-950/40 px-4 py-3 sm:px-5 sm:py-4 text-xs sm:text-sm text-red-400">
            {error}
          </div>
        )}

        {/* SUMMARY CARDS - Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <SummaryCard label="Total Enquiries" value={enquiries.length} />
          <SummaryCard
            label="New Enquiries"
            value={
              enquiries.filter((enquiry) => enquiry.status === "New").length
            }
          />
          <SummaryCard
            label="In Discussion"
            value={
              enquiries.filter((enquiry) => enquiry.status === "In Discussion")
                .length
            }
          />
          <SummaryCard
            label="Completed"
            value={
              enquiries.filter((enquiry) => enquiry.status === "Completed")
                .length
            }
          />
        </div>

        {/* ENQUIRIES LIST SECTION */}
        <section>
          <div className="overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] border border-emerald-900/30 bg-[#121E1A] shadow-lg">
            {loading ? (
              <div className="p-10 sm:p-16 text-center text-xs sm:text-sm text-[#F5F2EB]/50">
                Loading enquiries pipeline...
              </div>
            ) : filteredEnquiries.length === 0 ? (
              <EmptyEnquiries />
            ) : (
              <div className="divide-y divide-emerald-900/30">
                {filteredEnquiries.map((enquiry) => (
                  <EnquiryCard
                    key={enquiry._id}
                    enquiry={enquiry}
                    updating={updatingId === enquiry._id}
                    onStatusChange={handleStatusChange}
                    onNotesSave={handleNotesSave}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function EnquiryCard({ enquiry, updating, onStatusChange, onNotesSave }) {
  const [notes, setNotes] = useState(enquiry.notes || "");
  useEffect(() => {
    setNotes(enquiry.notes || "");
  }, [enquiry.notes]);
  const isNotesChanged = notes !== (enquiry.notes || "");

  return (
    <article className="p-4 sm:p-6 md:p-8 hover:bg-[#16231D] transition-colors">
      <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="w-full">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 sm:h-12 sm:w-12 shrink-0 place-items-center rounded-xl sm:rounded-2xl bg-emerald-900/30 border border-emerald-500/20 text-emerald-400">
              {enquiry.company ? <Building2 size={18} /> : <User size={18} />}
            </div>
            <div className="min-w-0">
              <h2 className="font-bold font-serif text-white text-base sm:text-lg truncate">
                {enquiry.company || enquiry.name || "New enquiry"}
              </h2>
              {enquiry.company && enquiry.name && (
                <p className="mt-0.5 text-[11px] sm:text-xs text-[#F5F2EB]/50 truncate">
                  Contact: {enquiry.name}
                </p>
              )}
            </div>
          </div>

          <div className="mt-3 sm:mt-4 flex flex-wrap gap-3 sm:gap-4 text-xs text-[#F5F2EB]/70">
            {enquiry.email && (
              <a
                href={`mailto:${enquiry.email}`}
                className="inline-flex items-center gap-1.5 hover:text-emerald-400 transition break-all"
              >
                <Mail size={14} className="text-emerald-400 shrink-0" />{" "}
                {enquiry.email}
              </a>
            )}
            {enquiry.phone && (
              <a
                href={`tel:${enquiry.phone}`}
                className="inline-flex items-center gap-1.5 hover:text-emerald-400 transition"
              >
                <Phone size={14} className="text-emerald-400 shrink-0" />{" "}
                {enquiry.phone}
              </a>
            )}
          </div>

          <div className="mt-3 sm:mt-4">
            <Link
              to={`/admin/enquiries/${enquiry._id}`}
              className="inline-flex items-center justify-center rounded-full border border-emerald-500/30 px-4 py-1.5 text-[11px] sm:text-xs font-bold text-emerald-400 transition hover:bg-emerald-600 hover:text-white"
            >
              View details
            </Link>
          </div>
        </div>

        {/* Pipeline status dropdown */}
        <div className="flex flex-col gap-1.5 w-full lg:w-auto shrink-0 pt-2 lg:pt-0 border-t border-emerald-900/20 lg:border-0">
          <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400/60">
            Pipeline Status
          </label>
          <select
            value={enquiry.status || "New"}
            disabled={updating}
            onChange={(event) =>
              onStatusChange(enquiry._id, event.target.value)
            }
            className="w-full lg:min-w-[180px] rounded-xl sm:rounded-full border border-emerald-900/40 bg-[#080D0A] px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs font-bold text-emerald-400 outline-none focus:border-emerald-500/50 cursor-pointer"
          >
            {ENQUIRY_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Details Grid: 2 cols on mobile, 4 cols on desktop */}
      <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Detail label="Product Category" value={enquiry.productCategory} />
        <Detail label="Estimated Quantity" value={enquiry.estimatedQuantity} />
        <Detail label="Country" value={enquiry.country} />
        <Detail label="Target Market" value={enquiry.targetMarket} />
      </div>

      {/* Requirements Grid: 2 cols on mobile, 3 cols on desktop */}
      <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        <Requirement label="Private Label" value={enquiry.privateLabel} />
        <Requirement
          label="Custom Formulation"
          value={enquiry.customFormulation}
        />
        <Detail label="Packaging" value={enquiry.packagingRequirement} />
      </div>

      {enquiry.message && (
        <div className="mt-4 rounded-xl sm:rounded-2xl bg-[#080D0A] border border-emerald-900/20 p-3.5 sm:p-4">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400">
            <MessageSquare size={14} /> Client Message
          </div>
          <p className="mt-1.5 sm:mt-2 whitespace-pre-wrap text-xs sm:text-sm leading-relaxed text-[#F5F2EB]/70">
            {enquiry.message}
          </p>
        </div>
      )}

      <div className="mt-4 sm:mt-5">
        <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400/80">
          Admin Internal Notes
        </label>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows="3"
          placeholder="Add internal notes about this enquiry..."
          className="mt-1.5 sm:mt-2 w-full rounded-xl sm:rounded-2xl border border-emerald-900/40 bg-[#080D0A] px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs text-white outline-none focus:border-emerald-500/50"
        />
        <div className="mt-2.5 sm:mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-[10px] sm:text-[11px] text-[#F5F2EB]/40">
            Received: {new Date(enquiry.createdAt).toLocaleString("en-IN")}
          </p>
          {isNotesChanged && (
            <button
              type="button"
              disabled={updating}
              onClick={() => onNotesSave(enquiry._id, notes)}
              className="inline-flex justify-center items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm w-full sm:w-auto"
            >
              <Save size={14} /> {updating ? "Saving..." : "Save Notes"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-emerald-900/20 bg-[#0B1310] p-3 sm:p-4">
      <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-400/60 truncate">
        {label}
      </p>
      <p className="mt-1 text-xs sm:text-sm font-semibold text-white truncate">
        {value || "—"}
      </p>
    </div>
  );
}

function Requirement({ label, value }) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-emerald-900/20 bg-[#0B1310] p-3 sm:p-4">
      <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-400/60 truncate">
        {label}
      </p>
      <p
        className={`mt-1 text-xs sm:text-sm font-bold ${value ? "text-emerald-400" : "text-[#F5F2EB]/50"}`}
      >
        {value ? "Yes" : "No"}
      </p>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-[1.25rem] sm:rounded-[2rem] border border-emerald-900/30 bg-[#121E1A] p-4 sm:p-6 shadow-md flex flex-col justify-center">
      <p className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[#F5F2EB]/50">
        {label}
      </p>
      <p className="mt-1 sm:mt-2 text-xl sm:text-3xl font-bold font-serif text-white">
        {value}
      </p>
    </div>
  );
}

function EmptyEnquiries() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 sm:py-20 text-center">
      <div className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full bg-emerald-900/20 text-emerald-500/50">
        <MessageSquare size={22} className="sm:w-6 sm:h-6" />
      </div>
      <p className="mt-4 sm:mt-5 text-lg sm:text-xl font-bold text-white font-serif">
        No enquiries match this filter
      </p>
      <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-[#F5F2EB]/50">
        Customer enquiries will appear here once submitted.
      </p>
    </div>
  );
}
