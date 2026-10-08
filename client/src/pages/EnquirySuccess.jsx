import { Link } from "react-router-dom";
import { CheckCircle2, ShieldCheck } from "lucide-react";

export default function EnquirySuccess() {
  return (
    <main className="min-h-screen bg-[#080D0A] py-16 md:py-24 flex items-center justify-center">
      <div className="container-hba mx-auto px-4 max-w-2xl text-center">
        <div className="rounded-[3rem] bg-[#121E1A] p-10 sm:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-emerald-900/40 relative overflow-hidden">
          {/* Subtle Glow Background */}
          <div className="absolute inset-0 bg-emerald-900/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#080D0A] text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.3)] mb-8 animate-in zoom-in duration-500">
            <CheckCircle2 size={40} />
          </div>

          <span className="relative z-10 eyebrow inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400/80">
            Enquiry Received
          </span>

          <h1 className="relative z-10 mt-4 font-serif text-4xl text-white">
            Congratulations!
          </h1>

          <p className="relative z-10 mt-4 text-base text-[#F5F2EB]/70 leading-relaxed">
            Your custom quote request has been successfully submitted and saved
            to our database. Our manufacturing and formulation team will review
            your specifications and reach out to you shortly.
          </p>

          <div className="relative z-10 mt-8 pt-8 border-t border-emerald-900/40 flex items-center justify-center gap-2 text-xs font-bold text-emerald-400/80">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Verified B2B / Custom Batch Request</span>
          </div>

          <div className="relative z-10 mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/profile" className="btn-primary px-8 py-3.5 shadow-lg">
              View Dashboard
            </Link>
            <Link to="/products" className="btn-outline px-8 py-3.5">
              Explore Products
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
