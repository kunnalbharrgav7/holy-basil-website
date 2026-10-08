import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Save,
  User,
  Briefcase,
  Quote,
  Calendar,
} from "lucide-react";
import { getAdminEnquiryById, updateEnquiry } from "../services/enquiryService";

const ENQUIRY_STATUSES = [
  "New",
  "Contacted",
  "In Discussion",
  "Quotation Sent",
  "Approved",
  "Rejected",
  "Completed",
];

export default function AdminEnquiryDetailsSplit() {
  const { id } = useParams();
  const [enquiry, setEnquiry] = useState(null);
  const [status, setStatus] = useState("New");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadEnquiry = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getAdminEnquiryById(id);
        setEnquiry(data);
        setStatus(data.status || "New");
        setNotes(data.notes || "");
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Unable to load enquiry.");
      } finally {
        setLoading(false);
      }
    };
    loadEnquiry();
  }, [id]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const updated = await updateEnquiry(id, { status, notes });
      setEnquiry(updated);
      setStatus(updated.status || "New");
      setNotes(updated.notes || "");
      setSuccess("Enquiry updated successfully.");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Unable to update enquiry.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <main className="min-h-screen py-20 bg-[#080D0A] text-[#F5F2EB] flex items-center justify-center">
        <div className="text-emerald-400/50 animate-pulse font-serif text-xl">
          Loading details...
        </div>
      </main>
    );

  if (error && !enquiry)
    return (
      <main className="min-h-screen py-20 bg-[#080D0A] text-[#F5F2EB]">
        <div className="container-hba max-w-7xl mx-auto">
          <Link
            to="/admin/enquiries"
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-400"
          >
            <ArrowLeft size={16} /> Back to enquiries
          </Link>
          <div className="rounded-2xl border border-red-900/50 bg-red-950/40 p-5 text-red-400">
            {error}
          </div>
        </div>
      </main>
    );

  if (!enquiry) return null;

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 bg-[#080D0A] text-[#F5F2EB]">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/admin/enquiries"
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors mb-6 bg-emerald-900/20 px-4 py-2 rounded-full border border-emerald-500/20 w-fit"
        >
          <ArrowLeft size={14} /> Back to Pipeline
        </Link>

        {/* Top Header */}
        <div className="flex flex-col gap-4 border-b border-emerald-900/30 pb-6 mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-400/80 flex items-center gap-2">
              <Briefcase size={12} /> Business Enquiry
            </span>
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold font-serif text-white">
              {enquiry.company || enquiry.name || "Client Enquiry"}
            </h1>
            <p className="mt-2 text-sm text-[#F5F2EB]/50 flex items-center gap-2">
              <Calendar size={14} /> Received on{" "}
              {new Date(enquiry.createdAt).toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-8 rounded-2xl border border-red-900/50 bg-red-950/40 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Read-only Details (col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <InfoCard icon={User} title="Contact Info">
                <div className="space-y-4">
                  <InfoRow label="Name" value={enquiry.name} />
                  <InfoRow label="Company" value={enquiry.company} />
                  {enquiry.email && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60">
                        Email
                      </p>
                      <a
                        href={`mailto:${enquiry.email}`}
                        className="mt-1 flex items-center gap-2 text-xs font-semibold text-white hover:text-emerald-400 transition"
                      >
                        <Mail size={14} /> {enquiry.email}
                      </a>
                    </div>
                  )}
                  {enquiry.phone && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60">
                        Phone
                      </p>
                      <a
                        href={`tel:${enquiry.phone}`}
                        className="mt-1 flex items-center gap-2 text-xs font-semibold text-white hover:text-emerald-400 transition"
                      >
                        <Phone size={14} /> {enquiry.phone}
                      </a>
                    </div>
                  )}
                </div>
              </InfoCard>

              <InfoCard icon={MapPin} title="Market & Location">
                <div className="space-y-4">
                  <InfoRow label="Country" value={enquiry.country} />
                  <InfoRow label="Target Market" value={enquiry.targetMarket} />
                  <InfoRow
                    label="Product Category"
                    value={enquiry.productCategory}
                  />
                </div>
              </InfoCard>
            </div>

            <InfoCard icon={Building2} title="Production Requirements">
              <div className="grid sm:grid-cols-2 gap-4">
                <InfoRow
                  label="Estimated Quantity"
                  value={enquiry.estimatedQuantity}
                />
                <InfoRow
                  label="Packaging Preference"
                  value={enquiry.packagingRequirement}
                />
                <InfoRow
                  label="Private Label Required"
                  value={enquiry.privateLabel ? "Yes, needed" : "No"}
                  highlight={enquiry.privateLabel}
                />
                <InfoRow
                  label="Custom Formulation"
                  value={
                    enquiry.customFormulation
                      ? "Yes, required"
                      : "Standard formulation"
                  }
                  highlight={enquiry.customFormulation}
                />
              </div>
            </InfoCard>

            <div className="rounded-[2rem] border border-emerald-900/30 bg-[#121E1A] p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-emerald-900/20 opacity-50">
                <Quote size={80} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-900/30 border border-emerald-500/20 text-emerald-400">
                    <MessageSquare size={16} />
                  </div>
                  <h2 className="font-bold font-serif text-white text-lg">
                    Customer Message
                  </h2>
                </div>
                {enquiry.message ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#F5F2EB]/80 italic border-l-2 border-emerald-500/30 pl-4 py-2">
                    "{enquiry.message}"
                  </p>
                ) : (
                  <p className="text-sm text-[#F5F2EB]/50">
                    No message provided with this enquiry.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Admin Action Panel (col-span-4) */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 rounded-[2rem] border border-emerald-500/30 bg-gradient-to-b from-[#121E1A] to-[#0B1310] p-6 shadow-2xl">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-400/80">
                  Administration
                </span>
                <h2 className="mt-2 text-2xl font-bold font-serif text-white mb-6">
                  Action Panel
                </h2>
              </div>

              {/* Status Updater */}
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-emerald-400/60 block mb-2">
                  Current Pipeline Status
                </label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    disabled={saving}
                    className="w-full appearance-none rounded-xl border border-emerald-900/60 bg-[#080D0A] px-4 py-3.5 outline-none focus:border-emerald-400 text-white font-bold text-sm cursor-pointer transition-colors shadow-inner"
                  >
                    {ENQUIRY_STATUSES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-emerald-400">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-emerald-400/60 block mb-2">
                  Internal Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows="6"
                  disabled={saving}
                  placeholder="Draft internal remarks, follow-up dates, or pricing calculations here..."
                  className="w-full rounded-xl border border-emerald-900/60 bg-[#080D0A] px-4 py-3 outline-none focus:border-emerald-400 text-[#F5F2EB] text-sm resize-none custom-scrollbar transition-colors shadow-inner"
                />
              </div>

              {/* Save Button & Feedback */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={
                    saving ||
                    (status === enquiry.status &&
                      notes === (enquiry.notes || ""))
                  }
                  className="w-full btn-primary py-3.5 text-sm flex justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  {saving ? "Saving Changes..." : "Update Enquiry"}
                </button>

                {success && (
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-900/40 py-2.5 text-xs font-bold text-emerald-400 border border-emerald-500/20 animate-in fade-in zoom-in duration-300">
                    <CheckCircle2 size={14} /> {success}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-[2rem] border border-emerald-900/30 bg-[#121E1A] p-6 shadow-md transition hover:border-emerald-900/60">
      <div className="flex items-center gap-3 mb-5 border-b border-emerald-900/20 pb-4">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-900/30 border border-emerald-500/20 text-emerald-400">
          <Icon size={16} />
        </div>
        <h2 className="font-bold font-serif text-white text-lg">{title}</h2>
      </div>
      <div>{children}</div>
    </div>
  );
}

function InfoRow({ label, value, highlight = false }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60">
        {label}
      </p>
      <p
        className={`mt-1 text-xs font-semibold ${highlight ? "text-emerald-300" : "text-white"}`}
      >
        {value || "—"}
      </p>
    </div>
  );
}
